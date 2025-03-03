import { getConnectionsAction } from "@/app/actions/connections";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { connectionsColumns } from "@/components/tables/columns/connections.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminUsersPage() {
  const data = await getConnectionsAction();

  return (
    <>
      <PageHeader title="Connections" showBackButton />
      <MaxWidthWrapper className="my-10 mt-16">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Connections</h2>

          <Link
            href={"/admin/connections/create"}
            className={cn(buttonVariants())}
          >
            create new connection
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={connectionsColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
