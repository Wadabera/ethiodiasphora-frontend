// src/components/Sidebar/BusinessSidebar.tsx (rename from BussinessOwner.tsx)
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  DollarSign,
  Briefcase,
  PlusCircle,
  User,
  Bell,
  ShieldCheck,
  Building2,
  FileText,
  LogOut,
} from "lucide-react";
import { BusinessBaseSidebar } from "./BusinessBaseSidebar";

const menuItems = [
  // Dashboard
  { icon: LayoutDashboard, label: "Dashboard", href: "/business" },

  // Company Management
  {
    icon: Building2,
    label: "Company Profile",
    href: "/business/company/profile",
  },
  {
    icon: PlusCircle,
    label: "Register Company",
    href: "/business/company/create",
  },

  // Investment Management
  { icon: Briefcase, label: "My Investments", href: "/business/myinvestment" },
  {
    icon: PlusCircle,
    label: "Create Investment",
    href: "/business/investments/create",
  },

  // IPO Management
  { icon: FileText, label: "My IPOs", href: "/business/my-ipos" },
  { icon: PlusCircle, label: "Create IPO", href: "/business/ipo/create" },

  // Market & Finance
  { icon: TrendingUp, label: "Market", href: "/business/market" },
  { icon: DollarSign, label: "Remittance", href: "/business/remittance" },
  { icon: PieChart, label: "Stock", href: "/business/stock" },

  // Profile & Settings
  { icon: ShieldCheck, label: "KYC Verification", href: "/business/kyc" },
  { icon: User, label: "Profile", href: "/business/profile" },
  { icon: Bell, label: "Notifications", href: "/business/notification" },

  // Logout
  { icon: LogOut, label: "Log Out", href: "#", isLogout: true },
];

export default function BusinessSidebar() {
  return <BusinessBaseSidebar menuItems={menuItems} portalName="Business" />;
}
