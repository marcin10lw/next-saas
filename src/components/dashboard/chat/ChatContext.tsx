"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

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

  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

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
        throw Error("Failed to send message");
      }

      return response.body;
    },
  });

  const addMessage = () => sendMessage({ message });

  const value: ChatContextProps = {
    addMessage,
    isLoading: false,
    message,
    handleInputChange,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => useContext(ChatContext);

export default ChatContextProvider;
