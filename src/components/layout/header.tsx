import MaxWidthWrapper from "../max-width-wrapper";

export default function Header() {
  return (
    <div className="w-full h-[70px] border-b shadow">
      <MaxWidthWrapper className="h-full flex items-center justify-start">
        <p className="font-bold text-xl text-blue-500">Train ticket system</p>
      </MaxWidthWrapper>
    </div>
  );
}
