import { SubscriptionPlan } from "@/types/subscriptionPlan";
import UserFiles from "./UserFiles";
import UploadButton from "./upload/UploadButton";

interface DashboardProps {
  subscriptionPlan: SubscriptionPlan;
}

const Dashboard = ({ subscriptionPlan }: DashboardProps) => {
  return (
    <main className="mx-auto max-w-7xl px-2.5 md:p-10">
      <section className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 text-5xl font-bold text-gray-900">My Files</h1>
        <UploadButton isSubscribed={subscriptionPlan.isSubscribed} />
      </section>
      <UserFiles />
    </main>
  );
};

export default Dashboard;
