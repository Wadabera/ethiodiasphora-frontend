import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchMyCompanies,
  updateCompany,
  fetchCompanyById,
  clearCompanyError,
  resetCompanySuccess,
  setCurrentCompany,
} from "../slices/companySlice";
import {
  BusinessType,
  CompanyLicenseStatus,
  type UpdateCompanyDto,
  type Director,
  BusinessTypeUtils,
  CompanyLicenseStatusUtils,
  CompanyUtils,
} from "../types/company.types";
import {
  Building2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Award,
  Clock,
  XCircle,
  Edit2,
  Save,
  X,
  Users,
  Briefcase,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Hash,
  Tag,
  Shield,
  Building,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Home,
  CreditCard,
  FileCheck,
  UserCircle,
  Camera,
  Upload,
  Info,
} from "lucide-react";

// ============ STATISTICS CARD COMPONENT ============
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-4 ${bgColor} rounded-xl`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
    </div>
  );
};

// ============ COMPANY STATISTICS DASHBOARD ============
const CompanyStatistics = ({ companies }: { companies: any[] }) => {
  const totalCompanies = companies.length;
  const approvedCompanies = companies.filter(
    (c) => c.licenseStatus?.toLowerCase() === CompanyLicenseStatus.APPROVED,
  ).length;
  const pendingCompanies = companies.filter(
    (c) => c.licenseStatus?.toLowerCase() === CompanyLicenseStatus.SUBMITTED,
  ).length;
  const rejectedCompanies = companies.filter(
    (c) => c.licenseStatus?.toLowerCase() === CompanyLicenseStatus.REJECTED,
  ).length;

  return (
    <div className="space-y-8">
      {/* Main Stats Cards - PADDING INCREASED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Companies"
          value={totalCompanies}
          icon={Building2}
          color="text-yellow-400"
          bgColor="bg-yellow-400/10"
        />
        <StatCard
          title="Verified"
          value={approvedCompanies}
          icon={Shield}
          color="text-green-400"
          bgColor="bg-green-400/10"
        />
        <StatCard
          title="Pending Review"
          value={pendingCompanies}
          icon={Clock}
          color="text-yellow-400"
          bgColor="bg-yellow-400/10"
        />
        <StatCard
          title="Rejected"
          value={rejectedCompanies}
          icon={XCircle}
          color="text-red-400"
          bgColor="bg-red-400/10"
        />
      </div>

      {/* Status Distribution Bar - PADDING INCREASED */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-3">
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Building2 className="w-5 h-5 text-yellow-400" />
            </div>
            Company Status Distribution
          </h3>
          <span className="text-sm text-gray-500">Total: {totalCompanies}</span>
        </div>

        <div className="flex h-4 rounded-full overflow-hidden bg-gray-800">
          {approvedCompanies > 0 && (
            <div
              className="bg-green-500 transition-all duration-500"
              style={{
                width: `${(approvedCompanies / totalCompanies) * 100}%`,
              }}
            />
          )}
          {pendingCompanies > 0 && (
            <div
              className="bg-yellow-500 transition-all duration-500"
              style={{ width: `${(pendingCompanies / totalCompanies) * 100}%` }}
            />
          )}
          {rejectedCompanies > 0 && (
            <div
              className="bg-red-500 transition-all duration-500"
              style={{
                width: `${(rejectedCompanies / totalCompanies) * 100}%`,
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-400">Verified</span>
            <span className="text-white font-bold">{approvedCompanies}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-400">Pending</span>
            <span className="text-white font-bold">{pendingCompanies}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-gray-400">Rejected</span>
            <span className="text-white font-bold">{rejectedCompanies}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ ENHANCED COMPANY CARD - COMPANY ONLY, NO INVESTMENT ============
const EnhancedCompanyCard = ({
  company,
  isSelected,
  onClick,
}: {
  company: any;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const status = company.licenseStatus?.toLowerCase() || "submitted";
  const badgeClass = CompanyLicenseStatusUtils.getBadgeClass(status);
  const statusText = CompanyLicenseStatusUtils.format(status);
  const statusIcon = CompanyLicenseStatusUtils.getIcon(status);

  const businessTypeFormatted = BusinessTypeUtils.format(company.businessType);
  const businessTypeIcon = BusinessTypeUtils.getIcon(company.businessType);

  // Company initials for placeholder
  const getInitials = (name: string) => {
    if (!name) return "CO";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate consistent color based on company name
  const getColorFromName = (name: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600",
      "from-green-500 to-green-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-orange-500 to-orange-600",
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  const initials = getInitials(
    company.name || company.companyName || "Company",
  );
  const gradientColor = getColorFromName(company.name || company.companyName);

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gray-900 border rounded-2xl p-8 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl
        ${
          isSelected
            ? "border-yellow-400 bg-yellow-400/5 shadow-lg shadow-yellow-400/20 ring-2 ring-yellow-400/20"
            : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
        }
      `}
    >
      {/* Status Badge - Positioned Top Right */}
      <div className="absolute top-6 right-6">
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${badgeClass}`}
        >
          <span className="text-lg">{statusIcon}</span>
          {statusText}
        </span>
      </div>

      {/* Company Photo Placeholder - Large and Prominent */}
      <div className="flex flex-col items-center text-center mb-6">
        <div
          className={`
          w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-bold mb-4
          bg-gradient-to-br ${gradientColor} text-white shadow-xl
          ${isSelected ? "ring-4 ring-yellow-400/50" : ""}
        `}
        >
          {initials}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          {company.name || company.companyName}
        </h3>

        <div className="flex items-center gap-2 text-base text-gray-400 bg-gray-800/50 px-4 py-2 rounded-full">
          <Tag className="w-4 h-4 text-yellow-400" />
          <span>{businessTypeIcon}</span>
          <span>{businessTypeFormatted}</span>
        </div>
      </div>

      {/* Company Details Grid - 2 Columns */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <Hash className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Reg. Number</p>
              <p className="text-sm font-medium text-white truncate">
                {company.registrationNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <CreditCard className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">TIN Number</p>
              <p className="text-sm font-medium text-white truncate">
                {company.tinNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Industry</p>
              <p className="text-sm font-medium text-white truncate">
                {company.industry || company.sector || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Calendar className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Registered</p>
              <p className="text-sm font-medium text-white">
                {CompanyUtils.formatDate(
                  company.registrationDate || company.createdAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-400 line-clamp-2">
          {company.description || "No description provided."}
        </p>
      </div>

      {/* Footer with Company ID */}
      <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Building className="w-4 h-4" />
          <span>Company ID:</span>
          <code className="font-mono text-yellow-400 bg-gray-800 px-2 py-1 rounded">
            {company._id.slice(-8)}
          </code>
        </div>

        {status === CompanyLicenseStatus.APPROVED && (
          <div className="flex items-center gap-1.5 text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Verified Company
          </div>
        )}
      </div>
    </div>
  );
};

// ============ COMPANY DOCUMENTS UPLOAD ============
const CompanyDocumentsUpload = ({
  documents,
  onChange,
}: {
  documents: {
    registrationCertificate: string;
    tinCertificate: string;
    businessLicense?: string;
  };
  onChange: (field: string, value: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-400/10 rounded-lg">
            <FileText className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-base text-white font-medium mb-1">
              Document Requirements
            </p>
            <p className="text-sm text-gray-400">
              Upload PDF files only. All documents must be clear, legible, and
              match your registration details.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Registration Certificate */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <label className="block text-base font-medium text-white mb-3">
            Business Registration Certificate{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={documents.registrationCertificate || ""}
              onChange={(e) =>
                onChange("documents.registrationCertificate", e.target.value)
              }
              className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              placeholder="https://example.com/registration-certificate.pdf"
            />
            {documents.registrationCertificate && (
              <a
                href={documents.registrationCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5 text-gray-300" />
                <span className="text-sm text-white">View</span>
              </a>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Upload your official business registration certificate
          </p>
        </div>

        {/* TIN Certificate */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <label className="block text-base font-medium text-white mb-3">
            TIN Certificate <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={documents.tinCertificate || ""}
              onChange={(e) =>
                onChange("documents.tinCertificate", e.target.value)
              }
              className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              placeholder="https://example.com/tin-certificate.pdf"
            />
            {documents.tinCertificate && (
              <a
                href={documents.tinCertificate}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5 text-gray-300" />
                <span className="text-sm text-white">View</span>
              </a>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Upload your Tax Identification Number certificate
          </p>
        </div>

        {/* Business License (Optional) */}
        <div className="bg-gray-800/30 rounded-xl p-6">
          <label className="block text-base font-medium text-white mb-3">
            Business License <span className="text-gray-500">(Optional)</span>
          </label>
          <div className="flex gap-3">
            <input
              type="url"
              value={documents.businessLicense || ""}
              onChange={(e) =>
                onChange("documents.businessLicense", e.target.value)
              }
              className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 text-sm"
              placeholder="https://example.com/business-license.pdf"
            />
            {documents.businessLicense && (
              <a
                href={documents.businessLicense}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5 text-gray-300" />
                <span className="text-sm text-white">View</span>
              </a>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Additional business license if applicable
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ ENHANCED COMPANY INFO FORM ============
const EnhancedCompanyInfoForm = ({
  company,
  onChange,
  onCancel,
  onSave,
  isUpdating,
}: {
  company: UpdateCompanyDto;
  onChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSave: () => void;
  isUpdating: boolean;
}) => {
  const businessTypeOptions = BusinessTypeUtils.getOptions();
  const ethiopianIndustries = [
    "Agriculture",
    "Manufacturing",
    "Information Technology",
    "Financial Services",
    "Real Estate",
    "Construction",
    "Hospitality",
    "Retail",
    "Transportation",
    "Healthcare",
    "Education",
    "Renewable Energy",
    "Textile",
    "Coffee Export",
    "Flower Export",
    "Mining",
    "Telecommunications",
    "Other",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-yellow-400/10 rounded-lg">
            <Edit2 className="w-6 h-6 text-yellow-400" />
          </div>
          Update Company Information
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all flex items-center gap-2 text-base"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isUpdating}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center gap-2 disabled:opacity-50 text-base"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Company
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Sections - PADDING INCREASED */}
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800/30 rounded-2xl p-8">
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Legal Company Name
              </label>
              <input
                type="text"
                value={company.name || ""}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={company.registrationNumber || ""}
                onChange={(e) => onChange("registrationNumber", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="REG-2024-001237"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                TIN Number
              </label>
              <input
                type="text"
                value={company.tinNumber || ""}
                onChange={(e) => onChange("tinNumber", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="TIN-987654321"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Business Type
              </label>
              <select
                value={company.businessType || ""}
                onChange={(e) => onChange("businessType", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
              >
                <option value="">Select Business Type</option>
                {businessTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {BusinessTypeUtils.getIcon(type.value)} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800/30 rounded-2xl p-8">
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <Mail className="w-5 h-5 text-green-400" />
            </div>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={company.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                  placeholder="info@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  value={company.phone || ""}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                  placeholder="+251911234567"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  value={company.website || ""}
                  onChange={(e) => onChange("website", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                  placeholder="https://www.company.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-800/30 rounded-2xl p-8">
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            Business Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={company.address?.street || ""}
                onChange={(e) => onChange("address.street", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="Bole Road, Atlas Building"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                City
              </label>
              <input
                type="text"
                value={company.address?.city || ""}
                onChange={(e) => onChange("address.city", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="Addis Ababa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                State/Region
              </label>
              <input
                type="text"
                value={company.address?.state || ""}
                onChange={(e) => onChange("address.state", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="Addis Ababa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={company.address?.postalCode || ""}
                onChange={(e) => onChange("address.postalCode", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Country
              </label>
              <input
                type="text"
                value={company.address?.country || "Ethiopia"}
                onChange={(e) => onChange("address.country", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="Ethiopia"
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-gray-800/30 rounded-2xl p-8">
          <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-orange-400/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-orange-400" />
            </div>
            Business Details
          </h3>
          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Industry/Sector
              </label>
              <select
                value={company.industry || ""}
                onChange={(e) => onChange("industry", e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
              >
                <option value="">Select Industry</option>
                {ethiopianIndustries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Company Description
              </label>
              <textarea
                value={company.description || ""}
                onChange={(e) => onChange("description", e.target.value)}
                rows={5}
                className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-3 rounded-xl focus:outline-none focus:border-yellow-400 text-base"
                placeholder="Describe your business, products/services, and market presence..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPANY PROFILE PAGE ============
const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { myCompanies, myCompany, loading, updating, success, error } =
    useAppSelector((state) => state.companies);

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "documents" | "directors"
  >("overview");
  const [copied, setCopied] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);

  // Edit Form State
  const [editForm, setEditForm] = useState<UpdateCompanyDto>({});

  // Director Form State
  const [directorForm, setDirectorForm] = useState<Director>({
    fullName: "",
    position: "",
    nationality: "Ethiopian",
    idNumber: "",
  });
  const [showDirectorForm, setShowDirectorForm] = useState(false);

  // ============ FETCH COMPANIES ON MOUNT ============
  useEffect(() => {
    dispatch(fetchMyCompanies());
  }, [dispatch]);

  // ============ FETCH SINGLE COMPANY BY ID (UPDATED ENDPOINT) ============
  const fetchCompanyDetails = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchCompanyById(id)).unwrap();
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      }
    },
    [dispatch],
  );

  // ============ INITIALIZE EDIT FORM WHEN COMPANY CHANGES ============
  useEffect(() => {
    if (myCompany) {
      setEditForm({
        name: myCompany.name || myCompany.companyName,
        registrationNumber: myCompany.registrationNumber,
        tinNumber: myCompany.tinNumber,
        businessType: myCompany.businessType,
        email: myCompany.email,
        phone: myCompany.phone || myCompany.phoneNumber,
        website: myCompany.website,
        address: myCompany.address || {
          street: "",
          city: "",
          state: "",
          postalCode: "1000",
          country: "Ethiopia",
        },
        industry: myCompany.industry || myCompany.sector,
        description: myCompany.description,
        documents: myCompany.documents || {
          registrationCertificate: "",
          tinCertificate: "",
          businessLicense: "",
        },
        directors: myCompany.directors || [],
      });
    }
  }, [myCompany]);

  // ============ CLEAR SUCCESS MESSAGE ============
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetCompanySuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // ============ HANDLE COMPANY SELECTION ============
  const handleSelectCompany = async (company: any) => {
    dispatch(setCurrentCompany(company));
    // Fetch fresh company details using the updated endpoint
    await fetchCompanyDetails(company._id);
    setIsEditing(false);
    setActiveTab("overview");
  };

  // ============ COPY TO CLIPBOARD ============
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============ HANDLE EDIT FORM CHANGES ============
  const handleEditChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof UpdateCompanyDto] as any) || {}),
          [child]: value,
        },
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  // ============ HANDLE UPDATE ============
  const handleUpdate = async () => {
    if (!myCompany) return;

    try {
      const submitData = { ...editForm };

      if (!submitData.website) {
        delete submitData.website;
      }

      if (submitData.documents?.businessLicense === "") {
        delete submitData.documents.businessLicense;
      }

      await dispatch(
        updateCompany({
          id: myCompany._id,
          data: submitData,
        }),
      ).unwrap();

      setIsEditing(false);
      // Refresh company details
      await fetchCompanyDetails(myCompany._id);
    } catch (err) {
      console.error("Failed to update company:", err);
    }
  };

  // ============ HANDLE CANCEL ============
  const handleCancel = () => {
    if (myCompany) {
      setEditForm({
        name: myCompany.name || myCompany.companyName,
        registrationNumber: myCompany.registrationNumber,
        tinNumber: myCompany.tinNumber,
        businessType: myCompany.businessType,
        email: myCompany.email,
        phone: myCompany.phone || myCompany.phoneNumber,
        website: myCompany.website,
        address: myCompany.address || {
          street: "",
          city: "",
          state: "",
          postalCode: "1000",
          country: "Ethiopia",
        },
        industry: myCompany.industry || myCompany.sector,
        description: myCompany.description,
        documents: myCompany.documents || {
          registrationCertificate: "",
          tinCertificate: "",
          businessLicense: "",
        },
        directors: myCompany.directors || [],
      });
    }
    setIsEditing(false);
    dispatch(clearCompanyError());
  };

  // ============ ADD DIRECTOR ============
  const addDirector = () => {
    if (
      !directorForm.fullName ||
      !directorForm.position ||
      !directorForm.idNumber
    ) {
      alert("Please fill all required director fields");
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      directors: [...(prev.directors || []), { ...directorForm }],
    }));

    setDirectorForm({
      fullName: "",
      position: "",
      nationality: "Ethiopian",
      idNumber: "",
    });
    setShowDirectorForm(false);
  };

  // ============ REMOVE DIRECTOR ============
  const removeDirector = (index: number) => {
    setEditForm((prev) => ({
      ...prev,
      directors: prev.directors?.filter((_, i) => i !== index),
    }));
  };

  // ============ GET VERIFICATION DETAILS ============
  const getVerificationDetails = () => {
    if (!myCompany) return null;

    const status = myCompany.licenseStatus?.toLowerCase();

    switch (status) {
      case CompanyLicenseStatus.APPROVED:
        return {
          icon: Award,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/30",
          title: "Company Verified",
          message:
            "Your company has been verified. You can now create IPOs and investment opportunities.",
          date: myCompany.verificationDate,
          notes: myCompany.verificationNotes,
        };
      case CompanyLicenseStatus.SUBMITTED:
        return {
          icon: Clock,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          borderColor: "border-yellow-400/30",
          title: "Verification in Progress",
          message:
            "Your company documents are being reviewed. This typically takes 2-3 business days.",
          date: myCompany.registrationDate || myCompany.createdAt,
          notes: null,
        };
      case CompanyLicenseStatus.REJECTED:
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-400/10",
          borderColor: "border-red-400/30",
          title: "Verification Rejected",
          message:
            myCompany.verificationNotes ||
            "Your company verification was rejected. Please update your documents and resubmit.",
          date: myCompany.verificationDate,
          notes: myCompany.verificationNotes,
        };
      default:
        return null;
    }
  };

  // ============ LOADING STATE ============
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl text-gray-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  // ============ NO COMPANIES STATE ============
  if (!myCompanies?.length && !loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 max-w-2xl w-full text-center">
          <div className="w-28 h-28 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Building2 className="w-14 h-14 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            No Company Registered
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            You need to register a company before you can create IPOs or
            investment opportunities.
          </p>
          <button
            onClick={() => navigate("/business/company/register")}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg shadow-yellow-500/25 flex items-center gap-3 mx-auto text-lg"
          >
            <Plus className="w-6 h-6" />
            Register Company
          </button>
        </div>
      </div>
    );
  }

  const verificationDetails = getVerificationDetails();

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* ===== VERIFICATION DETAILS MODAL ===== */}
      {showVerificationModal && verificationDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 max-w-lg mx-6 shadow-2xl">
            <div
              className={`w-20 h-20 ${verificationDetails.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <verificationDetails.icon
                className={`w-10 h-10 ${verificationDetails.color}`}
              />
            </div>

            <h3 className="text-2xl font-bold text-white text-center mb-3">
              {verificationDetails.title}
            </h3>

            <p className="text-gray-400 text-center mb-8 text-lg">
              {verificationDetails.message}
            </p>

            {verificationDetails.date && (
              <div className="bg-gray-800/50 rounded-xl p-5 mb-5">
                <p className="text-sm text-gray-500 mb-1">
                  {myCompany?.licenseStatus?.toLowerCase() === "submitted"
                    ? "Submitted"
                    : "Processed"}{" "}
                  On
                </p>
                <p className="text-white text-lg">
                  {CompanyUtils.formatDate(verificationDetails.date)}
                </p>
              </div>
            )}

            {verificationDetails.notes && (
              <div className="bg-gray-800/50 rounded-xl p-5 mb-8">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-base text-white">
                  {verificationDetails.notes}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all text-base"
              >
                Close
              </button>

              {myCompany?.licenseStatus?.toLowerCase() === "approved" && (
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    navigate("/business/ipo/create");
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all text-base"
                >
                  Create IPO
                </button>
              )}

              {myCompany?.licenseStatus?.toLowerCase() === "rejected" && (
                <button
                  onClick={() => {
                    setShowVerificationModal(false);
                    setIsEditing(true);
                    setActiveTab("documents");
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all text-base"
                >
                  Update Documents
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/business/dashboard")}
                className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                  <Building2 className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Company Management
                  </h1>
                  <p className="text-base text-gray-400 mt-1">
                    Manage your companies and track verification status
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all flex items-center gap-3 text-base"
              >
                {showStatistics ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                {showStatistics ? "Hide" : "Show"} Statistics
              </button>

              {myCompany && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center gap-3 shadow-lg shadow-yellow-500/25 text-base"
                >
                  <Edit2 className="w-5 h-5" />
                  Update Company
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* ===== STATISTICS DASHBOARD ===== */}
        {showStatistics && myCompanies && myCompanies.length > 0 && (
          <div className="mb-12">
            <CompanyStatistics companies={myCompanies} />
          </div>
        )}

        {/* ===== COMPANY CARDS GRID - PADDING INCREASED ===== */}
        {myCompanies && myCompanies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-yellow-400" />
                </div>
                Your Companies
                <span className="text-base font-normal text-gray-500 ml-2 bg-gray-800 px-4 py-1.5 rounded-full">
                  {myCompanies.length}{" "}
                  {myCompanies.length === 1 ? "Company" : "Companies"}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {myCompanies.map((company) => (
                <EnhancedCompanyCard
                  key={company._id}
                  company={company}
                  isSelected={myCompany?._id === company._id}
                  onClick={() => handleSelectCompany(company)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-lg text-green-500 font-medium">
                Company information updated successfully!
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-lg text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* ===== SELECTED COMPANY DETAILS ===== */}
        {myCompany ? (
          <div className="mt-10">
            {isEditing ? (
              /* EDIT MODE - UPDATE COMPANY FORM */
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
                <EnhancedCompanyInfoForm
                  company={editForm}
                  onChange={handleEditChange}
                  onCancel={handleCancel}
                  onSave={handleUpdate}
                  isUpdating={updating}
                />
              </div>
            ) : (
              /* VIEW MODE - COMPANY DETAILS TABS */
              <>
                {/* Company Header */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 mb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-4xl font-bold border-2 border-gray-700">
                        {CompanyUtils.getInitials(
                          myCompany.name || myCompany.companyName || "C",
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <h2 className="text-3xl font-bold text-white">
                            {myCompany.name || myCompany.companyName}
                          </h2>
                          <CompanyVerificationBadge
                            status={myCompany.licenseStatus || ""}
                          />
                        </div>
                        <div className="flex items-center gap-6 text-base">
                          <span className="flex items-center gap-2 text-gray-400">
                            <Hash className="w-5 h-5" />
                            Reg: {myCompany.registrationNumber}
                          </span>
                          <span className="flex items-center gap-2 text-gray-400">
                            <Tag className="w-5 h-5" />
                            {BusinessTypeUtils.getIcon(
                              myCompany.businessType,
                            )}{" "}
                            {BusinessTypeUtils.format(myCompany.businessType)}
                          </span>
                          <span className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-5 h-5" />
                            Registered:{" "}
                            {CompanyUtils.formatDate(
                              myCompany.registrationDate || myCompany.createdAt,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowVerificationModal(true)}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all flex items-center gap-3 text-base"
                    >
                      <Info className="w-5 h-5" />
                      Verification Details
                    </button>
                  </div>

                  {/* Company ID */}
                  <div className="flex items-center gap-3 mt-6 p-4 bg-gray-800/30 rounded-xl">
                    <span className="text-sm text-gray-500">Company ID:</span>
                    <code className="text-sm font-mono text-yellow-400 bg-gray-800 px-3 py-1.5 rounded-lg">
                      {myCompany._id}
                    </code>
                    <button
                      onClick={() => copyToClipboard(myCompany._id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-gray-800">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-6 py-3 text-base font-medium transition-colors relative ${
                      activeTab === "overview"
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`px-6 py-3 text-base font-medium transition-colors relative ${
                      activeTab === "documents"
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab("directors")}
                    className={`px-6 py-3 text-base font-medium transition-colors relative ${
                      activeTab === "directors"
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    Directors ({myCompany.directors?.length || 0})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
                    <div className="space-y-8">
                      {/* Company Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-800/30 rounded-xl p-6">
                          <p className="text-sm text-gray-500 mb-2">
                            Registration Number
                          </p>
                          <p className="text-2xl font-bold text-white truncate">
                            {myCompany.registrationNumber || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6">
                          <p className="text-sm text-gray-500 mb-2">
                            TIN Number
                          </p>
                          <p className="text-2xl font-bold text-white truncate">
                            {myCompany.tinNumber || "N/A"}
                          </p>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6">
                          <p className="text-sm text-gray-500 mb-2">
                            Business Type
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {BusinessTypeUtils.format(myCompany.businessType)}
                          </p>
                        </div>
                        <div className="bg-gray-800/30 rounded-xl p-6">
                          <p className="text-sm text-gray-500 mb-2">Industry</p>
                          <p className="text-2xl font-bold text-white">
                            {myCompany.industry || myCompany.sector || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="border-t border-gray-800 pt-8">
                        <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                          <div className="p-2 bg-green-400/10 rounded-lg">
                            <Mail className="w-5 h-5 text-green-400" />
                          </div>
                          Contact Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Email
                              </p>
                              <p className="text-base text-white">
                                {myCompany.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <Phone className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Phone
                              </p>
                              <p className="text-base text-white">
                                {myCompany.phone ||
                                  myCompany.phoneNumber ||
                                  "N/A"}
                              </p>
                            </div>
                          </div>

                          {myCompany.website && (
                            <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl md:col-span-2">
                              <div className="p-2 bg-gray-700 rounded-lg">
                                <Globe className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Website
                                </p>
                                <a
                                  href={myCompany.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-base text-yellow-400 hover:underline"
                                >
                                  {myCompany.website}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="border-t border-gray-800 pt-8">
                        <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                          <div className="p-2 bg-purple-400/10 rounded-lg">
                            <MapPin className="w-5 h-5 text-purple-400" />
                          </div>
                          Business Address
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {myCompany.address?.street && (
                            <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl md:col-span-2">
                              <div className="p-2 bg-gray-700 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Street Address
                                </p>
                                <p className="text-base text-white">
                                  {myCompany.address.street}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">City</p>
                              <p className="text-base text-white">
                                {myCompany.address?.city || "N/A"}
                              </p>
                            </div>
                          </div>

                          {myCompany.address?.state && (
                            <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                              <div className="p-2 bg-gray-700 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  State/Region
                                </p>
                                <p className="text-base text-white">
                                  {myCompany.address.state}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Postal Code
                              </p>
                              <p className="text-base text-white">
                                {myCompany.address?.postalCode || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                            <div className="p-2 bg-gray-700 rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Country
                              </p>
                              <p className="text-base text-white">
                                {myCompany.address?.country || "Ethiopia"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="border-t border-gray-800 pt-8">
                        <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                          <div className="p-2 bg-orange-400/10 rounded-lg">
                            <Briefcase className="w-5 h-5 text-orange-400" />
                          </div>
                          Company Description
                        </h3>

                        <div className="p-6 bg-gray-800/30 rounded-xl">
                          <p className="text-gray-300 whitespace-pre-wrap text-base leading-relaxed">
                            {myCompany.description ||
                              "No description provided."}
                          </p>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="border-t border-gray-800 pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
                          <div className="text-gray-500 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Registered:{" "}
                            {CompanyUtils.formatDate(
                              myCompany.registrationDate || myCompany.createdAt,
                            )}
                          </div>
                          <div className="text-gray-500 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Last Updated:{" "}
                            {CompanyUtils.formatDate(myCompany.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === "documents" && (
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
                    <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                      <div className="p-2 bg-yellow-400/10 rounded-lg">
                        <FileText className="w-6 h-6 text-yellow-400" />
                      </div>
                      Company Documents
                    </h2>

                    <div className="space-y-6">
                      <div className="bg-gray-800/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium text-white mb-2">
                              Business Registration Certificate
                            </p>
                            <p className="text-sm text-gray-500">
                              Required document
                            </p>
                          </div>
                          {myCompany.documents?.registrationCertificate ? (
                            <a
                              href={myCompany.documents.registrationCertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-yellow-400/10 text-yellow-400 rounded-xl hover:bg-yellow-400/20 transition-colors flex items-center gap-3 text-base"
                            >
                              <ExternalLink className="w-5 h-5" />
                              View Document
                            </a>
                          ) : (
                            <span className="px-6 py-3 bg-red-400/10 text-red-400 rounded-xl text-base">
                              Not Uploaded
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800/30 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium text-white mb-2">
                              TIN Certificate
                            </p>
                            <p className="text-sm text-gray-500">
                              Required document
                            </p>
                          </div>
                          {myCompany.documents?.tinCertificate ? (
                            <a
                              href={myCompany.documents.tinCertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-yellow-400/10 text-yellow-400 rounded-xl hover:bg-yellow-400/20 transition-colors flex items-center gap-3 text-base"
                            >
                              <ExternalLink className="w-5 h-5" />
                              View Document
                            </a>
                          ) : (
                            <span className="px-6 py-3 bg-red-400/10 text-red-400 rounded-xl text-base">
                              Not Uploaded
                            </span>
                          )}
                        </div>
                      </div>

                      {myCompany.documents?.businessLicense && (
                        <div className="bg-gray-800/30 rounded-xl p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-medium text-white mb-2">
                                Business License
                              </p>
                              <p className="text-sm text-gray-500">
                                Optional document
                              </p>
                            </div>
                            <a
                              href={myCompany.documents.businessLicense}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors flex items-center gap-3 text-base"
                            >
                              <ExternalLink className="w-5 h-5" />
                              View Document
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Directors Tab */}
                {activeTab === "directors" && (
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10">
                    <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                      <div className="p-2 bg-blue-400/10 rounded-lg">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      Company Directors
                    </h2>

                    <div className="space-y-6">
                      {myCompany.directors && myCompany.directors.length > 0 ? (
                        myCompany.directors.map(
                          (director: Director, index: number) => (
                            <div
                              key={index}
                              className="bg-gray-800/30 rounded-xl p-6"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                                    {director.fullName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-xl font-medium text-white mb-2">
                                      {director.fullName}
                                    </p>
                                    <p className="text-base text-yellow-400 mb-3">
                                      {director.position}
                                    </p>
                                    <div className="flex gap-6">
                                      <p className="text-sm text-gray-500">
                                        <span className="text-gray-400">
                                          Nationality:
                                        </span>{" "}
                                        {director.nationality}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        <span className="text-gray-400">
                                          ID:
                                        </span>{" "}
                                        {director.idNumber}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-gray-600" />
                          </div>
                          <p className="text-xl text-gray-400 mb-2">
                            No directors added yet
                          </p>
                          <p className="text-base text-gray-500">
                            Add directors to build trust with investors
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // No company selected but companies exist
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16 text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Select a Company
            </h3>
            <p className="text-lg text-gray-400">
              Please select a company from the cards above to view its profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for verification badge
const CompanyVerificationBadge = ({ status }: { status: string }) => {
  const statusLower = status?.toLowerCase();
  const badgeClass = CompanyLicenseStatusUtils.getBadgeClass(statusLower);
  const icon = CompanyLicenseStatusUtils.getIcon(statusLower);
  const text = CompanyLicenseStatusUtils.format(statusLower);

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${badgeClass}`}
    >
      <span className="text-lg">{icon}</span>
      {text}
    </span>
  );
};

export default CompanyProfilePage;
