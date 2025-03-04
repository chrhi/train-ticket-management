import { TrainSearchComponent } from "@/components/main-search";
import { getDistinationsAction } from "../actions/distinations";
import { getTrainClassesAction } from "../actions/train-class";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function Home() {
  const stations = await getDistinationsAction();

  const trainClasess = await getTrainClassesAction();

  return (
    <MaxWidthWrapper className="w-full h-fit mt-10">
      <TrainSearchComponent classes={trainClasess} destinations={stations} />
    </MaxWidthWrapper>
  );
}
