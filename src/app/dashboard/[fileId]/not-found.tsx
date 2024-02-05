import { ROUTES } from "@/common/navigation/routes";
import NotFoundPage from "@/components/NotFound";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const NotFoundFilePage = () => {
  return (
    <NotFoundPage title="File not found">
      <Link
        href={ROUTES.dashboard}
        replace
        className={buttonVariants({
          variant: "link",
          className: "text-2xl underline hover:opacity-90",
        })}
      >
        Dashboard
      </Link>
    </NotFoundPage>
  );
};
export default NotFoundFilePage;
