import React, { useState } from "react";
import {
  Settings,
  Shield,
  DollarSign,
  Mail,
  Sliders,
  CheckCircle2,
  Sparkles,
  Save,
  Globe,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    platformName: "EthioDiaspora Capital & Investment Gateway",
    supportEmail: "support@ethiodiaspora.com",
    usdEtbRate: 142.5,
    remittanceFeePercent: 1.25,
    investmentCommissionPercent: 2.5,
    requireKycForInvestment: true,
    requireCompanyVerificationForIpo: true,
    autoApproveVerifiedDiaspora: false,
    brevoSmtpStatus: "Active / Fallback OTP Enabled",
    maintenanceMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fillDemoSettings = () => {
    setFormData({
      platformName: "EthioDiaspora Capital Gateway",
      supportEmail: "governance@ethiodiaspora.et",
      usdEtbRate: 144.8,
      remittanceFeePercent: 1.0,
      investmentCommissionPercent: 2.0,
      requireKycForInvestment: true,
      requireCompanyVerificationForIpo: true,
      autoApproveVerifiedDiaspora: true,
      brevoSmtpStatus: "Active / Fallback OTP Enabled",
      maintenanceMode: false,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
              <Settings size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white">System Settings & Governance</h1>
          </div>
          <p className="text-gray-400 text-xs">
            Configure exchange rates, platform commission, compliance rules, and communication servers.
          </p>
        </div>

        <button
          type="button"
          onClick={fillDemoSettings}
          className="px-4 py-2.5 bg-[#FFD700]/15 hover:bg-[#FFD700]/25 border border-[#FFD700]/50 text-[#FFD700] rounded-xl font-semibold text-xs transition-all flex items-center gap-2 self-start cursor-pointer shadow-lg"
        >
          <Sparkles size={15} /> Fill Demo Settings
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/40 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <p className="text-sm font-semibold text-green-300">
            Platform settings updated successfully!
          </p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Financial & Exchange Parameters */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-gray-800 pb-3">
            <DollarSign size={16} className="text-[#FFD700]" /> Financial & FX Rate Settings
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Official FX Rate (USD to ETB)
              </label>
              <input
                type="number"
                step="0.1"
                name="usdEtbRate"
                value={formData.usdEtbRate}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Remittance Platform Fee (%)
              </label>
              <input
                type="number"
                step="0.05"
                name="remittanceFeePercent"
                value={formData.remittanceFeePercent}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Investment Commission (%)
              </label>
              <input
                type="number"
                step="0.1"
                name="investmentCommissionPercent"
                value={formData.investmentCommissionPercent}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Compliance & Governance */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-gray-800 pb-3">
            <Shield size={16} className="text-[#FFD700]" /> Compliance & Regulatory Rules
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="requireKycForInvestment"
                checked={formData.requireKycForInvestment}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#FFD700] focus:ring-[#FFD700] bg-gray-900 border-gray-700"
              />
              <div>
                <span className="text-xs font-medium text-white block">
                  Mandatory KYC Approval for Capital Investment
                </span>
                <span className="text-[11px] text-gray-500">
                  Diaspora investors must have approved identity documents before funding projects.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="requireCompanyVerificationForIpo"
                checked={formData.requireCompanyVerificationForIpo}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#FFD700] focus:ring-[#FFD700] bg-gray-900 border-gray-700"
              />
              <div>
                <span className="text-xs font-medium text-white block">
                  Mandatory Company Verification for IPO Issuance
                </span>
                <span className="text-[11px] text-gray-500">
                  Only commercial enterprises with verified trade licenses can list public offerings.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="autoApproveVerifiedDiaspora"
                checked={formData.autoApproveVerifiedDiaspora}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#FFD700] focus:ring-[#FFD700] bg-gray-900 border-gray-700"
              />
              <div>
                <span className="text-xs font-medium text-white block">
                  Expedited Approval for Tier-3 Diaspora Investors
                </span>
                <span className="text-[11px] text-gray-500">
                  Auto-verify diaspora investors who submit verified foreign passports.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 3: Notification & Communication */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-gray-800 pb-3">
            <Mail size={16} className="text-[#FFD700]" /> Email & Notification Gateway
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Support & System Sender Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-[#FFD700] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Email / Brevo Verification Service Status
              </label>
              <input
                type="text"
                readOnly
                value={formData.brevoSmtpStatus}
                className="w-full bg-[#141414] border border-gray-800 text-green-400 font-semibold rounded-lg p-2.5 text-xs outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save size={15} /> Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
