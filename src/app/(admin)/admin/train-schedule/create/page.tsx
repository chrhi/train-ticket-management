import { getTrainLinesAction } from "@/app/actions/train-line";
import { CreateScheduleForm } from "@/components/forms/create-train-schedule.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Page() {
  const data = await getTrainLinesAction();

  return (
    <>
      <PageHeader title="Create Train" showBackButton />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4 mt-16">
        <CreateScheduleForm trainLines={data} />
      </MaxWidthWrapper>
    </>
  );
}
