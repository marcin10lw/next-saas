"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { trpc } from "@/app/_trpc/client";
import { ROUTES } from "@/common/navigation/routes";

const UpgradeButton = () => {
  const { mutate: createStripeSession, isLoading } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        window.location.href = url ?? ROUTES.billing;
      },
    });

  return (
    <Button
      disabled={isLoading}
      onClick={() => createStripeSession()}
      className="w-full"
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <>
          Upgrade now <ArrowRight className="ml-1.5 h-5 w-5" />
        </>
      )}
    </Button>
  );
};

export default UpgradeButton;
