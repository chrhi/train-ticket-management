import { getTrainClassesAction } from "@/app/actions/train-class";
import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { trainClassColumns } from "@/components/tables/columns/train/train-class.columns";
import { DataTable } from "@/components/tables/data-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  const data = await getTrainClassesAction();

  return (
    <>
      <PageHeader title="Train Classes" />
      <MaxWidthWrapper className="my-10 mt-16">
        <div className="w-full h-[50px] flex items-center justify-between">
          <h2 className="text-xl font-bold">All the available classes</h2>
          <Link
            href={"/admin/train-classes/create"}
            className={cn(buttonVariants())}
          >
            create Train class
          </Link>
        </div>
        <div className="py-4">
          <DataTable columns={trainClassColumns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
