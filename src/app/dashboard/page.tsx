import { ROUTES } from "@/common/navigation/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(`${ROUTES.authCallback}?origin=${ROUTES.dashboard.substring(1)}`);
  }

  return <h1>{user?.email}</h1>;
};

export default Dashboard;
