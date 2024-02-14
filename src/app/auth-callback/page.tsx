import AuthCallback from "@/components/AuthCallback";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <AuthCallback />
    </Suspense>
  );
};

export default Page;
