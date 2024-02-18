import { RouterOutput } from "@/app/_trpc/client";

type Messages = RouterOutput["message"]["getFileMessages"]["messages"];

type OmitTextMessage = Omit<Messages[number], "text">;

type MessageText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitTextMessage & MessageText;
