import { PropsWithChildren } from "react";

import SideBar from "@/components/layout/side-bar";
import { ModalProvider } from "@/components/modal-provider";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="relative h-screen  overflow-x-hidden">
        <SideBar />

        <div className=" w-full bg-gray-50  md:w-[calc(100vw-16rem)] md:ml-[16rem] h-fit min-h-full   flex flex-col overflow-hidden ">
          <div className="flex-1  shadow-sm relative z-10">{children}</div>
        </div>
      </div>

      <ModalProvider />
    </>
  );
}
