import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Page() {
  return (
    <>
      <PageHeader title="Products" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between ">
          <h2 className="text-xl font-bold ">my main dashboard </h2>

          <Link className={cn(buttonVariants())} href={"/products/new"}>
            the main dashboard
          </Link>
        </div>
        <div className=" py-4"></div>
      </MaxWidthWrapper>
    </>
  );
}
