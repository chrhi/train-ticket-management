import { getTrainsAction } from "@/app/actions/train";
import { getTrainClassesAction } from "@/app/actions/train-class";
import { CreateTrainLineForm } from "@/components/forms/create-train-line.form";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Page() {
  const [trains, trainClasses] = await Promise.all([
    getTrainsAction(),
    getTrainClassesAction(),
  ]);

  return (
    <>
      <PageHeader title="Create Train" showBackButton />
      <MaxWidthWrapper className="my-4 h-fit min-h-screen px-4 mt-16">
        <CreateTrainLineForm trains={trains} trainClasses={trainClasses} />
      </MaxWidthWrapper>
    </>
  );
}
