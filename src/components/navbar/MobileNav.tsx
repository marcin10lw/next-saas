"use client";

import { useEffect, useState } from "react";

import { ROUTES } from "@/common/navigation/routes";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  user: KindeUser | null;
}

const MobileNav = ({ user }: MobileNavProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="sm:hidden">
      <Menu
        className="relative z-50 h-5 w-5 cursor-pointer text-zinc-700"
        onClick={() => setMenuOpen((prev) => !prev)}
      />

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-0 bg-black/50 animate-in fade-in-20"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-0 w-full animate-in fade-in-20 slide-in-from-top-5">
            <ul className="absolute grid w-full gap-3 border-b border-zinc-200 bg-white px-10 pb-8 pt-20 shadow-xl">
              {!user ? (
                <>
                  <li>
                    <RegisterLink className="flex w-full items-center gap-1.5 font-semibold text-green-600">
                      Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                    </RegisterLink>
                  </li>
                  <li className="my-3 h-px w-full bg-gray-300" />
                  <li>
                    <LoginLink className="flex w-full items-center gap-1.5 font-semibold">
                      Sign in <ArrowRight className="ml-1.5 h-5 w-5" />
                    </LoginLink>
                  </li>
                  <li className="my-3 h-px w-full bg-gray-300" />
                  <li>
                    <Link
                      href={ROUTES.pricing}
                      className="flex w-full items-center gap-1.5 font-semibold"
                    >
                      Pricing <ArrowRight className="ml-1.5 h-5 w-5" />
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href={ROUTES.dashboard}
                      className="flex w-full items-center gap-1.5 font-semibold"
                    >
                      Dashboard <ArrowRight className="ml-1.5 h-5 w-5" />
                    </Link>
                  </li>
                  <li className="my-3 h-px w-full bg-gray-300" />
                  <li>
                    <LogoutLink className="flex w-full items-center gap-1.5 font-semibold">
                      Log out <ArrowRight className="ml-1.5 h-5 w-5" />
                    </LogoutLink>
                  </li>
                  <li className="my-3 h-px w-full bg-gray-300" />
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileNav;
