// src/components/Sidebar/InvestorSidebar.tsx
import {
  LayoutDashboard,
  PieChart,
  TrendingUp,
  DollarSign,
  BarChart3,
  ShieldCheck,
  User,
  Briefcase,
  FileText,
  LogOut,
} from "lucide-react";
import { InvestorBaseSidebar } from "./InvestorBaseSidebar";

const menuItems = [
  // Dashboard
  { icon: LayoutDashboard, label: "Dashboard", href: "/investor" },

  // Portfolio & Investments
  { icon: PieChart, label: "My Investments", href: "/investor/portfolio" },
  { icon: Briefcase, label: "Investments", href: "/investor/investments" },

  // IPO Management
  { icon: FileText, label: "Browse IPOs", href: "/investor/ipo/page" },
  { icon: BarChart3, label: "IPO Subscribe", href: "/investor/investipo" },
  { icon: FileText, label: "My Subscriptions", href: "/investor/ipo/sub" },

  // Market & Trading
  { icon: TrendingUp, label: "Market", href: "/investor/market" },
  { icon: BarChart3, label: "Stocks", href: "/investor/stock" },

  // Financial
  { icon: DollarSign, label: "Remittance", href: "/investor/remittance" },

  // Profile & Settings
  { icon: ShieldCheck, label: "KYC Verification", href: "/investor/kyc" },
  { icon: User, label: "Profile", href: "/investor/profile" },

  // Logout
  { icon: LogOut, label: "Log Out", href: "#", isLogout: true },
];

export default function InvestorSidebar() {
  return <InvestorBaseSidebar menuItems={menuItems} portalName="Investor" />;
}
