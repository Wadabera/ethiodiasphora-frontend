// src/InvestorFearutes/dashboard/components/Header.tsx (InvestorHeader)
import { Bell, Users, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProfile } from "@/BusinessOwnerFeatures/profiles/slice/profileSlice";
import ProfileAvatar from "./ProfileAvatar";
import { useInvestorSidebar } from "@/components/context/InvestorSidebarContext";

export default function Header() {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector((state) => state.profile);
  const { isOpen, toggleSidebar } = useInvestorSidebar();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <header className="bg-black border-b border-gray-800 p-6">
      <div className="flex justify-between items-center">
        {/* Left: Welcome with Menu Toggle */}
        <div className="flex items-center gap-2">
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Welcome {loading ? "..." : profile?.fullName || "User"}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* New Project */}
          <Link to="/business/projects/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg hover:from-orange-700 hover:to-yellow-700 transition-all">
              <span>New Project</span>
            </button>
          </Link>

          {/* My Investments */}
          <Link to="/business/investors">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:border-yellow-600 hover:text-yellow-400 transition-all">
              <Users size={18} />
              <span>My Investment</span>
            </button>
          </Link>

          {/* Notifications */}
          <Link to="/business/notifications">
            <button className="relative p-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-yellow-600 transition-colors">
              <Bell size={20} className="text-gray-300 hover:text-yellow-400" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-xs text-white rounded-full flex items-center justify-center">
                8
              </span>
            </button>
          </Link>

          {/* Profile Avatar */}
          <ProfileAvatar fullName={profile?.fullName} />
        </div>
      </div>
    </header>
  );
}
