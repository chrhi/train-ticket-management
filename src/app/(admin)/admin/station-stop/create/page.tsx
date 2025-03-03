import { getDistinationsAction } from "@/app/actions/distinations";
import { getTrainSchedulesAction } from "@/app/actions/schedule";
import { CreateStationStopForm } from "@/components/forms/create-station-stop.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Page() {
  const [stations, trainSchedule] = await Promise.all([
    getDistinationsAction(),
    getTrainSchedulesAction(),
  ]);

  return (
    <>
      <PageHeader title="Create Station stop" showBackButton />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4">
        <CreateStationStopForm
          stations={stations}
          trainSchedules={trainSchedule}
        />
      </MaxWidthWrapper>
    </>
  );
}
