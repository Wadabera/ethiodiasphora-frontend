// components/Sidebar/BaseSidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  isLogout?: boolean;
}

interface BaseSidebarProps {
  menuItems: MenuItem[];
  portalName: string;
}

export const BaseSidebar: React.FC<BaseSidebarProps> = ({
  menuItems,
  portalName,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  // Separate regular items from logout item
  const regularItems = menuItems.filter((item) => !item.isLogout);
  const logoutItem = menuItems.find((item) => item.isLogout);

  return (
    <aside
      className={`bg-[#0F0F0F] border-r border-gray-800 min-h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {isOpen ? (
          <Link
            to={`/${portalName.toLowerCase()}`}
            className="flex items-center gap-3"
          >
            <div className="bg-[#FFD700] text-black font-bold text-xl px-3 py-2 rounded-lg min-w-[40px] text-center">
              ET
            </div>
            <span className="text-[#FFD700] font-bold whitespace-nowrap">
              {portalName} Portal
            </span>
          </Link>
        ) : (
          <Link to={`/${portalName.toLowerCase()}`} className="mx-auto">
            <div className="bg-[#FFD700] text-black font-bold text-xl px-3 py-2 rounded-lg">
              ET
            </div>
          </Link>
        )}

        {/* Toggle Button inside sidebar */}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-[#FFD700] transition-colors"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {regularItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-[#FFD700]/10 text-[#FFD700] border-l-4 border-[#FFD700]"
                  : "text-gray-300 hover:bg-gray-800"
              } ${!isOpen && "justify-center"}`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon size={20} className="min-w-[20px]" />
              {isOpen && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        {logoutItem && (
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left text-gray-300 hover:bg-gray-800 hover:text-red-400 border border-red-500/30 ${
              !isOpen && "justify-center"
            }`}
            title={!isOpen ? logoutItem.label : undefined}
          >
            <LogOut size={20} className="min-w-[20px]" />
            {isOpen && <span>{logoutItem.label}</span>}
          </button>
        )}
      </nav>
    </aside>
  );
};
