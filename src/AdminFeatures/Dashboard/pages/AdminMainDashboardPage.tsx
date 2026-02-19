// src/AdminFeatures/Dashboard/pages/AdminMainDashboardPage.tsx
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "@/components/Sidebar/AdminSidebar";
import { AdminSidebarProvider } from "@/components/context/AdminSidebarContext"; // Make sure this import path is correct

export default function AdminMainDashboardPage() {
  return (
    <AdminSidebarProvider>
      {" "}
      {/* ✅ Wrap the entire dashboard with the provider */}
      <div className="bg-black w-full min-h-screen flex text-white">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <AdminHeader /> {/* ✅ Now AdminHeader can use useAdminSidebar() */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminSidebarProvider>
  );
}
