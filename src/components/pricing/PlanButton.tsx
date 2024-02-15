import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ROUTES } from "@/common/navigation/routes";
import UpgradeButton from "@/components/pricing/UpgradeButton";
import { buttonVariants } from "@/components/ui/button";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface PlanButtonProps {
  user: KindeUser | null;
  plan: string;
}

const PlanButton = ({ user, plan }: PlanButtonProps) => {
  if (plan === "Free") {
    return user ? (
      <Link
        href={ROUTES.billing}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full",
        })}
      >
        Upgrade now
        <ArrowRight className="ml-1.5 h-5 w-5" />
      </Link>
    ) : (
      <LoginLink
        postLoginRedirectURL="/pricing"
        className={buttonVariants({
          variant: "secondary",
          className: "w-full",
        })}
      >
        Sign up
        <ArrowRight className="ml-1.5 h-5 w-5" />
      </LoginLink>
    );
  }

  if (plan === "Pro") {
    return user ? (
      <UpgradeButton />
    ) : (
      <LoginLink
        postLoginRedirectURL="/pricing"
        className={buttonVariants({
          className: "w-full",
        })}
      >
        Sign up
        <ArrowRight className="ml-1.5 h-5 w-5" />
      </LoginLink>
    );
  }

  return null;
};

export default PlanButton;
