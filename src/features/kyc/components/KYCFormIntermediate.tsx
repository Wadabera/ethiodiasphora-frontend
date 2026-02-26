// src/features/kyc/components/KYCFormIntermediate.tsx
import React, { useState } from "react";
import { FileText, IdCard, Briefcase, DollarSign } from "lucide-react";
import { DocumentUploader } from "./DocumentUploader";

interface KYCFormIntermediateProps {
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  initialData?: any;
  errors?: Record<string, string>;
}

export const KYCFormIntermediate: React.FC<KYCFormIntermediateProps> = ({
  onSubmit,
  loading,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    idDocumentType: initialData.idDocumentType || "passport",
    idDocumentNumber: initialData.idDocumentNumber || "",
    idDocumentFrontImage: initialData.idDocumentFrontImage || null,
    idDocumentBackImage: initialData.idDocumentBackImage || null,
    selfieImage: initialData.selfieImage || null,
    employmentStatus: initialData.employmentStatus || "",
    occupation: initialData.occupation || "",
    annualIncome: initialData.annualIncome || "", // Keep as string for input
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

    if (!formData.idDocumentType)
      errors.idDocumentType = "Document type is required";
    if (!formData.idDocumentNumber.trim())
      errors.idDocumentNumber = "Document number is required";
    if (!formData.idDocumentFrontImage)
      errors.idDocumentFrontImage = "Front image is required";
    if (!formData.idDocumentBackImage)
      errors.idDocumentBackImage = "Back image is required";
    if (!formData.selfieImage) errors.selfieImage = "Selfie is required";
    if (!formData.employmentStatus)
      errors.employmentStatus = "Employment status is required";
    if (!formData.occupation.trim())
      errors.occupation = "Occupation is required";

    // ✅ Validate annualIncome is a valid number
    if (!formData.annualIncome) {
      errors.annualIncome = "Annual income is required";
    } else if (
      isNaN(Number(formData.annualIncome)) ||
      Number(formData.annualIncome) <= 0
    ) {
      errors.annualIncome = "Annual income must be a positive number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // ✅ Convert annualIncome to number before submitting
      const submitData = {
        ...formData,
        annualIncome: Number(formData.annualIncome), // Convert to number!
      };

      await onSubmit(submitData);
    } catch (err) {
      // Error handled in parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Rest of your JSX remains exactly the same */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-400">
          Upload your identity documents for verification
        </p>
      </div>

      {/* Document Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ID Document Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <IdCard className="absolute left-3 top-3.5 text-gray-500" size={20} />
          <select
            name="idDocumentType"
            value={formData.idDocumentType}
            onChange={handleChange}
            className={`w-full bg-[#1A1A1A] border ${formErrors.idDocumentType ? "border-red-500" : "border-gray-700"} text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all appearance-none`}
            required
          >
            <option value="" disabled>
              Select document type
            </option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>
        {formErrors.idDocumentType && (
          <p className="mt-1 text-sm text-red-400">
            {formErrors.idDocumentType}
          </p>
        )}
      </div>

      {/* Document Number */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Document Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <FileText
            className="absolute left-3 top-3.5 text-gray-500"
            size={20}
          />
          <input
            type="text"
            name="idDocumentNumber"
            value={formData.idDocumentNumber}
            onChange={handleChange}
            placeholder="Enter your document number"
            className={`w-full bg-[#1A1A1A] border ${formErrors.idDocumentNumber ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
            required
          />
        </div>
        {formErrors.idDocumentNumber && (
          <p className="mt-1 text-sm text-red-400">
            {formErrors.idDocumentNumber}
          </p>
        )}
      </div>

      {/* Document Uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Front Image */}
        <div>
          <DocumentUploader
            label="Front of Document"
            description="Upload clear photo of the front side"
            accept="image/*"
            required
            value={formData.idDocumentFrontImage}
            onChange={(file) => handleFileChange("idDocumentFrontImage", file)}
            error={formErrors.idDocumentFrontImage}
          />
        </div>

        {/* Back Image */}
        <div>
          <DocumentUploader
            label="Back of Document"
            description="Upload clear photo of the back side"
            accept="image/*"
            required
            value={formData.idDocumentBackImage}
            onChange={(file) => handleFileChange("idDocumentBackImage", file)}
            error={formErrors.idDocumentBackImage}
          />
        </div>

        {/* Selfie */}
        <div className="md:col-span-2">
          <DocumentUploader
            label="Selfie with Document"
            description="Take a selfie holding your document"
            accept="image/*"
            required
            value={formData.selfieImage}
            onChange={(file) => handleFileChange("selfieImage", file)}
            error={formErrors.selfieImage}
          />
        </div>
      </div>

      {/* Employment Info */}
      <div className="pt-6 border-t border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6">
          Employment Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Employment Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className={`w-full bg-[#1A1A1A] border ${formErrors.employmentStatus ? "border-red-500" : "border-gray-700"} text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all appearance-none`}
                required
              >
                <option value="" disabled>
                  Select employment status
                </option>
                <option value="employed">Employed</option>
                <option value="self_employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            {formErrors.employmentStatus && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.employmentStatus}
              </p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Occupation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Your occupation/job title"
                className={`w-full bg-[#1A1A1A] border ${formErrors.occupation ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.occupation && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.occupation}
              </p>
            )}
          </div>

          {/* Annual Income */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Annual Income (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                placeholder="Enter your annual income"
                className={`w-full bg-[#1A1A1A] border ${formErrors.annualIncome ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
                min="0"
                step="1000"
              />
            </div>
            {formErrors.annualIncome && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.annualIncome}
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
            "Submit Intermediate KYC"
          )}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Your documents will be securely stored and used only for verification
          purposes
        </p>
      </div>
    </form>
  );
};

export default KYCFormIntermediate;
