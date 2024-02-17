import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { db } from "@/db";
import { absoluteUrl } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import z from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";

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
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const billingUrl = absoluteUrl("/dashboard/billing");

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: dbUser.id,
      },
    });

    return { url: stripeSession.url };
  }),
});

export type AppRouter = typeof appRouter;
