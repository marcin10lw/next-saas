import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { UTApi } from "uploadthing/server";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import z from "zod";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { pinecone } from "@/lib/pinecone";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const userFiles = await db.file.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return userFiles;
  }),
  getFile: privateProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return file;
    }),
  removeUserFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.file.delete({
        where: {
          userId: ctx.userId,
          id: input.id,
        },
      });

      await db.message.deleteMany({
        where: {
          fileId: file.id,
          userId: ctx.userId,
        },
      });

      const utapi = new UTApi();
      await utapi.deleteFiles(file.key);

      return file;
    }),
  getFileUploadStatus: privateProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) {
        return { status: "PENDING" as const };
      }

      return {
        status: file.uploadStatus,
      };
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

export type AppRouter = typeof appRouter;
