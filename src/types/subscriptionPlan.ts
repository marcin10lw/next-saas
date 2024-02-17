import { getUserSubscriptionPlan } from "@/lib/stripe";

export type SubscriptionPlan = Awaited<
  ReturnType<typeof getUserSubscriptionPlan>
>;
