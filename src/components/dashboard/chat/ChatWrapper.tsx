"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatStatusInfo from "./ChatStatusInfo";
import ChatContextProvider from "./ChatContext";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    },
  );

  if (isLoading) return <ChatStatusInfo variant="LOADING" />;

  if (data?.status === "PROCESSING")
    return <ChatStatusInfo variant="PROCESSING" />;

  if (data?.status === "FAILED") return <ChatStatusInfo variant="FAILED" />;

  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative flex min-h-screen flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50 lg:min-h-full">
        <div className="mb-28 flex flex-1 flex-col justify-between">
          <ChatMessages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
