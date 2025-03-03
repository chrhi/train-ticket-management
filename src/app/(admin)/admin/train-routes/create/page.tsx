import { getTrainsAction } from "@/app/actions/train";
import { CreateTrainLineForm } from "@/components/forms/create-train-line.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Page() {
  const data = await getTrainsAction();

  console.log(data);

  return (
    <>
      <PageHeader title="Create Train" showBackButton />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4">
        <CreateTrainLineForm trains={data} />
      </MaxWidthWrapper>
    </>
  );
}
