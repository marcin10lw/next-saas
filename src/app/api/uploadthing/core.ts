import { db } from "@/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  const subscriptionPlan = await getUserSubscriptionPlan();

  return { userId: user.id, subscriptionPlan };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;

  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: file.url,
      uploadStatus: "PROCESSING",
    },
  });

  try {
    const res = await fetch(file.url);
    const blob = await res.blob();

    const loader = new PDFLoader(blob);
    const pageLevelDocs = await loader.load();

    const pagesAmount = pageLevelDocs.length;

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pagesAmount >
      PLANS.find((plan) => plan.name.toLocaleLowerCase() === "pro")!
        .pagesPerPdf;

    const isFreeExceeded =
      pagesAmount >
      PLANS.find((plan) => plan.name.toLocaleLowerCase() === "free")!
        .pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        where: {
          id: createdFile.id,
        },
        data: {
          uploadStatus: "FAILED",
        },
      });

      return;
    }

    const pineconeIndex = pinecone.Index("quill");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: createdFile.id,
    });

    await db.file.update({
      where: {
        id: createdFile.id,
        userId: metadata.userId,
      },
      data: {
        uploadStatus: "SUCCESS",
      },
    });
  } catch (error) {
    console.log(error);

    await db.file.update({
      where: {
        id: createdFile.id,
        userId: metadata.userId,
      },
      data: {
        uploadStatus: "FAILED",
      },
    });
  }
};

export const fileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
