import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/common/navigation/routes";
import UpgradeButton from "@/components/UpgradeButton";
import { buttonVariants } from "@/components/ui/button";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

interface PlanButtonProps {
  user: KindeUser | null;
  plan: string;
}

const PlanButton = ({ user, plan }: PlanButtonProps) => {
  return (
    <>
      {plan === "Free" ? (
        <Link
          href={user ? ROUTES.dashboard : ROUTES.signIn}
          className={buttonVariants({
            variant: "secondary",
            className: "w-full",
          })}
        >
          {user ? "Upgrade now" : "Sign up"}
          <ArrowRight className="ml-1.5 h-5 w-5" />
        </Link>
      ) : user ? (
        <UpgradeButton />
      ) : (
        <Link
          href={ROUTES.signIn}
          className={buttonVariants({
            className: "w-full",
          })}
        >
          Sign up
          <ArrowRight className="ml-1.5 h-5 w-5" />
        </Link>
      )}
    </>
  );
};

export default PlanButton;
