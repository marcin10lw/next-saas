import { db } from "@/db";
import { privateProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

export const fileRouter = router({
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
  updateFileName: privateProcedure
    .input(
      z.object({ fileId: z.string(), fileName: z.string().min(1).max(50) }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.file.update({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
        data: {
          name: input.fileName,
        },
      });
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
});
