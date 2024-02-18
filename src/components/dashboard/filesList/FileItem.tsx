import { trpc } from "@/app/_trpc/client";
import { ROUTES } from "@/common/navigation/routes";
import { cn } from "@/lib/utils";
import { UserFile } from "@/types/file";
import dayjs from "dayjs";
import { Loader2, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import FileTitle from "./FileTitle";
import RemoveFile from "./RemoveFile";

interface FileItemProps {
  file: UserFile;
}

const FileItem = ({ file }: FileItemProps) => {
  const { data: fileMessagesAmt, isLoading: isFileMessagesAmtLoading } =
    trpc.message.getFileMessagesAmt.useQuery(
      { fileId: file.id },
      {
        refetchOnMount: true,
      },
    );

  const { isLoading: isRemoving } = trpc.file.removeUserFile.useMutation();

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

        <RemoveFile fileId={file.id} />
      </div>
    </li>
  );
};

export default FileItem;
