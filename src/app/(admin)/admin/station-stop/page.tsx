import { getStationstopsAction } from "@/app/actions/station-stop";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { trainScheduleColumns } from "@/components/tables/columns/station-stops.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  const data = await getStationstopsAction();

  return (
    <>
      <PageHeader title="Stations Stops" />
      <MaxWidthWrapper className="my-10 mt-16">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All the Station stops</h2>

          <Link
            href={"/admin/station-stop/create"}
            className={cn(buttonVariants())}
          >
            add new station stop{" "}
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={trainScheduleColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
