"use client";

import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";

interface ValidateUploadProps {
  children: React.ReactNode;
  fileId: string;
}

const ValidateUpload = ({ fileId, children }: ValidateUploadProps) => {
  const { isLoading: isValidatingFileUpload } =
    trpc.file.validateFileUpload.useQuery(
      { fileId },
      {
        refetchOnMount: "always",
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
    );

  return isValidatingFileUpload ? (
    <div className="-mt-10 flex h-full w-full flex-col items-center justify-center gap-2">
      <p className="text-2xl font-semibold">Preparing your document</p>
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ) : (
    children
  );
};

export default ValidateUpload;
