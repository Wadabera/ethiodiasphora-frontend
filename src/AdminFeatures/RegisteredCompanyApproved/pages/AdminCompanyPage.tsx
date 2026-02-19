import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import type { Company } from "../types/company.types";
import {
  fetchAllCompanies,
  approveCompany,
  rejectCompany,
  suspendCompany,
  fetchCompanyById,
  setSelectedCompany,
  setFilters,
  clearError,
  clearSuccessMessage,
  updateCompanyManually,
} from "../slice/AdminCompanySlice";
import AdminCompanyTable from "../components/AdminCompanyTable";
import AdminCompanyDetailsModal from "../components/AdminCompanyDetailsModal";
import AdminRejectCompanyModal from "../components/AdminRejectCompanyModal";
import {
  Building2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  XCircle,
  Clock,
  Search,
  Filter,
  UserMinus,
} from "lucide-react";

const AdminCompanyPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    companies,
    filteredCompanies,
    selectedCompany,
    fetchLoading,
    actionLoading,
    error,
    successMessage,
    stats,
    filters,
  } = useAppSelector((state) => state.adminCompany);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"reject" | "suspend">("reject");

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (successMessage) dispatch(clearSuccessMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchInput }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handleViewDetails = async (id: string) => {
    await dispatch(fetchCompanyById(id));
    setDetailsModalOpen(true);
  };

  const handleApprove = async (id: string, notes?: string) => {
    try {
      dispatch(
        updateCompanyManually({
          id,
          status: "approved",
          notes: notes || "Approved by admin",
        }),
      );
      await dispatch(approveCompany({ id, notes })).unwrap();
      setDetailsModalOpen(false);
      dispatch(setSelectedCompany(null));
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleRejectClick = (company: Company) => {
    dispatch(setSelectedCompany(company));
    setActionType("reject");
    setRejectModalOpen(true);
  };

  const handleSuspendClick = (company: Company) => {
    dispatch(setSelectedCompany(company));
    setActionType("suspend");
    setSuspendModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedCompany) return;
    try {
      dispatch(
        updateCompanyManually({
          id: selectedCompany._id,
          status: "rejected",
          notes: reason,
        }),
      );
      await dispatch(
        rejectCompany({ id: selectedCompany._id, reason }),
      ).unwrap();
      setRejectModalOpen(false);
      setDetailsModalOpen(false);
      dispatch(setSelectedCompany(null));
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleSuspendConfirm = async (reason: string) => {
    if (!selectedCompany) return;
    try {
      dispatch(
        updateCompanyManually({
          id: selectedCompany._id,
          status: "suspended",
          notes: reason,
        }),
      );
      await dispatch(
        suspendCompany({ id: selectedCompany._id, reason }),
      ).unwrap();
      setSuspendModalOpen(false);
      setDetailsModalOpen(false);
      dispatch(setSelectedCompany(null));
    } catch (error) {
      console.error("Suspension failed:", error);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleRefresh = () => {
    dispatch(fetchAllCompanies());
  };

  // Business types for filter
  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Private Limited Company",
    "Public Limited Company",
    "Limited Liability Partnership (LLP)",
    "Non-Profit Organization",
    "Cooperative",
    "Franchise",
    "Joint Venture",
    "Holding Company",
    "Subsidiary",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Company Management
            </h1>
            <p className="text-gray-400 mt-2">
              Review, approve, reject, and suspend company registrations
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={fetchLoading}
            className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${fetchLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-400/10 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-white">
                {stats.total}
              </span>
            </div>
            <p className="text-sm text-gray-400">Total Companies</p>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-400/10 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-3xl font-bold text-yellow-400">
                {stats.pending}
              </span>
            </div>
            <p className="text-sm text-gray-400">Pending</p>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-6 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-400/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-green-400">
                {stats.approved}
              </span>
            </div>
            <p className="text-sm text-gray-400">Approved</p>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-6 hover:border-red-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-red-400/10 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-3xl font-bold text-red-400">
                {stats.rejected}
              </span>
            </div>
            <p className="text-sm text-gray-400">Rejected</p>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-400/10 rounded-lg">
                <UserMinus className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-purple-400">
                {stats.suspended}
              </span>
            </div>
            <p className="text-sm text-gray-400">Suspended</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-sm font-medium text-green-400">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by company name, registration number, TIN, or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 pl-12 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={filters.businessType}
                onChange={(e) =>
                  handleFilterChange("businessType", e.target.value)
                }
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 pl-12 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Business Types</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden">
          {filteredCompanies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-400">No companies found</p>
              {companies.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Try changing filters to see more companies
                </p>
              )}
            </div>
          ) : (
            <AdminCompanyTable
              companies={filteredCompanies}
              actionLoading={actionLoading}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onRejectClick={handleRejectClick}
              onSuspendClick={handleSuspendClick}
            />
          )}
        </div>

        {/* Details Modal */}
        <AdminCompanyDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            dispatch(setSelectedCompany(null));
          }}
          company={selectedCompany}
          onApprove={handleApprove}
          onRejectClick={() => {
            if (selectedCompany) {
              setActionType("reject");
              setRejectModalOpen(true);
            }
          }}
          onSuspendClick={() => {
            if (selectedCompany) {
              setActionType("suspend");
              setSuspendModalOpen(true);
            }
          }}
          actionLoading={actionLoading}
        />

        {/* Reject Modal */}
        <AdminRejectCompanyModal
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            dispatch(setSelectedCompany(null));
          }}
          onConfirm={handleRejectConfirm}
          companyName={selectedCompany?.name || selectedCompany?.companyName}
          registrationNumber={selectedCompany?.registrationNumber}
          actionType="reject"
        />

        {/* Suspend Modal */}
        <AdminRejectCompanyModal
          isOpen={suspendModalOpen}
          onClose={() => {
            setSuspendModalOpen(false);
            dispatch(setSelectedCompany(null));
          }}
          onConfirm={handleSuspendConfirm}
          companyName={selectedCompany?.name || selectedCompany?.companyName}
          registrationNumber={selectedCompany?.registrationNumber}
          actionType="suspend"
        />
      </div>
    </div>
  );
};

export default AdminCompanyPage;
