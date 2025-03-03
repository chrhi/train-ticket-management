import { getTrainSchedulesAction } from "@/app/actions/schedule";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { trainScheduleColumns } from "@/components/tables/columns/schedual.column";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUsersPage() {
  const data = await getTrainSchedulesAction();

  return (
    <>
      <PageHeader title="Distinations" />
      <MaxWidthWrapper className="my-10 mt-14">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">Train Schedule</h2>

          <Link
            href={"/admin/train-schedule/create"}
            className={cn(buttonVariants())}
          >
            set schedule
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={trainScheduleColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
