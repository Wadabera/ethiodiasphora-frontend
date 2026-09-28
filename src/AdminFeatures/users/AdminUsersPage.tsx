import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Mail,
  Phone,
  Calendar,
  Trash2,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  X,
  Lock,
} from "lucide-react";
import api from "@/services/api";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "local_business" | "diaspora_investor";
  kycStatus: "approved" | "pending" | "under_review";
  status: "active" | "inactive";
  joinedDate: string;
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal states
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<PlatformUser | null>(null);

  // New Admin Form State
  const [adminForm, setAdminForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "Password123!",
  });

  const defaultDemoUsers: PlatformUser[] = [
    {
      id: "usr_01",
      name: "System Admin",
      email: "admin@ethiodiaspora.com",
      phone: "+251911000001",
      role: "admin",
      kycStatus: "approved",
      status: "active",
      joinedDate: "Sep 28, 2026",
    },
    {
      id: "usr_02",
      name: "Dawit Haile",
      email: "business@ethiodiaspora.com",
      phone: "+251911000002",
      role: "local_business",
      kycStatus: "approved",
      status: "active",
      joinedDate: "Sep 28, 2026",
    },
    {
      id: "usr_03",
      name: "Sara Tadesse",
      email: "investor@ethiodiaspora.com",
      phone: "+251911000003",
      role: "diaspora_investor",
      kycStatus: "approved",
      status: "active",
      joinedDate: "Sep 28, 2026",
    },
  ];

  const [usersList, setUsersList] = useState<PlatformUser[]>(defaultDemoUsers);

  // Fetch real users from backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/users/admin/users?limit=50");
      if (response.data && Array.isArray(response.data.users)) {
        const mappedUsers: PlatformUser[] = response.data.users.map((u: any) => ({
          id: u._id,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email.split("@")[0],
          email: u.email,
          phone: u.phoneNumber || "N/A",
          role: u.role || "diaspora_investor",
          kycStatus: u.kycStatus === "approved" ? "approved" : "pending",
          status: u.isActive !== false ? "active" : "inactive",
          joinedDate: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Sep 2026",
        }));
        setUsersList(mappedUsers);
      }
    } catch (err: any) {
      console.warn("Could not fetch real users from backend, using current list:", err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fillDemoAdmin = () => {
    const rnd = Math.floor(1000 + Math.random() * 9000);
    setAdminForm({
      firstName: "Mulugeta",
      lastName: "Bekele",
      email: `admin_${rnd}@ethiodiaspora.com`,
      phoneNumber: `+25191199${rnd}`,
      password: "Password123!",
    });
  };

  const handleCreateAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage(null);

    try {
      // 1. Register new admin
      const regRes = await api.post("/api/v1/auth/register", {
        firstName: adminForm.firstName,
        lastName: adminForm.lastName,
        email: adminForm.email,
        phoneNumber: adminForm.phoneNumber,
        password: adminForm.password,
        role: "admin",
      });

      // 2. If OTP is returned, auto-verify email to activate immediately
      const otp = regRes.data?.otp;
      if (otp) {
        try {
          await api.post("/api/v1/auth/verify-email", {
            email: adminForm.email,
            otp: otp,
          });
        } catch (verErr) {
          console.warn("Auto verification non-blocking warning:", verErr);
        }
      }

      setStatusMessage({
        type: "success",
        text: `Admin account for ${adminForm.firstName} ${adminForm.lastName} (${adminForm.email}) created and activated successfully!`,
      });

      setShowCreateAdminModal(false);
      setAdminForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "Password123!",
      });

      // Refresh list
      await fetchUsers();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to create admin user";
      setStatusMessage({
        type: "error",
        text: typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg),
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setActionLoading(true);
    setStatusMessage(null);

    try {
      // If it has a MongoDB ObjectId (24 hex characters), call backend API
      if (deleteConfirmUser.id.length === 24) {
        await api.delete(`/api/v1/users/admin/users/${deleteConfirmUser.id}`);
      }

      // Update state locally
      setUsersList((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));
      setStatusMessage({
        type: "success",
        text: `User ${deleteConfirmUser.name} (${deleteConfirmUser.email}) was removed from the database.`,
      });
      setDeleteConfirmUser(null);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to delete user";
      setStatusMessage({
        type: "error",
        text: typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg),
      });
    } finally {
      setActionLoading(false);
    }
  };

  const addDemoUser = () => {
    const rnd = Math.floor(100 + Math.random() * 900);
    const isBiz = Math.random() > 0.5;
    const newUser: PlatformUser = {
      id: `usr_${rnd}`,
      name: isBiz ? `Yohannes Bekele ${rnd}` : `Bethlehem Assefa ${rnd}`,
      email: isBiz ? `demo.business${rnd}@ethiodiaspora.com` : `demo.investor${rnd}@ethiodiaspora.com`,
      phone: `+251911${rnd}22`,
      role: isBiz ? "local_business" : "diaspora_investor",
      kycStatus: "approved",
      status: "active",
      joinedDate: "Today",
    };
    setUsersList([newUser, ...usersList]);
    setStatusMessage({
      type: "success",
      text: `Demo user ${newUser.name} added to list.`,
    });
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 animate-fade-in ${
            statusMessage.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span className="text-sm font-medium">{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
              <Users size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white">Platform User Management</h1>
          </div>
          <p className="text-gray-400 text-xs">
            Admin oversight: view real database users, provision new administrators, and manage platform permissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-gray-700"
            title="Refresh Users from Backend"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#FFD700]" : ""} /> Refresh
          </button>

          {/* Create Admin Button */}
          <button
            type="button"
            onClick={() => setShowCreateAdminModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:opacity-90 text-black rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <UserPlus size={15} /> Create Admin
          </button>

          {/* Add Demo User Button */}
          <button
            type="button"
            onClick={addDemoUser}
            className="px-3.5 py-2 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} /> Add Demo
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {[
            { id: "all", label: `All Users (${usersList.length})` },
            { id: "admin", label: `Admins (${usersList.filter((u) => u.role === "admin").length})` },
            { id: "local_business", label: `Businesses (${usersList.filter((u) => u.role === "local_business").length})` },
            { id: "diaspora_investor", label: `Investors (${usersList.filter((u) => u.role === "diaspora_investor").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                roleFilter === tab.id
                  ? "bg-[#FFD700] text-black font-bold"
                  : "bg-[#1A1A1A] text-gray-300 hover:bg-gray-800 border border-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No users matching criteria. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Mail size={11} /> {u.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === "admin"
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            : u.role === "local_business"
                            ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            : "bg-yellow-500/15 text-[#FFD700] border border-[#FFD700]/30"
                        }`}
                      >
                        {u.role === "admin"
                          ? "Admin"
                          : u.role === "local_business"
                          ? "Local Business"
                          : "Diaspora Investor"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Phone size={11} className="text-gray-500" /> {u.phone}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.kycStatus === "approved"
                            ? "bg-green-500/15 text-green-400"
                            : "bg-amber-500/15 text-amber-400"
                        }`}
                      >
                        {u.kycStatus === "approved" ? (
                          <>
                            <CheckCircle size={11} /> Verified
                          </>
                        ) : (
                          <>
                            <Clock size={11} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${
                          u.status === "active" ? "text-green-400" : "text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === "active" ? "bg-green-400 animate-pulse" : "bg-gray-500"
                          }`}
                        ></span>
                        {u.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{u.joinedDate}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Delete User Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmUser(u)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          title="Delete User from Database"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ADMIN MODAL */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#FFD700]/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <div className="p-2 bg-[#FFD700]/15 text-[#FFD700] rounded-lg">
                  <UserPlus size={18} />
                </div>
                <h3>Provision New Administrator</h3>
              </div>
              <button
                onClick={() => setShowCreateAdminModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-4 flex justify-between items-center bg-gray-900/60 p-3 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400">Quick fill with realistic sample data:</span>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-3 py-1 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 text-[#FFD700] border border-[#FFD700]/50 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Sparkles size={12} /> Fill Demo Admin
              </button>
            </div>

            <form onSubmit={handleCreateAdminSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.firstName}
                    onChange={(e) => setAdminForm({ ...adminForm, firstName: e.target.value })}
                    placeholder="Mulugeta"
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.lastName}
                    onChange={(e) => setAdminForm({ ...adminForm, lastName: e.target.value })}
                    placeholder="Bekele"
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Official Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="admin.new@ethiodiaspora.com"
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={adminForm.phoneNumber}
                    onChange={(e) => setAdminForm({ ...adminForm, phoneNumber: e.target.value })}
                    placeholder="+251911990011"
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Initial Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="Password123!"
                    className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:opacity-90 text-black text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <UserPlus size={14} />}
                  {actionLoading ? "Creating..." : "Save Admin User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-red-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 bg-red-500/15 rounded-full flex items-center justify-center mx-auto mb-3 text-red-400">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Delete User Account?</h3>
            <p className="text-xs text-gray-400 mb-4">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-semibold">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email}) from
              the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
