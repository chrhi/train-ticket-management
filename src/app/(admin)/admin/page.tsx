import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default async function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Admins Dashboard" />
      <MaxWidthWrapper className="my-10 mt-16">
        <div className="w-full h-fit">
          <p>in here is going to be the reports</p>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
