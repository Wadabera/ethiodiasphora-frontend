// components/Sidebar/AdminSidebar.tsx
import {
  LayoutDashboard,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  FileText,
  TrendingUp,
  UserCheck,
  Building2,
  LogOut,
} from "lucide-react";
import { BaseSidebar } from "./BaseSidebar";

const menuItems = [
  // Dashboard
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },

  // Investment Management
  {
    icon: TrendingUp,
    label: "All Investments",
    href: "/admin/investmetmentApprove",
  },

  // IPO Management
  { icon: ShieldCheck, label: "All IPOs", href: "/admin/all" },

  // KYC Management
  { icon: UserCheck, label: "KYC Approvals", href: "/admin/kycApproved" },
  { icon: Shield, label: "KYC Records", href: "/admin/kyc" },

  // Company Management
  {
    icon: Building2,
    label: "Company Approvals",
    href: "/admin/companyApprove",
  },

  // User Management
  { icon: Users, label: "Users", href: "/admin/users" },

  // Profile & Settings
  { icon: FileText, label: "Profiles", href: "/admin/profiles" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },

  // Logout
  { icon: LogOut, label: "Log Out", href: "#", isLogout: true },
];

export default function AdminSidebar() {
  return <BaseSidebar menuItems={menuItems} portalName="Admin" />;
}
