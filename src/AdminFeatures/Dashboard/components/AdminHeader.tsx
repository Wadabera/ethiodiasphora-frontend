// src/AdminFeatures/Dashboard/components/AdminHeader.tsx
import React, { useEffect } from "react";
import { Bell, Users, PlusCircle, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProfile } from "@/BusinessOwnerFeatures/profiles/slice/profileSlice";
import ProfileAvatar from "@/BusinessOwnerFeatures/Dashboard/components/ProfileAvatar";
import { useAdminSidebar } from "@/components/context/AdminSidebarContext";

export default function AdminHeader() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { isOpen, toggleSidebar } = useAdminSidebar();

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  return (
    <header className="bg-[#0F0F0F] border-b border-gray-800 p-6">
      <div className="flex justify-between items-center">
        {/* Left: Welcome with Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Menu Toggle Button - Only shows when sidebar is collapsed */}
          {!isOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-[#FFD700] transition-colors mr-2"
              aria-label="Expand sidebar"
            >
              <Menu size={20} />
            </button>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Welcome {loading ? "..." : user?.fullName || "Admin"}
          </h1>
          <div className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
            {user?.role || "Administrator"}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* New Approval */}
          <Link to="/admin/approvals/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:opacity-90 transition-all">
              <PlusCircle size={18} />
              <span>New Approval</span>
            </button>
          </Link>

          {/* User Management */}
          <Link to="/admin/users">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-gray-300 border border-gray-700 rounded-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all">
              <Users size={18} />
              <span>Manage Users</span>
            </button>
          </Link>

          {/* Notifications */}
          <Link to="/admin/notifications">
            <button className="relative p-3 bg-[#2A2A2A] border border-gray-700 rounded-lg hover:border-[#FFD700] transition-colors">
              <Bell size={20} className="text-gray-300 hover:text-[#FFD700]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-xs text-white rounded-full flex items-center justify-center">
                8
              </span>
            </button>
          </Link>

          {/* Profile Avatar */}
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-800">
            <ProfileAvatar fullName={user?.fullName} />
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.fullName}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
