// components/Sidebar/SidebarToggle.tsx
import React from "react";
import { Menu } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

interface SidebarToggleProps {
  className?: string;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({
  className = "",
}) => {
  const { toggleSidebar, isOpen } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-[#FFD700] transition-colors ${className}`}
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      <Menu size={20} />
    </button>
  );
};
