import { RouterOutput } from "@/app/_trpc/client";

export type UserFile = RouterOutput["getUserFiles"][number];
