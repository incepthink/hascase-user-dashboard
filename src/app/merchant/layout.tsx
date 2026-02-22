// app/owner/layout.tsx
"use client";

import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useSidebarStore } from "@/context/sidebarStore";

export default function MerchantLayout({ children }: { children: ReactNode }) {
  const { isSidebarOpen } = useSidebarStore();

  return (
    <div className="flex h-screen pt-16">
      <Sidebar />

      {/* Main content area */}
      <div
        className={`
          flex-1 overflow-y-auto transition-all duration-300 ease-in-out
          lg:${isSidebarOpen ? "ml-0" : "ml-0"}
        `}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
