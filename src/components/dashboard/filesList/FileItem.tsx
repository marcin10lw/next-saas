import { trpc } from "@/app/_trpc/client";
import { ROUTES } from "@/common/navigation/routes";
import { cn } from "@/lib/utils";
import { UserFile } from "@/types/file";
import dayjs from "dayjs";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";
import FileTitle from "./FileTitle";

interface FileItemProps {
  file: UserFile;
}

const FileItem = ({ file }: FileItemProps) => {
  const utils = trpc.useUtils();

  const { data: fileMessagesAmt, isLoading: isFileMessagesAmtLoading } =
    trpc.getFileMessagesAmt.useQuery(
      { fileId: file.id },
      {
        refetchOnMount: true,
      },
    );

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
        "group col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg",
        {
          "pointer-events-none opacity-50": isRemoving,
        },
      )}
    >
      <Link
        href={`${ROUTES.dashboard}/${file.id}`}
        className="flex flex-col gap-2"
      >
        <FileTitle file={file} />
      </Link>

      <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-zinc-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {dayjs(new Date(file.createdAt)).format("MMM D, YYYY")}
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {isFileMessagesAmtLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              fileMessagesAmt
            )}
          </div>
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
