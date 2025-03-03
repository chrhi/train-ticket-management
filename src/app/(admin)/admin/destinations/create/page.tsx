import { CreateStationForm } from "@/components/forms/create-distination.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Page() {
  return (
    <>
      <PageHeader title="Create distination" showBackButton />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4 mt-16">
        <CreateStationForm />
      </MaxWidthWrapper>
    </>
  );
}
