"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/context/sidebarStore";
import { useEffect, useState } from "react";
import {
  Users,
  Boxes,
  FileText,
  ShoppingBag,
  Award,
  CreditCard,
  BarChart2,
  Trophy,
  PieChart,
  BadgeCheck,
  FileVideo,
  BaggageClaim,
  Coins,
} from "lucide-react";

const navItems = [
  { name: "User", href: "/merchant/user", icon: <Users size={18} /> },
  {
    name: "Collections",
    href: "/owner/collections",
    icon: <Boxes size={18} />,
  },
  {
    name: "Token",
    href: "/owner/token",
    icon: <Coins size={18} />,
  },
  { name: "Metadata", href: "/owner/metadata", icon: <FileText size={18} /> },
  {
    name: "Metadata Set",
    href: "/owner/metadata_set",
    icon: <FileVideo size={18} />,
  },
  // { name: "Orders", href: "/owner/orders", icon: <BaggageClaim size={18} /> },
  {
    name: "Paymaster",
    href: "/owner/paymaster",
    icon: <CreditCard size={18} />,
  },
  {
    name: "Loyalty Points",
    href: "/owner/loyalty",
    icon: <BarChart2 size={18} />,
  },
  { name: "Quest", href: "/owner/quests", icon: <Trophy size={18} /> },
  { name: "Badges", href: "/owner/badges", icon: <BadgeCheck size={18} /> },
  {
    name: "Leaderboard",
    href: "/owner/leaderboard",
    icon: <PieChart size={18} />,
  },
  {
    name: "Analytics",
    href: "/owner/analytics",
    icon: <BarChart2 size={18} />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useSidebarStore();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Handle responsive behavior
  useEffect(() => {
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);
    setSidebarOpen(desktop); // open on desktop, closed on mobile by default

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  // Close sidebar when clicking outside on mobile
  const handleBackdropClick = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {!isDesktop && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        style={{ zIndex: "998" }}
        className={`
          fixed lg:relative top-0 left-0 h-full bg-gray-900 text-white z-40 transition-all duration-300 ease-in-out
          ${
            isDesktop
              ? isSidebarOpen
                ? "w-64"
                : "w-16"
              : isSidebarOpen
                ? "w-64 translate-x-0"
                : "w-64 -translate-x-full"
          }
        `}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4 pt-20 lg:pt-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 relative group ${
                    pathname.startsWith(item.href) &&
                    pathname.length === item.href.length
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                  onMouseEnter={() => setShowTooltip(item.name)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>

                  {/* Text - hidden when collapsed on desktop */}
                  <span
                    className={`ml-3 transition-all duration-300 ${
                      isDesktop && !isSidebarOpen
                        ? "opacity-0 w-0 overflow-hidden"
                        : "opacity-100"
                    }`}
                  >
                    {item.name}
                  </span>

                  {/* Tooltip for collapsed state */}
                  {isDesktop && !isSidebarOpen && showTooltip === item.name && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg z-50 whitespace-nowrap">
                      {item.name}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
