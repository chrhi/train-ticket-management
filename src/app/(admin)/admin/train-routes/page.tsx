import { getTrainLinesAction } from "@/app/actions/train-line";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { trainLineColumns } from "@/components/tables/columns/train/train-line.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrainTrack } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const data = await getTrainLinesAction();

  return (
    <>
      <PageHeader title="Admin users" />
      <MaxWidthWrapper className="my-20">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Train routes</h2>
          <Link
            href={"/admin/train-routes/create"}
            className={cn(buttonVariants(), "space-x-4")}
          >
            <TrainTrack />
            set new Train line
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={trainLineColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
