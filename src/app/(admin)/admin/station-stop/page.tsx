import { getTrainsAction } from "@/app/actions/train";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { trainColumns } from "@/components/tables/columns/train/train.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  const data = await getTrainsAction();

  return (
    <>
      <PageHeader title="Stations Stops" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Train stops</h2>

          <Link
            href={"/admin/destinations/create"}
            className={cn(buttonVariants())}
          >
            add new station stop{" "}
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={trainColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
