"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Map, Train, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/admin",
      icon: <Home size={20} />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users size={20} />,
    },
    {
      label: "Destinations",
      href: "/admin/destinations",
      icon: <Map size={20} />,
    },
    {
      label: "Connections",
      href: "/admin/connections",
      icon: <Map size={20} />,
    },
    {
      label: "Trains",
      href: "/admin/train-routes",
      icon: <Train size={20} />,
    },
    {
      label: "Train Routes",
      href: "/admin/train-routes",
      icon: <Train size={20} />,
    },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="py-6 px-4 border-b">
        <h2 className="text-xl font-bold text-primary">Travel Dashboard</h2>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
            U
          </div>
          <div>
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile version uses Sheet component
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-10 px-4 flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 sm:w-72">
              <NavContent />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-medium ml-4">Travel Dashboard</h1>
        </div>
        <div className="h-16" />
      </>
    );
  }

  return (
    <>
      <div className="w-64 h-screen fixed top-0 left-0 bottom-0 z-10 bg-white border-r shadow">
        <NavContent />
      </div>
      <div className="pl-64" />
    </>
  );
};

export default Sidebar;
