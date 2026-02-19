import React, { useState } from "react";
import {
  Building,
  CreditCard,
  FileText,
  // Home,
  Banknote,
  Percent,
} from "lucide-react";
import { DocumentUploader } from "./DocumentUploader";

interface KYCFormAdvancedProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  initialData?: any;
  errors?: Record<string, string>;
}

export const KYCFormAdvanced: React.FC<KYCFormAdvancedProps> = ({
  onSubmit,
  loading,
  initialData = {},
  errors = {},
}) => {
  const [formData, setFormData] = useState({
    sourceOfFunds: initialData.sourceOfFunds || "",
    bankStatement: initialData.bankStatement || null,
    proofOfAddress: initialData.proofOfAddress || null,
    employmentLetter: initialData.employmentLetter || null,
    taxIdentificationNumber: initialData.taxIdentificationNumber || "",
    bankName: initialData.bankName || "",
    bankAccountNumber: initialData.bankAccountNumber || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.sourceOfFunds)
      errors.sourceOfFunds = "Source of funds is required";
    if (!formData.bankStatement)
      errors.bankStatement = "Bank statement is required";
    if (!formData.proofOfAddress)
      errors.proofOfAddress = "Proof of address is required";
    if (!formData.taxIdentificationNumber.trim())
      errors.taxIdentificationNumber = "Tax ID is required";
    if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
    if (!formData.bankAccountNumber.trim())
      errors.bankAccountNumber = "Bank account is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error handled in parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Financial Verification
        </h2>
        <p className="text-gray-400">
          Provide financial information for investment eligibility
        </p>
      </div>

      {/* Source of Funds */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Source of Funds <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Banknote
            className="absolute left-3 top-3.5 text-gray-500"
            size={20}
          />
          <select
            name="sourceOfFunds"
            value={formData.sourceOfFunds}
            onChange={handleChange}
            className={`w-full bg-[#1A1A1A] border ${formErrors.sourceOfFunds ? "border-red-500" : "border-gray-700"} text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all appearance-none`}
            required
          >
            <option value="" disabled>
              Select source of funds
            </option>
            <option value="employment_salary">Employment Salary</option>
            <option value="business_profits">Business Profits</option>
            <option value="savings">Savings</option>
            <option value="investment_returns">Investment Returns</option>
            <option value="inheritance">Inheritance</option>
            <option value="other">Other</option>
          </select>
        </div>
        {formErrors.sourceOfFunds && (
          <p className="mt-1 text-sm text-red-400">
            {formErrors.sourceOfFunds}
          </p>
        )}
      </div>

      {/* Document Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank Statement */}
        <div className="md:col-span-2">
          <DocumentUploader
            label="Bank Statement (Last 3 Months)"
            description="Upload your bank statement as PDF"
            accept=".pdf,image/*"
            required
            value={formData.bankStatement}
            onChange={(file) => handleFileChange("bankStatement", file)}
            error={formErrors.bankStatement}
          />
        </div>

        {/* Proof of Address */}
        <div>
          <DocumentUploader
            label="Proof of Address"
            description="Utility bill, rental agreement, etc."
            accept=".pdf,image/*"
            required
            value={formData.proofOfAddress}
            onChange={(file) => handleFileChange("proofOfAddress", file)}
            error={formErrors.proofOfAddress}
          />
        </div>

        {/* Employment Letter */}
        <div>
          <DocumentUploader
            label="Employment Letter"
            description="Letter from employer (if employed)"
            accept=".pdf,image/*"
            required={formData.sourceOfFunds === "employment_salary"}
            value={formData.employmentLetter}
            onChange={(file) => handleFileChange("employmentLetter", file)}
            error={formErrors.employmentLetter}
          />
        </div>
      </div>

      {/* Tax Information */}
      <div className="pt-6 border-t border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6">
          Tax & Banking Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tax Identification Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tax Identification Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Percent
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="text"
                name="taxIdentificationNumber"
                value={formData.taxIdentificationNumber}
                onChange={handleChange}
                placeholder="Enter your TIN"
                className={`w-full bg-[#1A1A1A] border ${formErrors.taxIdentificationNumber ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.taxIdentificationNumber && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.taxIdentificationNumber}
              </p>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Your bank's name"
                className={`w-full bg-[#1A1A1A] border ${formErrors.bankName ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.bankName && (
              <p className="mt-1 text-sm text-red-400">{formErrors.bankName}</p>
            )}
          </div>

          {/* Bank Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bank Account Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="text"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                placeholder="Your bank account number"
                className={`w-full bg-[#1A1A1A] border ${formErrors.bankAccountNumber ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.bankAccountNumber && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.bankAccountNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-500 hover:to-[#FFD700] text-black font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Advanced KYC"
          )}
        </button>

        <div className="mt-4 p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-[#FFD700] mr-3 mt-0.5" />
            <div>
              <p className="text-gray-300 font-medium mb-1">Important Notes:</p>
              <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                <li>All documents must be clear and readable</li>
                <li>
                  Bank statements should show your name and account details
                </li>
                <li>Processing may take 2-3 business days</li>
                <li>You will be notified once verification is complete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default KYCFormAdvanced;
