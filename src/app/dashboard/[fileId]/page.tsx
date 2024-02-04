import { ROUTES } from "@/common/navigation/routes";
import ChatWrapper from "@/components/dashboard/ChatWrapper";
import PdfRenderer from "@/components/dashboard/pdfRenderer/PdfRenderer";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    fileId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { fileId } = params;

  if (!fileId) {
    redirect(ROUTES.dashboard);
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(`${ROUTES.authCallback}?origin=${ROUTES.dashboard.substring(1)}`);
  }

  const file = await db.file.findFirst({
    where: {
      userId: user.id,
      id: fileId,
    },
  });

  if (!file) {
    notFound();
  }

  return (
    <main className="flex h-[calc(100vh-3.5rem)] flex-1 flex-col justify-between">
      <section className="mx-auto w-full max-w-screen-2xl grow lg:flex xl:px-2">
        <article className="flex-1 xl:flex">
          <div className="h-full px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer fileUrl={file.url} />
          </div>
        </article>

        <article className="border-7 flex-[0.75] shrink-0 border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper />
        </article>
      </section>
    </main>
  );
};

export default Page;
