"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatStatusInfo from "./ChatStatusInfo";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data.state.data?.status === "SUCCESS" ||
        data.state.data?.status === "FAILED"
          ? false
          : 500,
    },
  );

  if (isLoading) return <ChatStatusInfo variant="LOADING" />;

  if (data?.status === "PROCESSING")
    return <ChatStatusInfo variant="PROCESSING" />;

  if (data?.status === "FAILED") return <ChatStatusInfo variant="FAILED" />;

  return (
    <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
      <div className="mb-28 flex flex-1 flex-col justify-between">
        <ChatMessages />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
