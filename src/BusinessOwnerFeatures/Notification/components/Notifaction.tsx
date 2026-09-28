import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Clock,
  Sparkles,
  Trash2,
  CheckCheck,
  ArrowUpRight,
  Filter,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "approval" | "investment" | "remittance" | "system";
  time: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export default function Notifaction() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_01",
      title: "KYC Identity Verified & Approved",
      message: "Your Level-1 Basic KYC verification has been officially audited and approved by the compliance team.",
      category: "approval",
      time: "10 mins ago",
      read: false,
      actionUrl: "/business/kyc",
      actionLabel: "View KYC Status",
    },
    {
      id: "notif_02",
      title: "Company License Approved",
      message: "Abyssinia Specialty Coffee Export PLC (TIN: 0098765432) has been verified and registered on the platform.",
      category: "approval",
      time: "25 mins ago",
      read: false,
      actionUrl: "/business/company/profile",
      actionLabel: "Company Profile",
    },
    {
      id: "notif_03",
      title: "New $15,000 Equity Investment Received",
      message: "Diaspora investor Sara Tadesse has invested $15,000 into 'Specialty Yirgacheffe Coffee Processing Plant Expansion'.",
      category: "investment",
      time: "1 hour ago",
      read: false,
      actionUrl: "/business/manageInvestment",
      actionLabel: "View Portfolio",
    },
    {
      id: "notif_04",
      title: "New Investment Opportunity Published",
      message: "Your campaign 'Sheba Logistics & Cold Chain Infrastructure' is now live on the global marketplace.",
      category: "investment",
      time: "2 hours ago",
      read: true,
      actionUrl: "/investor/investments",
      actionLabel: "View Live Listing",
    },
    {
      id: "notif_05",
      title: "Remittance Inflow Cleared",
      message: "Transfer ref ETH-TX-98442 for $2,500.00 (356,250 ETB) was cleared to your Commercial Bank of Ethiopia (CBE) account.",
      category: "remittance",
      time: "Yesterday",
      read: true,
      actionUrl: "/investor/remittance",
      actionLabel: "Remittance Log",
    },
  ]);

  const addDemoNotification = () => {
    const rnd = Math.floor(100 + Math.random() * 900);
    const newNotif: NotificationItem = {
      id: `notif_${rnd}`,
      title: "New Diaspora Investment Bid Received",
      message: `An investor has submitted a $10,000 commitment for your agribusiness expansion campaign.`,
      category: "investment",
      time: "Just now",
      read: false,
      actionUrl: "/business/manageInvestment",
      actionLabel: "Review Bid",
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !n.read;
    return n.category === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
              <Bell size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white">Notifications Center</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs">
            Real-time alerts for KYC compliance, investment bids, company approvals, and remittance disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addDemoNotification}
            className="px-3.5 py-2 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Sparkles size={14} /> Add Demo Alert
          </button>
          {notifications.length > 0 && (
            <>
              <button
                type="button"
                onClick={markAllAsRead}
                className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-gray-700 text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCheck size={14} /> Mark Read
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="p-2 bg-[#1A1A1A] hover:bg-red-500/20 border border-gray-700 hover:border-red-500/40 text-gray-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                title="Clear all"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: `All (${notifications.length})` },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "approval", label: "Approvals & KYC" },
          { id: "investment", label: "Investments" },
          { id: "remittance", label: "Remittance" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === tab.id
                ? "bg-[#FFD700] text-black shadow-md font-bold"
                : "bg-[#0F0F0F] text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-12 text-center space-y-3">
            <Bell size={40} className="text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No notifications</h3>
            <p className="text-xs text-gray-500">
              You are all caught up! Click "Add Demo Alert" above to simulate a new notification.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.read
                  ? "bg-[#0F0F0F] border-gray-800/80"
                  : "bg-gradient-to-r from-yellow-500/10 via-[#0F0F0F] to-[#0F0F0F] border-[#FFD700]/40 shadow-lg"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl mt-0.5 ${
                      item.category === "approval"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : item.category === "investment"
                        ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {item.category === "approval" ? (
                      <ShieldCheck size={18} />
                    ) : item.category === "investment" ? (
                      <TrendingUp size={18} />
                    ) : (
                      <DollarSign size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-white text-sm">{item.title}</h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock size={11} /> {item.time}
                      </span>
                      {item.actionUrl && (
                        <Link
                          to={item.actionUrl}
                          className="text-xs font-semibold text-[#FFD700] hover:underline flex items-center gap-1"
                        >
                          {item.actionLabel || "View Details"} <ArrowUpRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) =>
                        n.id === item.id ? { ...n, read: !n.read } : n
                      )
                    )
                  }
                  className="text-gray-500 hover:text-gray-300 text-[11px] cursor-pointer"
                >
                  {item.read ? "Mark unread" : "Mark read"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
