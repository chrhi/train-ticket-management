"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Map,
  Train,
  Menu,
  Ticket,
  Route,
  Clock,
  Building,
  Activity,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
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

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

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
      label: "Locations",
      href: "#",
      icon: <Map size={20} />,
      children: [
        {
          label: "Destinations",
          href: "/admin/destinations",
          icon: <Map size={16} />,
        },
        {
          label: "Connections",
          href: "/admin/connections",
          icon: <Route size={16} />,
        },
      ],
    },
    {
      label: "Train Management",
      href: "#",
      icon: <Train size={20} />,
      children: [
        {
          label: "Trains",
          href: "/admin/train",
          icon: <Train size={16} />,
        },
        {
          label: "Classes",
          href: "/admin/train-classes",
          icon: <Train size={16} />,
        },
        {
          label: "Routes",
          href: "/admin/train-routes",
          icon: <Route size={16} />,
        },
        {
          label: "Schedules",
          href: "/admin/train-schedule",
          icon: <Clock size={16} />,
        },
        {
          label: "Station Stops",
          href: "/admin/station-stop",
          icon: <Building size={16} />,
        },
      ],
    },
    {
      label: "Tickets",
      href: "/admin/tickets",
      icon: <Ticket size={20} />,
    },
    {
      label: "Logs",
      href: "/admin/logs",
      icon: <Activity size={20} />,
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.includes(item.label);

    return (
      <li key={item.label}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleGroup(item.label)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors duration-200 
                ${
                  isExpanded
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isExpanded && (
              <ul className="ml-6 mt-1 space-y-1">
                {item.children?.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        pathname === child.href
                          ? "bg-primary/5 text-primary font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {child.icon}
                      <span className="text-sm">{child.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )}
      </li>
    );
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="h-16 px-4 border-b flex items-center">
        <h2 className="text-xl font-bold text-primary">Travel Dashboard</h2>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">{navItems.map(renderNavItem)}</ul>
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
        <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-10 px-4 flex items-center">
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
        <div className="h-14" />
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
