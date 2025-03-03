"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  className?: string;
  showBackButton?: boolean;
}

export default function PageHeader({
  title,
  className,
  showBackButton = false,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header
      className={cn(
        "fixed  top-0 z-50 w-full px-4 h-16 backdrop-blur-sm bg-background/80 border-b",
        className
      )}
    >
      <div className="flex h-full items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9 rounded-full"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-semibold text-xl hidden md:block">{title}</h1>
          <h1 className="font-bold text-lg md:hidden">{title}</h1>
        </div>

        <div className="flex-1 max-w-xl mx-auto"></div>

        <div className="w-9">
          {/* This creates space balance when back button is shown */}
        </div>
      </div>
    </header>
  );
}
