import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PlansList from "@/components/pricing/PlansList";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const PricingPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <MaxWidthWrapper className="mb-8 mt-24 max-w-5xl text-center">
      <section className="mx-auto mb-10 sm:max-w-lg">
        <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
        <p className="mt-5 text-gray-600 sm:text-lg">
          Whether you&apos;re just trying our service or need more, we&apos;ve
          got you covered.
        </p>
      </section>

      <section className="pt-12">
        <TooltipProvider>
          <PlansList user={user} />
        </TooltipProvider>
      </section>
    </MaxWidthWrapper>
  );
};

export default PricingPage;
