import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { UserFile } from "@/types/file";
import { Check, Loader2, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FileTitleProps {
  file: UserFile;
}

const FileTitle = ({ file }: FileTitleProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const { toast } = useToast();

  const inputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();

  const { mutate: updateFileName, isLoading: isUpdatingFileName } =
    trpc.file.updateFileName.useMutation({
      onSuccess: () => {
        toast({
          title: "Name updated successfully.",
        });
        utils.file.getUserFiles.invalidate();
      },
      onError: () => {
        setNewName(file.name);
        toast({
          title: "Could not update file name",
          description: "Please try again",
          variant: "destructive",
        });
      },
    });

  const onNameUpdate = () => {
    const trimmedNewName = newName.trim();

    if (trimmedNewName === file.name) {
      setNewName(trimmedNewName);
      return;
    }

    if (trimmedNewName === "") {
      setNewName(file.name);
      return;
    }

    updateFileName({
      fileId: file.id,
      fileName: trimmedNewName,
    });
  };

  const onExecuteUpdateName = () => {
    setIsEdit((prev) => !prev);

    if (isEdit) {
      onNameUpdate();
    }
  };

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <div className="group relative flex w-full items-center justify-between space-x-6 px-6 pr-8 pt-6">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-500" />

      <Button
        variant="ghost"
        size="xsm"
        className={cn(
          "absolute right-2 top-8 hidden rounded-full animate-in group-hover:flex",
          {
            flex: isEdit || isUpdatingFileName,
          },
        )}
        onClick={(event) => {
          event.preventDefault();
          onExecuteUpdateName();
        }}
      >
        {isUpdatingFileName ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : isEdit ? (
          <Check className="h-3 w-3" />
        ) : (
          <Pencil className="h-3 w-3" />
        )}
      </Button>

      <div className="relative flex-1 truncate">
        <div className="flex items-center space-x-3">
          <input
            onClick={(event) => {
              event.preventDefault();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onExecuteUpdateName();
              }
            }}
            ref={inputRef}
            value={newName}
            onChange={({ target }) => setNewName(target.value)}
            readOnly={!isEdit}
            type="text"
            className={cn(
              "w-full truncate rounded-md text-lg font-medium text-zinc-900 outline-none",
              {
                "bg-gray-200 p-1": isEdit,
                "pointer-events-none": !isEdit,
              },
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FileTitle;
