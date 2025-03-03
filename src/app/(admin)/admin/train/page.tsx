import { getTrainsAction } from "@/app/actions/train";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { trainColumns } from "@/components/tables/columns/train/train.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUsersPage() {
  const data = await getTrainsAction();

  return (
    <>
      <PageHeader title="Distinations" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Trains</h2>

          <Link href={"/admin/train/create"} className={cn(buttonVariants())}>
            create new distination
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={trainColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
