import BillingForm from "@/components/dashboard/billing/BillingForm";
import { getUserSubscriptionPlan } from "@/lib/stripe";

const Billing = async () => {
  const subscriptionPlan = await getUserSubscriptionPlan();

  return <BillingForm subscriptionPlan={subscriptionPlan} />;
};

export default Billing;
