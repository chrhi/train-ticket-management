import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import TrainTicketDashboard from "@/components/train-ticket-dashboard";

export default async function Page() {
  return (
    <>
      <PageHeader title="Admins Dashboard" />
      <MaxWidthWrapper className="my-10 mt-16">
        <TrainTicketDashboard />
      </MaxWidthWrapper>
    </>
  );
}
