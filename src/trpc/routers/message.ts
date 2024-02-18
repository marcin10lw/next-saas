import { TRPCError } from "@trpc/server";
import { privateProcedure, router } from "../trpc";
import { db } from "@/db";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { z } from "zod";

export const messageRouter = router({
  getFileMessagesAmt: privateProcedure
    .input(
      z.object({
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const fileMessagesAmt = await db.message.count({
        where: {
          userId: ctx.userId,
          fileId: input.fileId,
        },
      });

      return fileMessagesAmt;
    }),
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          userId,
          id: fileId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const messages = await db.message.findMany({
        where: {
          fileId: file.id,
          userId,
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          isUserMessage: true,
          text: true,
        },
      });

      let nextCursor: string | undefined = undefined;

      if (messages.length > limit) {
        const lastMessage = messages.pop();
        nextCursor = lastMessage?.id;
      }

      return { messages, nextCursor };
    }),
});
