"use client";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

interface ChatContextProps {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const ChatContext = createContext({} as ChatContextProps);

interface ChatContextProviderProps {
  fileId: string;
  children: ReactNode;
}

const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const { toast } = useToast();

  const utils = trpc.useUtils();
  const messageRef = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      messageRef.current = message;
      setMessage("");

      await utils.getFileMessages.cancel();

      const prevInfiniteMessages = utils.getFileMessages.getInfiniteData({
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      });

      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return { pages: [], pageParams: [] };
          }

          let newPages = [...old.pages];
          let latestPage = newPages[0];

          const newMessage = {
            id: "user-optimistic-message",
            createdAt: new Date().toISOString(),
            text: message,
            isUserMessage: true,
          };

          latestPage.messages = [newMessage, ...latestPage.messages];

          newPages[0] = latestPage;

          setIsLoading(true);

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      return {
        prevInfiniteMessages: prevInfiniteMessages,
      };
    },
    onSuccess: async (stream) => {
      if (!stream) return;

      const textDecoder = new TextDecoder();
      const reader = stream.getReader();

      let doneReading = false;
      let accText = "";

      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;

        const text = textDecoder.decode(value);
        accText += text;

        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              };
            }

            const AI_RESPONSE_ID = "ai-response";

            const isAnyAiMessage = old.pages.some((page) =>
              page.messages.some((message) => message.id === AI_RESPONSE_ID),
            );

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let messages;

                if (!isAnyAiMessage) {
                  messages = [
                    {
                      id: AI_RESPONSE_ID,
                      createdAt: new Date().toISOString(),
                      text: accText,
                      isUserMessage: false,
                    },
                    ...page.messages,
                  ];
                } else {
                  messages = page.messages.map((message) => {
                    if (message.id === AI_RESPONSE_ID) {
                      return {
                        ...message,
                        text: accText,
                      };
                    }

                    return message;
                  });
                }

                return {
                  ...page,
                  messages,
                };
              }

              return page;
            });

            return {
              ...old,
              pages: updatedPages,
            };
          },
        );
      }
    },
    onError: (_, __, context) => {
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          const prevInfiniteData = context?.prevInfiniteMessages;

          if (!prevInfiniteData) {
            return old;
          }

          let prevPages = [...prevInfiniteData.pages];
          prevPages[0].messages =
            prevPages[0].messages.slice(-INFINITE_QUERY_LIMIT);

          return {
            ...prevInfiniteData,
            pages: prevPages,
          };
        },
      );
      setMessage(messageRef.current);
      toast({
        title: "Could not send message",
        description: "Please refresh page and try again",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => {
    sendMessage({ message });
  };

  const value: ChatContextProps = {
    addMessage,
    isLoading,
    message,
    handleInputChange,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => useContext(ChatContext);

export default ChatContextProvider;
