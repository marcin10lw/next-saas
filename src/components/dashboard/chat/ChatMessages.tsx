import { trpc } from "@/app/_trpc/client";
import { useInView } from "react-intersection-observer";

import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";
import { useChatContext } from "./ChatContext";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useEffect } from "react";

interface ChatMessagesProps {
  fileId: string;
}

const ChatMessages = ({ fileId }: ChatMessagesProps) => {
  const { ref, inView } = useInView({
    threshold: 1,
  });

  const { isLoading: isAiResLoading } = useChatContext();

  const { data, isLoading, fetchNextPage, isFetchingNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      { fileId, limit: INFINITE_QUERY_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      },
    );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(isAiResLoading ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue scrollbar-w-2 flex max-h-[calc(100vh-3.5rem-10rem)] flex-1 flex-col-reverse gap-4 overflow-y-auto border-zinc-200 p-3">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                ref={ref}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="my-auto flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-zinc-700" />
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-zinc-500">
            Ask your first question to get started.
          </p>
        </div>
      )}

      {inView && isFetchingNextPage && (
        <div className="my-2 flex justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
