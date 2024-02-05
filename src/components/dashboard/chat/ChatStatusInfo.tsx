import { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";

import { ROUTES } from "@/common/navigation/routes";
import { buttonVariants } from "@/components/ui/button";
import ChatInput from "./ChatInput";

interface ChatStatusInfoProps {
  icon: ReactNode;
  title: string | ReactNode;
  description: string | ReactNode;
}

const ChatStatusInfoWrapper = ({
  icon,
  title,
  description,
}: ChatStatusInfoProps) => {
  return (
    <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
      <div className="mb-28 flex flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          {icon}
          <h3 className="text-xl font-semibold">{title}</h3>
          {description}
        </div>
      </div>

      <ChatInput isDisabled />
    </div>
  );
};

type Status = "LOADING" | "PROCESSING" | "FAILED";

const ChatStatusInfo = ({ variant }: { variant: Status }) => {
  const statusRecord: Record<Status, ReactNode> = {
    LOADING: (
      <ChatStatusInfoWrapper
        icon={<Loader2 className="h-8 w-8 animate-spin text-zinc-900" />}
        title="Loading..."
        description={
          <p className="text-sm text-zinc-500">
            We&apos;re preparing your PDF.
          </p>
        }
      />
    ),
    PROCESSING: (
      <ChatStatusInfoWrapper
        icon={<Loader2 className="h-8 w-8 animate-spin text-zinc-900" />}
        title="Processing PDF..."
        description={
          <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
        }
      />
    ),
    FAILED: (
      <ChatStatusInfoWrapper
        icon={<XCircle className="h-8 w-8 text-red-800" />}
        title="Too many pages in PDF"
        description={
          <>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF
            </p>
            <Link
              href={ROUTES.dashboard}
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="mr-1.5 h-3 w-3" />
              Back
            </Link>
          </>
        }
      />
    ),
  };

  return statusRecord[variant];
};

export default ChatStatusInfo;
