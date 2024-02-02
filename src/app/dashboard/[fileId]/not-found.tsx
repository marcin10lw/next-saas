import { ROUTES } from "@/common/navigation/routes";
import NotFoundPage from "@/components/NotFound";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const NotFoundFilePage = () => {
  return (
    <NotFoundPage>
      <Link
        href={ROUTES.dashboard}
        className={buttonVariants({
          variant: "link",
          className: "mt-4 text-2xl underline hover:opacity-90",
        })}
      >
        Dashboard
      </Link>
    </NotFoundPage>
  );
};
export default NotFoundFilePage;
