// ============ src/components/Sidebar/UnifiedSidebar.tsx ============
import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { toggleMobileSidebar } from "../../features/ui/slice/uiSlice";
import AdminSidebar from "./AdminSidebar";
import BusinessSidebar from "./BussinessOwner";
import InvestorSidebar from "./InvestorSidebar";

const UnifiedSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebar, activeRole } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  // If sidebar is collapsed on mobile, don't render
  if (!sidebar.mobileOpen && window.innerWidth < 768) {
    return null;
  }

  // Render the correct sidebar based on role
  const renderSidebar = () => {
    if (activeRole === "admin" || user?.role === "admin") {
      return <AdminSidebar />;
    }
    if (activeRole === "local_business" || user?.role === "local_business") {
      return <BusinessSidebar />;
    }
    if (
      activeRole === "diaspora_investor" ||
      user?.role === "diaspora_investor"
    ) {
      return <InvestorSidebar />;
    }
    return null;
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebar.mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => dispatch(toggleMobileSidebar())}
        />
      )}

      {/* Sidebar */}
      <div className={`${!sidebar.mobileOpen ? "hidden md:block" : ""}`}>
        {renderSidebar()}
      </div>
    </>
  );
};

export default UnifiedSidebar;
