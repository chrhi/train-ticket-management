import { getDistinationsAction } from "@/app/actions/distinations";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { destinationsColumns } from "@/components/tables/columns/destinations.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUsersPage() {
  const data = await getDistinationsAction();

  return (
    <>
      <PageHeader title="Destinations" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Destinations</h2>

          <Link
            href={"/admin/destinations/create"}
            className={cn(buttonVariants())}
          >
            create new destination
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={destinationsColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
