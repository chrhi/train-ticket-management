import Link from "next/link";
import MaxWidthWrapper from "../max-width-wrapper";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <div className="w-full h-[70px] bg-black border-b ">
      <MaxWidthWrapper className="h-full flex items-center justify-between">
        <div className=" text-white flex items-center justify-items-start gap-x-4">
          <p className="font-bold text-xl ">CraftedNext</p>

          <Link href={"/"}>Home</Link>

          <Link href={"/"}>Ticket Validator</Link>
        </div>

        <Link
          href={"/auth"}
          className={cn(
            buttonVariants(),
            "bg-white hover:bg-white hover:text-black  text-black rounded-full"
          )}
        >
          Admin access
        </Link>
      </MaxWidthWrapper>
    </div>
  );
}
