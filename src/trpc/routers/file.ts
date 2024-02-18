import { db } from "@/db";
import { getPageLevelDocs } from "@/lib/getPagesAmount";
import { pinecone } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { checkIsPagesAmtExceeded } from "@/lib/utils";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { z } from "zod";
import { privateProcedure, router } from "../trpc";

export const fileRouter = router({
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const userFiles = await db.file.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return userFiles;
  }),
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return file;
    }),
  updateFileName: privateProcedure
    .input(
      z.object({ fileId: z.string(), fileName: z.string().min(1).max(50) }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.file.update({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
        data: {
          name: input.fileName,
        },
      });
    }),
  removeUserFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.file.delete({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
      });

      const utapi = new UTApi();
      await utapi.deleteFiles(file.key);

      return file;
    }),
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) {
        return { status: "PENDING" as const };
      }

      return {
        status: file.uploadStatus,
      };
    }),
  validateFileUpload: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId } = input;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const subscriptionPlan = await getUserSubscriptionPlan();

      const { pageLevelDocs } = await getPageLevelDocs(file.url);
      const pagesAmount = pageLevelDocs.length;

      const { isSubscribed } = subscriptionPlan;

      const isProExceeded = checkIsPagesAmtExceeded(pagesAmount, "pro");
      const isFreeExceeded = checkIsPagesAmtExceeded(pagesAmount, "free");

      if (file.uploadStatus === "FAILED" && isSubscribed && !isProExceeded) {
        try {
          const pineconeIndex = pinecone.Index("quill");

          const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
          });

          await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
            pineconeIndex,
            namespace: file.id,
          });

          await db.file.update({
            where: {
              id: file.id,
              userId,
            },
            data: {
              uploadStatus: "SUCCESS",
            },
          });

          return { message: "PDF processed" as const };
        } catch (error) {
          await db.file.update({
            where: {
              id: file.id,
              userId,
            },
            data: {
              uploadStatus: "FAILED",
            },
          });

          return { message: "Could not process file" as const };
        }
      }

      if (file.uploadStatus === "SUCCESS" && !isSubscribed && isFreeExceeded) {
        await db.file.update({
          where: {
            id: file.id,
            userId,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),
});
