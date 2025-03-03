import Header from "@/components/layout/header";
import { PropsWithChildren } from "react";

export default async function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="w-full h-fit min-h-screen">
        <Header />
        {children}
      </div>
    </>
  );
}
