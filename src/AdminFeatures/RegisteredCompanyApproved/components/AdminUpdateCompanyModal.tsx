import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Building2,
  // Mail,
  // Phone,
  // MapPin,
  // Globe,
  // FileText,
  // Briefcase,
  // Hash,
  // Tag,
} from "lucide-react";
import type {
  Company,
  UpdateCompanyDto,
  BusinessType,
} from "../types/company.types";

interface AdminUpdateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, data: UpdateCompanyDto) => Promise<void>;
  company: Company | null;
  actionLoading: string | null;
}

const businessTypes: BusinessType[] = [
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

const AdminUpdateCompanyModal: React.FC<AdminUpdateCompanyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  company,
  actionLoading,
}) => {
  const [formData, setFormData] = useState<UpdateCompanyDto>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || company.companyName,
        registrationNumber: company.registrationNumber,
        tinNumber: company.tinNumber,
        businessType: company.businessType,
        email: company.email,
        phone: company.phone || company.phoneNumber,
        website: company.website,
        address: { ...company.address },
        industry: company.industry || company.sector,
        description: company.description,
        isActive: company.isActive,
      });
    }
  }, [company]);

  if (!isOpen || !company) return null;

  const isLoading = isSubmitting || actionLoading === company._id;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "address") {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(company._id, formData);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto py-8">
      <div className="relative w-full max-w-2xl mx-4 bg-[#0F0F0F] border border-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Update Company</h3>
              <p className="text-sm text-gray-400">Edit company information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-white mb-4">
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    TIN Number
                  </label>
                  <input
                    type="text"
                    name="tinNumber"
                    value={formData.tinNumber || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-md font-medium text-white mb-4">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-md font-medium text-white mb-4">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address?.street || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address?.city || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address?.state || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address?.postalCode || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address?.country || "Ethiopia"}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-md font-medium text-white mb-4">
                Business Details
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry || ""}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-md font-medium text-white mb-4">
                Account Status
              </h4>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-blue-500 bg-[#1A1A1A] border-gray-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">
                    Account is active
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Company
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateCompanyModal;
