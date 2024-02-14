import { getUserSubscriptionPlan } from "@/lib/stripe";
import { Icons } from "../Icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { ROUTES } from "@/common/navigation/routes";
import { Gem } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface UserAccountNavProps {
  email: string | null;
  imageUrl: string | null;
  name: string;
}

const UserAccountNav = async ({
  email,
  imageUrl,
  name,
}: UserAccountNavProps) => {
  const subscriptionPlane = await getUserSubscriptionPlan();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="aspect-square h-8 w-8 rounded-full bg-transparent hover:bg-transparent">
          <Avatar className="relative h-8 w-8">
            {imageUrl ? (
              <AvatarImage
                src={imageUrl}
                alt="profile picture"
                className="h-full w-full"
              />
            ) : (
              <AvatarFallback className="h-full w-full text-xl uppercase text-slate-500">
                <span className="sr-only">{name}</span>
                <Icons.user className="h-5 w-5" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && (
              <p className="text-sm font-medium capitalize text-black">
                {name}
              </p>
            )}
            {email && (
              <p className="w-[200px] truncate text-xs text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="cursor-pointer" href={ROUTES.dashboard}>
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {subscriptionPlane.isSubscribed ? (
            <Link className="cursor-pointer" href={ROUTES.billing}>
              Manage Subscription
            </Link>
          ) : (
            <Link className="cursor-pointer" href={ROUTES.pricing}>
              Upgrade <Gem className="ml-1.5 h-4 w-4 text-purple-600" />
            </Link>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
