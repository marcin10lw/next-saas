import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { ROUTES } from "@/common/navigation/routes";
import { buttonVariants } from "../ui/button";
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={ROUTES.home} className="flex-z-40 font-semibold">
            <span>quill.</span>
          </Link>

          <div className="hidden items-center space-x-4 sm:flex">
            {!user ? (
              <>
                <Link
                  href={ROUTES.pricing}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Sign in
                </LoginLink>
                <RegisterLink className={buttonVariants({ size: "sm" })}>
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.dashboard}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Dashboard
                </Link>

                <UserAccountNav
                  email={user.email}
                  imageUrl={user.picture}
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
