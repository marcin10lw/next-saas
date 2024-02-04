import { trpc } from "@/app/_trpc/client";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Cloud, File } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "../../ui/progress";
import { useToast } from "../../ui/use-toast";

const UploadDropzone = () => {
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();

  const onUploadError = () => {
    setIsUploadingFile(false);
    toast({
      title: "Something went wrong",
      description: "Please try again",
      variant: "destructive",
    });
  };

  const startSimulateProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (uploadProgress >= 95) {
          clearInterval(interval);
          return uploadProgress;
        }

        return prev + 5;
      });
    }, 300);

    return interval;
  };

  const { startUpload } = useUploadThing("imageUploader");

  const utils = trpc.useUtils();

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: async () => {
      await utils.getUserFiles.invalidate();
      toast({
        title: "PDF Successfully Uploaded!",
      });
      setIsUploadingFile(false);
    },
    retry: 3,
    retryDelay: 500,
  });

  async function onFileDrop<T extends File>(acceptedFile: T[]) {
    setIsUploadingFile(true);
    const progressInterval = startSimulateProgress();

    const res = await startUpload(acceptedFile);
    if (!res) {
      return onUploadError();
    }

    const [fileResponse] = res;

    const key = fileResponse.key;
    if (!key) {
      return onUploadError();
    }

    startPolling({ key });

    clearInterval(progressInterval);
    setUploadProgress(100);
  }

  return (
    <Dropzone multiple={false} onDrop={onFileDrop}>
      {({ getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className={cn(
            "m-4 h-64 rounded-lg border border-dashed border-gray-300",
            {
              "pointer-events-none": isUploadingFile,
            },
          )}
        >
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <Cloud className="mb-2 h-6 w-6 text-zinc-500" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {!!acceptedFiles && !!acceptedFiles[0] && (
                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                  <div className="grid h-full place-items-center px-3 py-2">
                    <File className="h-4 w-4 text-zinc-500" />
                  </div>

                  <div className="h-full truncate px-3 py-2 text-sm">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              )}

              {isUploadingFile && (
                <div className="mx-auto mt-4 w-full max-w-xs">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadDropzone;
