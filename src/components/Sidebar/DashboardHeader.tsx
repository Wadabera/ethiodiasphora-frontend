// components/Layout/DashboardHeader.tsx
import React from "react";
import { SidebarToggle } from "@/components/Sidebar/SidebarToggle";
import { useSidebar } from "../context/SidebarContext";

interface DashboardHeaderProps {
  title?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const { isOpen } = useSidebar();

  return (
    <header className="bg-[#0F0F0F] border-b border-gray-800 py-4 px-6">
      <div className="flex items-center gap-4">
        {/* Toggle button - visible when sidebar is collapsed */}
        {!isOpen && <SidebarToggle />}

        {title && <h1 className="text-xl font-semibold text-white">{title}</h1>}
      </div>
    </header>
  );
};
