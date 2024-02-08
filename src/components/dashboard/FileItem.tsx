import { RouterOutput, trpc } from "@/app/_trpc/client";
import { ROUTES } from "@/common/navigation/routes";
import dayjs from "dayjs";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FileItemProps {
  file: RouterOutput["getUserFiles"][number];
}

const FileItem = ({ file }: FileItemProps) => {
  const utils = trpc.useUtils();

  const { mutate: removeFile, isLoading: isRemoving } =
    trpc.removeUserFile.useMutation({
      onSuccess: async () => {
        await utils.getUserFiles.invalidate();
      },
    });

  const deleteFile = async () => {
    removeFile({ id: file.id });
  };

  return (
    <li
      key={file.id}
      className={cn(
        "col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg",
        {
          "pointer-events-none opacity-50": isRemoving,
        },
      )}
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

        <Button
          variant="destructive"
          className="h-fit w-fit p-2"
          onClick={deleteFile}
        >
          {isRemoving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </li>
  );
};

export default FileItem;
