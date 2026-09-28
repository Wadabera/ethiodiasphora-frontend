import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import type { CreateIPORequest } from "../types/businessIPOtypes";

interface Props {
  onSubmit: (data: CreateIPORequest) => void;
  loading: boolean;
  error?: string | null;
}

export const CreateIPOForm: React.FC<Props> = ({
  onSubmit,
  loading,
  error,
}) => {
  const [formData, setFormData] = useState<CreateIPORequest>({
    symbol: "",
    offerPrice: 0,
    startDate: "",
    endDate: "",
    prospectusUrl: "",
    totalShares: 0,
    minimumLot: 1,
    maximumLot: 1000,
    faceValue: 10,
    lotSize: 10,
    issueSize: 0,
    description: "",
    sector: "",
    industry: "",
    ipoType: "fresh_issue",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateIPORequest, string>>
  >({});

  // Helper function to format date for backend
  const formatDateForBackend = (
    dateTimeLocal: string,
    isEndDate: boolean,
  ): string => {
    if (!dateTimeLocal) return "";

    const date = new Date(dateTimeLocal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // Return just the date part (YYYY-MM-DD) - backend will handle time transformation
    return `${year}-${month}-${day}`;
  };

  const validateDates = (
    start: string,
    end: string,
  ): { isValid: boolean; error?: string } => {
    if (!start || !end) {
      return { isValid: false };
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Check if dates are valid
    if (isNaN(startDate.getTime())) {
      return { isValid: false, error: "Invalid start date format" };
    }
    if (isNaN(endDate.getTime())) {
      return { isValid: false, error: "Invalid end date format" };
    }

    // Compare dates (compare just the date part)
    const startDateOnly = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    const endDateOnly = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    );

    if (startDateOnly >= endDateOnly) {
      return { isValid: false, error: "End date must be after start date" };
    }

    // Optional: Add business rules
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDateOnly < today) {
      return { isValid: false, error: "Start date cannot be in the past" };
    }

    // Optional: Max IPO duration (e.g., 30 days)
    const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in ms
    if (endDate.getTime() - startDate.getTime() > maxDuration) {
      return { isValid: false, error: "IPO period cannot exceed 30 days" };
    }

    return { isValid: true };
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    // Required fields
    if (!formData.symbol?.trim()) newErrors.symbol = "Symbol is required";
    if (formData.offerPrice <= 0)
      newErrors.offerPrice = "Offer price must be > 0";

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    // If both dates exist, validate them
    if (formData.startDate && formData.endDate) {
      const dateValidation = validateDates(
        formData.startDate,
        formData.endDate,
      );
      if (!dateValidation.isValid && dateValidation.error) {
        if (
          dateValidation.error.includes("past") ||
          dateValidation.error.includes("start")
        ) {
          newErrors.startDate = dateValidation.error;
        } else {
          newErrors.endDate = dateValidation.error;
        }
      }
    }

    // Numeric validations
    if (formData.totalShares <= 0)
      newErrors.totalShares = "Total shares must be > 0";

    // Validate lot constraints
    if (formData.minimumLot > formData.maximumLot) {
      newErrors.maximumLot = "Maximum lots must be greater than minimum lots";
    }

    if (formData.lotSize <= 0) {
      newErrors.lotSize = "Lot size must be > 0";
    }

    if (!formData.description?.trim())
      newErrors.description = "Description is required";

    // URL validation
    if (formData.prospectusUrl && !isValidUrl(formData.prospectusUrl)) {
      newErrors.prospectusUrl = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Format dates for backend (YYYY-MM-DD only)
      const submissionData: CreateIPORequest = {
        ...formData,
        startDate: formData.startDate
          ? formatDateForBackend(formData.startDate, false)
          : "",
        endDate: formData.endDate
          ? formatDateForBackend(formData.endDate, true)
          : "",
        // Ensure numeric fields are numbers
        offerPrice: Number(formData.offerPrice),
        totalShares: Number(formData.totalShares),
        minimumLot: Number(formData.minimumLot),
        maximumLot: Number(formData.maximumLot),
        faceValue: Number(formData.faceValue),
        lotSize: Number(formData.lotSize),
        issueSize: Number(formData.issueSize),
      };
      onSubmit(submissionData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "number" || type === "range") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? 0 : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name as keyof CreateIPORequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Auto-calculate issue size
  React.useEffect(() => {
    if (formData.totalShares && formData.offerPrice) {
      setFormData((prev) => ({
        ...prev,
        issueSize: Number(prev.totalShares) * Number(prev.offerPrice),
      }));
    }
  }, [formData.totalShares, formData.offerPrice]);

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fillDemoIpo = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 20);

    const sStr = startDate.toISOString().split("T")[0];
    const eStr = endDate.toISOString().split("T")[0];

    const rnd = Math.floor(100 + Math.random() * 900);
    setFormData({
      symbol: `ABYSS${rnd}`,
      offerPrice: 250,
      startDate: sStr,
      endDate: eStr,
      prospectusUrl: "https://abyssiniacoffee.et/prospectus.pdf",
      totalShares: 100000,
      minimumLot: 10,
      maximumLot: 1000,
      faceValue: 100,
      lotSize: 10,
      issueSize: 25000000,
      description: "Initial Public Offering for modernizing agro-processing facilities, expanding green export storage, and international logistics.",
      sector: "Agriculture",
      industry: "Agro-Processing & Export",
      ipoType: "fresh_issue",
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#2A2A2A] p-6 rounded-lg border border-gray-700"
    >
      <div className="flex justify-end">
        <button
          type="button"
          onClick={fillDemoIpo}
          className="px-4 py-2 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <Sparkles size={14} /> Fill Demo IPO Data
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symbol */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Symbol <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.symbol ? "border-red-500" : "border-gray-700"}`}
            placeholder="e.g., ETS"
            maxLength={10}
          />
          {errors.symbol && (
            <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>
          )}
        </div>

        {/* IPO Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            IPO Type
          </label>
          <select
            name="ipoType"
            value={formData.ipoType}
            onChange={handleChange}
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
          >
            <option value="fresh_issue">Fresh Issue</option>
            <option value="offer_for_sale">Offer for Sale</option>
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Sector
          </label>
          <input
            type="text"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            placeholder="e.g., Technology"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            placeholder="e.g., Software"
          />
        </div>

        {/* Offer Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Offer Price (ETB) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="offerPrice"
            value={formData.offerPrice}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.offerPrice ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.offerPrice && (
            <p className="text-red-500 text-xs mt-1">{errors.offerPrice}</p>
          )}
        </div>

        {/* Face Value */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Face Value (ETB) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="faceValue"
            value={formData.faceValue}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
          />
        </div>

        {/* Total Shares */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Total Shares <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="totalShares"
            value={formData.totalShares}
            onChange={handleChange}
            min="1"
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.totalShares ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.totalShares && (
            <p className="text-red-500 text-xs mt-1">{errors.totalShares}</p>
          )}
        </div>

        {/* Issue Size (auto-calculated) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Issue Size (ETB) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="issueSize"
            value={formData.issueSize}
            readOnly
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Auto-calculated from shares × price
          </p>
          {errors.issueSize && (
            <p className="text-red-500 text-xs mt-1">{errors.issueSize}</p>
          )}
        </div>

        {/* Lot Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Lot Size (shares) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="lotSize"
            value={formData.lotSize}
            onChange={handleChange}
            min="1"
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.lotSize ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.lotSize && (
            <p className="text-red-500 text-xs mt-1">{errors.lotSize}</p>
          )}
        </div>

        {/* Minimum Lots */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Minimum Lots <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="minimumLot"
            value={formData.minimumLot}
            onChange={handleChange}
            min="1"
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
          />
        </div>

        {/* Maximum Lots */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Maximum Lots <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="maximumLot"
            value={formData.maximumLot}
            onChange={handleChange}
            min="1"
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.maximumLot ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.maximumLot && (
            <p className="text-red-500 text-xs mt-1">{errors.maximumLot}</p>
          )}
        </div>

        {/* Start Date - Changed to date input since backend only needs date part */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={getTodayString()}
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.startDate ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
          )}
        </div>

        {/* End Date - Changed to date input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={formData.startDate || getTodayString()}
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.endDate ? "border-red-500" : "border-gray-700"}`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
          )}
        </div>

        {/* Prospectus URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Prospectus URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="prospectusUrl"
            value={formData.prospectusUrl}
            onChange={handleChange}
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.prospectusUrl ? "border-red-500" : "border-gray-700"}`}
            placeholder="https://example.com/prospectus.pdf"
          />
          {errors.prospectusUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.prospectusUrl}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white 
              focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]
              ${errors.description ? "border-red-500" : "border-gray-700"}`}
            placeholder="Describe your company and the IPO purpose..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#FFD700] text-[#1A1A1A] font-medium rounded-md hover:bg-[#FFA500] disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating..." : "Create IPO"}
        </button>
      </div>
    </form>
  );
};
