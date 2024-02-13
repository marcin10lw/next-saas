import { Check, HelpCircle, Minus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import PlanButton from "./PlanButton";
import { pricingItems } from "./pricingItems";

interface PlansListProps {
  user: KindeUser | null;
}

const PlansList = ({ user }: PlansListProps) => {
  return (
    <ul className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      {pricingItems.map(({ plan, features, quota, tagline }) => {
        const price =
          PLANS.find((p) => p.slug === plan.toLocaleLowerCase())?.price
            .amount || 0;

        return (
          <li
            key={plan}
            className={cn("relative rounded-2xl bg-white shadow-lg", {
              "border-2 border-purple-950 shadow-zinc-200": plan === "Pro",
              "border border-gray-200": plan !== "Pro",
            })}
          >
            {plan === "Pro" && (
              <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-purple-950 to-purple-500 px-3 py-2 text-sm font-medium text-white">
                Upgrade now
              </div>
            )}

            <div className="p-5">
              <h3 className="font-display my-3 text-center text-3xl font-bold">
                {plan}
              </h3>
              <p className="text-gray-500">{tagline}</p>
              <p className="font-display my-5 text-6xl font-semibold">
                ${price}
              </p>
              <p className="text-gray-500">per month</p>
            </div>

            <div className="flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-1">
                <p>{quota.toLocaleString()} PDFs/mo included</p>

                <Tooltip delayDuration={300}>
                  <TooltipTrigger className="ml-1.5 cursor-default">
                    <HelpCircle className="h-4 w-4 text-zinc-500" />
                  </TooltipTrigger>
                  <TooltipContent className="w-80 p-2">
                    How many PDFs you can upload per month
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <ul className="my-10 space-y-5 px-8">
              {features.map(({ text, footnote, negative }) => (
                <li key={text} className="flex space-x-5">
                  <div className="flex-shrink-0">
                    {negative ? (
                      <Minus className="h-6 w-6 text-gray-300" />
                    ) : (
                      <Check className="h-6 w-6 text-purple-500" />
                    )}
                  </div>
                  {footnote ? (
                    <div className="flex items-center space-x-1">
                      <p
                        className={cn("text-gray-400", {
                          "text-gray-400": negative,
                          "text-zinc-900": !negative,
                        })}
                      >
                        {text}
                      </p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="mt-0.5 cursor-default pl-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          {footnote}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <p
                      className={cn("text-gray-400", {
                        "text-gray-400": negative,
                        "text-zinc-900": !negative,
                      })}
                    >
                      {text}
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200" />

            <div className="p-5">
              <PlanButton user={user} plan={plan} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default PlansList;
