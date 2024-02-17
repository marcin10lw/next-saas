"use client";

import { trpc } from "@/app/_trpc/client";
import { GhostIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Skeleton from "react-loading-skeleton";
import FileItem from "./FileItem";

const UserFiles = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery(undefined, {
    staleTime: 0,
  });

  const [listRef] = useAutoAnimate();

  if (!files || isLoading) {
    return (
      <div className="mt-2">
        <Skeleton height={100} className="my-2" count={4} />
      </div>
    );
  }

  return (
    <section>
      {files.length > 0 ? (
        <ul
          ref={listRef}
          className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3"
        >
          {files.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
        </ul>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <GhostIcon className="md:h-16 md:w-16" />
          <h3 className="font-semibold md:text-2xl">There are no files yet.</h3>
          <p>Let&apos;s upload your first PFD.</p>
        </div>
      )}
    </section>
  );
};

export default UserFiles;
