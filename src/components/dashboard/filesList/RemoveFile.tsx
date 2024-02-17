import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { trpc } from "@/app/_trpc/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const RemoveFile = ({ fileId }: { fileId: string }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const utils = trpc.useUtils();

  const { toast } = useToast();

  const { mutate: removeFile, isLoading: isRemoving } =
    trpc.removeUserFile.useMutation({
      onSuccess: async () => {
        await utils.getUserFiles.invalidate();
      },
      onError: () => {
        toast({
          title: "Could not remove file",
          description: "Please try again",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setModalOpen(false);
      },
    });

  const deleteFile = async () => {
    removeFile({ id: fileId });
  };

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={() => {
        setModalOpen((modalOpen) => !modalOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="h-fit w-fit p-2">
          {isRemoving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash className="h-3.5 w-3.5" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 flex-shrink-0 text-red-700" />
          <p className="mr-20 font-semibold text-zinc-700">
            This file will be deleted, along with all of its chat messages.
          </p>
        </div>
        <Button variant="destructive" onClick={deleteFile}>
          {isRemoving ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            "Remove Permanently"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveFile;
