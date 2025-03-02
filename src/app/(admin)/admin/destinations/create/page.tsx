import { getDistinationsAction } from "@/app/actions/distinations";
import { CreateStationForm } from "@/components/forms/create-distination.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function AdminUsersPage() {
  const data = await getDistinationsAction();

  return (
    <>
      <PageHeader title="Create distination" />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4">
        <CreateStationForm destinations={data} />
      </MaxWidthWrapper>
    </>
  );
}
