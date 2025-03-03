import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { CreatAdminModal } from "@/components/modals/create-admin";

export default async function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Admin users" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All Admin Users</h2>
          <CreatAdminModal />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
