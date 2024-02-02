"use client";

import { trpc } from "@/app/_trpc/client";
import { ROUTES } from "@/common/navigation/routes";
import { GhostIcon, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import { Button } from "./ui/button";

const UserFiles = () => {
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  if (!files || isLoading) {
    return (
      <div className="mt-2">
        <Skeleton height={100} className="my-2" count={4} />
      </div>
    );
  }
  console.log(files);
  return (
    <section>
      {files.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
            >
              <Link
                href={`${ROUTES.dashboard}/${file.id}`}
                className="flex flex-col gap-2"
              >
                <div className="flex w-full items-center justify-between space-x-6 px-6 pt-6">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />

                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-lg font-medium text-zinc-900">
                        {file.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-4 grid grid-cols-3 place-items-center gap-6 px-6 py-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {dayjs(new Date(file.createdAt)).format("MMM D, YYYY")}
                </div>

                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  mocked
                </div>

                <Button variant="destructive" className="h-fit w-fit p-2">
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
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
