import { getAdminsAction } from "@/app/actions/admins";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { usersColumns } from "@/components/tables/columns/users-columns";
import { DataTable } from "@/components/tables/data-table";

export default async function AdminUsersPage() {
  const data = await getAdminsAction();

  return (
    <>
      <PageHeader title="Admin users" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Train routes</h2>
        </div>
        <div className="py-4">
          <DataTable columns={usersColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
