import { ROUTES } from "@/common/navigation/routes";
import Dashboard from "@/components/dashboard/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(`${ROUTES.authCallback}?origin=${ROUTES.dashboard.substring(1)}`);
  }

  const dbUser = await db.user.findFirst({ where: { id: user.id } });

  if (!dbUser) {
    redirect(`${ROUTES.authCallback}?origin=${ROUTES.dashboard.substring(1)}`);
  }

  return <Dashboard />;
};

export default Page;
