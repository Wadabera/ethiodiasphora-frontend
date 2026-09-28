// features/investments/pages/InvestmentFormPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { createInvestment,  } from "../slice/InvestmentSlice";
import type { CreateInvestmentRequest } from "@/types/index";
import {
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Building,
  Shield,
  Percent,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Briefcase,
  MapPin,
  Sparkles,
  // Info,
} from "lucide-react";

const InvestmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // FIX: Use correct property names from your slice
  const {
    createLoading, // This is what your slice has
    createError, // This is what your slice has
    createSuccess, // This is what your slice has
  } = useAppSelector((state) => state.investment);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<CreateInvestmentRequest>({
    title: "",
    businessName: "",
    industry: "",
    sector: "",
    description: "",
    fundingGoal: 100000,
    expectedReturn: 15,
    investmentPeriod: 12,
    minimumInvestment: 1000,
    maxInvestment: 50000,
    riskLevel: "low", 
riskFactors:"mideum",
    businessPlan: "",
    useOfFunds: "",
    location: "",
  });

  const industries = [
    "Technology",
    "Real Estate",
    "Agriculture",
    "Manufacturing",
    "Healthcare",
    "Renewable Energy",
    "Transportation",
    "Education",
    "Tourism",
    "Infrastructure",
    "Retail",
    "Fintech",
  ];

  const riskLevels = [
    {
      value: "low",
      label: "Low Risk",
      color: "bg-green-500",
      description: "Stable returns, proven market",
    },
    {
      value: "medium",
      label: "Medium Risk",
      color: "bg-yellow-500",
      description: "Growing market, moderate volatility",
    },
    {
      value: "high",
      label: "High Risk",
      color: "bg-red-500",
      description: "High growth potential, higher volatility",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Goal") ||
        name.includes("Investment") ||
        name.includes("Return") ||
        name.includes("Period")
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleRiskLevelSelect = (level: string) => {
    setFormData((prev) => ({
      ...prev,
      riskFactors: level, // FIX: Use riskLevel, not riskFactors or riskLevels
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CreateInvestmentRequest)[] = [
      "title",
      "industry",
      "businessName",
      "sector",
      "description",
      "businessPlan",
      "useOfFunds",
      "location",
    ];

    for (const field of requiredFields) {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }

    if (formData.fundingGoal < 1000) {
      alert("Funding goal must be at least 1,000 ETB");
      return false;
    }

    if (formData.minimumInvestment < 100) {
      alert("Minimum investment must be at least 100 ETB");
      return false;
    }

    if (formData.expectedReturn < 1 || formData.expectedReturn > 100) {
      alert("Expected return must be between 1% and 100%");
      return false;
    }

    if (formData.investmentPeriod < 1 || formData.investmentPeriod > 60) {
      alert("Investment period must be between 1 and 60 months");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare the data exactly as backend expects
      const submissionData: CreateInvestmentRequest = {
        title: formData.title,
        businessName: formData.businessName,
        industry: formData.industry,
        sector: formData.sector,
        description: formData.description,
        fundingGoal: Number(formData.fundingGoal),
        expectedReturn: Number(formData.expectedReturn),
        investmentPeriod: Number(formData.investmentPeriod),
        minimumInvestment: Number(formData.minimumInvestment),
        maxInvestment: formData.maxInvestment
          ? Number(formData.maxInvestment)
          : undefined,
        riskFactors: formData.riskFactors || formData.riskLevel, // FIX: Make sure this is set
        businessPlan: formData.businessPlan,
        useOfFunds: formData.useOfFunds,
        location: formData.location,
      };

      console.log("Submitting data:", submissionData);

      const result = await dispatch(createInvestment(submissionData));

      // Check if successful
      if (result.meta.requestStatus === "fulfilled") {
        // Show success modal
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error("Failed to create investment:", err);
    }
  };

  // Clear error after 5 seconds
  useEffect(() => {
    if (createError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [createError, dispatch]);

  // Handle success state
  useEffect(() => {
    if (createSuccess) {
      setShowSuccessModal(true);
    }
  }, [createSuccess]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Optionally reset form or navigate
    // navigate("/business/investments"); // Uncomment if you want navigation
  };

  const fillDemoInvestment = () => {
    setFormData({
      title: "Awash Solar Irrigation & Agri-Hub",
      businessName: "Abyssinia Specialty Coffee Export PLC",
      industry: "Agriculture",
      sector: "Renewable Energy & Agriculture",
      description: "Installation of solar-powered drip irrigation system across 200 hectares of farmland in the Awash river basin, multiplying harvest cycles from 1 to 3 seasons annually.",
      fundingGoal: 200000,
      expectedReturn: 19.5,
      investmentPeriod: 14,
      minimumInvestment: 1500,
      maxInvestment: 60000,
      riskLevel: "medium",
      riskFactors: "Seasonal river flow variations, mitigated by integrated deep groundwater solar borehole backups.",
      businessPlan: "Direct off-take contract with regional agricultural trade unions and export pack-houses ensures steady dollar revenue.",
      useOfFunds: "55% solar pumps & drip lines, 25% pack-house construction, 20% working capital.",
      location: "Awash Valley, Afar / Oromia border",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-6">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-center text-white mb-2">
              Success! 🎉
            </h3>
            <p className="text-gray-300 text-center mb-2">
              Your investment{" "}
              <span className="font-semibold text-yellow-300">
                "{formData.title}"
              </span>{" "}
              has been created successfully!
            </p>
            <p className="text-gray-400 text-center text-sm mb-6">
              It is now pending admin approval. You'll be notified once it's
              approved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Reset form and stay on page
                  setFormData({
                    title: "",
                    businessName: "",
                    industry: "",
                    sector: "",
                    description: "",
                    fundingGoal: 100000,
                    expectedReturn: 15,
                    investmentPeriod: 12,
                    minimumInvestment: 1000,
                    maxInvestment: 50000,
                    riskLevel: "medium",
                    businessPlan: "",
                    useOfFunds: "",
                    location: "",
                  });
                  setShowSuccessModal(false);
                }}
                className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Create Another
              </button>
              <button
                onClick={handleCloseSuccessModal}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                  Create Investment
                </span>
              </h1>
            </div>
            <p className="text-gray-400">
              Fill in the details below to create your investment opportunity
            </p>
          </div>
          <button
            type="button"
            onClick={fillDemoInvestment}
            className="px-4 py-2.5 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-sm transition-all flex items-center gap-2 self-start cursor-pointer shadow-lg"
          >
            <Sparkles size={16} /> Fill Demo Data
          </button>
        </div>

        {/* Error Display */}
        {createError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{createError}</p>
            </div>
          </div>
        )}

        {/* Success inline message (optional) */}
        {createSuccess && !showSuccessModal && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-medium">Success!</p>
              <p className="text-green-300 text-sm">
                Investment created successfully!
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Title *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Tech Startup Expansion"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your business name"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sector *
                </label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <select
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors appearance-none"
                    required
                  >
                    <option value="">Select a sector</option>
                    {industries.map((industry) => (
                      <option
                        key={industry}
                        value={industry}
                        className="bg-gray-900"
                      >
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Addis Ababa, Ethiopia"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry *
                </label>
                <div className="relative">
                  <BarChart3 className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g., Solar Energy, Fintech"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your investment opportunity in detail..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl p-4 focus:outline-none focus:border-yellow-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Details Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">
                Financial Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Funding Goal (ETB) *
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="fundingGoal"
                    value={formData.fundingGoal || ""}
                    onChange={handleChange}
                    placeholder="e.g., 100000"
                    min="1000"
                    step="1000"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Return (%) *
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="expectedReturn"
                    value={formData.expectedReturn}
                    onChange={handleChange}
                    placeholder="e.g., 15"
                    min="1"
                    max="100"
                    step="0.1"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Period (Months) *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="investmentPeriod"
                    value={formData.investmentPeriod}
                    onChange={handleChange}
                    placeholder="e.g., 12"
                    min="1"
                    max="60"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Investment (ETB) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="minimumInvestment"
                    value={formData.minimumInvestment}
                    onChange={handleChange}
                    placeholder="e.g., 1000"
                    min="100"
                    step="100"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum: 100 ETB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Maximum Investment (ETB)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="maxInvestment"
                    value={formData.maxInvestment || ""}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                    min="1000"
                    step="1000"
                    className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Level *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {riskLevels.map((risk) => (
                    <button
                      key={risk.value}
                      type="button"
                      className={`p-4 border rounded-xl text-left transition-all ${
                        formData.riskLevel === risk.value
                          ? "border-yellow-500 bg-yellow-500/10"
                          : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                      }`}
                      onClick={() => handleRiskLevelSelect(risk.value)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${risk.color}`}
                        ></div>
                        <span className="font-medium text-white">
                          {risk.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {risk.description}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Selected:{" "}
                  {formData.riskLevel
                    ? riskLevels.find((r) => r.value === formData.riskLevel)
                        ?.label
                    : "Please select a risk level"}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-white">
                Additional Details
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Plan *
                </label>
                <textarea
                  name="businessPlan"
                  value={formData.businessPlan}
                  onChange={handleChange}
                  placeholder="Provide detailed business plan..."
                  rows={6}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl p-4 focus:outline-none focus:border-yellow-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Use of Funds *
                </label>
                <textarea
                  name="useOfFunds"
                  value={formData.useOfFunds}
                  onChange={handleChange}
                  placeholder="Explain how the investment funds will be utilized..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl p-4 focus:outline-none focus:border-yellow-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-6 bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-300">
                    Your data is secure and encrypted
                  </p>
                  <p className="text-xs text-gray-500">
                    All information is protected
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)} // Go back
                  className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors"
                  disabled={createLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {createLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Create Investment Opportunity
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentFormPage;
