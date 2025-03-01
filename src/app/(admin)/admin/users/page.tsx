import PageHeader from "@/components/layout/page-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { CreatAdminModal } from "@/components/modals/create-admin";
import { Product, columns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table";

async function getData(): Promise<Product[]> {
  const data: Product[] = [];

  if (!data) {
    return [];
  }

  const products = data?.map((item) => {
    return {
      id: item.id,
      status: "Active",
      price: Number(item.price),
      title: item.title,
      //@ts-expect-error this urls exists
      media: item.media?.urls[0] as string,
      createdAt: item.createdAt,
    };
  });

  return products;
}

export default async function Page() {
  const data = await getData();

  return (
    <>
      <PageHeader title="Products" />
      <MaxWidthWrapper className="my-10">
        <div className="w-full h-[50px] flex items-center justify-between ">
          <h2 className="text-xl font-bold ">All Products </h2>

          <CreatAdminModal />
        </div>
        <div className=" py-4">
          <DataTable columns={columns} data={data} />
        </div>
      </MaxWidthWrapper>
    </>
  );
}
