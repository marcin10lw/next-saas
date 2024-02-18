"use client";

import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { SubscriptionPlan } from "@/types/subscriptionPlan";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";

interface BillingFormProps {
  subscriptionPlan: SubscriptionPlan;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { toast } = useToast();

  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          window.location.href = url;
        } else {
          toast({
            title: "There was a problem...",
            description: "Please try again in a moment",
            variant: "destructive",
          });
        }
      },
    });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(event) => {
          event.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>{" "}
              plan
            </CardDescription>
          </CardHeader>
          {/* <CardContent><p>Card Content</p></CardContent> */}
          <CardFooter className="flex flex-col items-start gap-2">
            <Button disabled={isLoading} type="submit" className="flex gap-2">
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription"
                : "Upgrade to PRO"}
              {isLoading && (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              )}
            </Button>

            {subscriptionPlan.isSubscribed && (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? "Your plan will be canceled on "
                  : "Your plan renews on "}
                {dayjs(subscriptionPlan.stripeCurrentPeriodEnd!).format(
                  "MMMM D, YYYY",
                )}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
