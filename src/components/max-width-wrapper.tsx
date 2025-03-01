import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full  lg:max-w-[1200px] overflow-x-hidden 2xl:overflow-x-visible h-fit px-4 ",

        className
      )}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper
