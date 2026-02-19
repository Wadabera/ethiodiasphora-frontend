// src/BusinessOwnerFeatures/Dashboard/pages/BusinessMainDashboardPage.tsx
import { Outlet } from "react-router-dom";
import BusinessHeader from "../components/BusinessHeader";
import BussinessOwner from "@/components/Sidebar/BussinessOwner";
import { BusinessSidebarProvider } from "@/components/context/BusinessSidebarContext";

export default function BusinessMainDashboardPage() {
  return (
    <BusinessSidebarProvider>
      <div className="bg-black w-full min-h-screen flex text-white">
        <BussinessOwner />
        <main className="flex-1 overflow-auto">
          <BusinessHeader />
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </BusinessSidebarProvider>
  );
}
