// src/InvestorFearutes/dashboard/pages/MainDashboardPage.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import InvestorSidebar from "@/components/Sidebar/InvestorSidebar";
import { InvestorSidebarProvider } from "@/components/context/InvestorSidebarContext";

export default function MainDashboardPage() {
  return (
    <InvestorSidebarProvider>
      <div className="bg-black w-full min-h-screen flex text-white">
        <InvestorSidebar />
        <main className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </InvestorSidebarProvider>
  );
}
