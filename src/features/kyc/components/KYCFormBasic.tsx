import React, { useState } from "react";
import { Calendar, MapPin, Flag, User, Sparkles } from "lucide-react";

interface KYCFormBasicProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  initialData?: any;
  errors?: Record<string, string>;
}

export const KYCFormBasic: React.FC<KYCFormBasicProps> = ({
  onSubmit,
  loading,
  initialData = {},
  errors = {},
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    dateOfBirth: initialData.dateOfBirth || "",
    nationality: initialData.nationality || "",
    address: initialData.address || "",
    city: initialData.city || "",
    country: initialData.country || "",
    postalCode: initialData.postalCode || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fillDemoBasicKyc = () => {
    setFormData({
      fullName: "Dawit Haile",
      dateOfBirth: "1988-04-12",
      nationality: "Ethiopian",
      address: "Bole Sub City, Road 04",
      city: "Addis Ababa",
      country: "Ethiopia",
      postalCode: "1000",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Basic Information
          </h2>
          <p className="text-gray-400">
            Provide your personal information for identity verification
          </p>
        </div>
        <button
          type="button"
          onClick={fillDemoBasicKyc}
          className="px-4 py-2 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 self-start cursor-pointer shadow-lg"
        >
          <Sparkles size={14} /> Fill Demo KYC
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Legal Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Write your full name as in official documents"
              className={`w-full bg-[#1A1A1A] border ${errors.fullName ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
              required
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-3.5 text-gray-500"
              size={20}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full bg-[#1A1A1A] border ${errors.dateOfBirth ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
              required
            />
          </div>
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-400">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nationality
          </label>
          <div className="relative">
            <Flag className="absolute left-3 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Your nationality"
              className={`w-full bg-[#1A1A1A] border ${errors.nationality ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
              required
            />
          </div>
          {errors.nationality && (
            <p className="mt-1 text-sm text-red-400">{errors.nationality}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Address
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-3.5 text-gray-500"
              size={20}
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, P.O. Box, etc."
              className={`w-full bg-[#1A1A1A] border ${errors.address ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
              required
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-400">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className={`w-full bg-[#1A1A1A] border ${errors.city ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
            required
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-400">{errors.city}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className={`w-full bg-[#1A1A1A] border ${errors.country ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
            required
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-400">{errors.country}</p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal/ZIP code"
            className={`w-full bg-[#1A1A1A] border ${errors.postalCode ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
            required
          />
          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>
          )}
        </div>
      </div>

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
            "Submit Basic KYC"
          )}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Your information will be securely stored and used only for
          verification purposes
        </p>
      </div>
    </form>
  );
};
