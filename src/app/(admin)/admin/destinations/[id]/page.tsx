import {
  getDestinationByIdAction,
  getDistinationsAction,
} from "@/app/actions/distinations";
import { UpdateStationForm } from "@/components/forms/update-distination.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [data, destination] = await Promise.all([
    getDistinationsAction(),
    getDestinationByIdAction(id),
  ]);

  if (!destination) {
    notFound();
  }

  return (
    <>
      <PageHeader title="Create distination" />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4">
        <UpdateStationForm destinations={data} stationId={destination?.id} />
      </MaxWidthWrapper>
    </>
  );
}
