import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Phone, User, Sparkles } from "lucide-react";
import { registerUser } from "../slice/authSlice";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import type { RootState } from "@/store/store";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, user, error } = useAppSelector(
    (state: RootState) => state.auth,
  );
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "", // Fixed: lowercase 'p'
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user types
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const errors = {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    };
    let isValid = true;

    // Check required fields
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.role) {
      errors.role = "Please select a role";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for dispatch - match your authSlice parameters
      const userData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // DISPATCH WITH CORRECT PARAMETERS
      const response = await dispatch(registerUser(userData));

      if (response.meta.requestStatus === "fulfilled") {
        navigate("/verify-email", {
          state: {
            email: formData.email,
            otp: (response.payload as any)?.otp,
          },
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

 
  // Redirect if already authenticated
  if (isAuthenticated) {
  
    const dashboardPath =
      user?.role === "admin"
        ? "/admin"
        : user?.role === "local_business"
          ? "/business"
          : user?.role === "diaspora_investor"
            ? "/investor"
            : "/business";

    return <Navigate to={dashboardPath} replace />;
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-gray-900 to-black">
      {/* Header with ET | EthioDisapora */}
      <div className="text-center mb-8">
        <Link to="/" className="block mb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-[#FFD700] text-[#1A1A1A] font-bold text-3xl px-4 py-2 rounded-lg shadow-lg">
              ET
            </div>
            <div className="h-8 w-[1px] bg-[#FFD700]/50"></div>
            <div className="text-[#FFD700] text-2xl font-bold tracking-wide">
              EthioDiaspora
            </div>
          </div>
        </Link>

        <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
        <p className="text-gray-400">Join our global community</p>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="w-full max-w-md mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-400 mr-3"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="w-full max-w-md bg-[#0F0F0F] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        {/* Quick Demo Registration Autofill */}
        <div className="mb-6 p-3.5 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border border-[#FFD700]/30 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FFD700]" /> Demo Quick-Fill
            </span>
            <span className="text-[10px] text-gray-400">1-Click Form Fill</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                const rnd = Math.floor(100 + Math.random() * 900);
                setFormData({
                  fullName: "Sara Tadesse",
                  phoneNumber: "+251911556677",
                  email: `demo.investor${rnd}@ethiodiaspora.com`,
                  password: "Password123!",
                  confirmPassword: "Password123!",
                  role: "diaspora_investor",
                });
                setFormErrors({ fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", role: "" });
              }}
              className="px-2 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#FFD700]/20 border border-gray-700 hover:border-[#FFD700]/60 transition-all text-left group cursor-pointer"
            >
              <div className="text-xs font-bold text-white group-hover:text-[#FFD700] flex items-center gap-1">
                🌍 Investor
              </div>
              <div className="text-[10px] text-gray-400 truncate mt-0.5">Sara Tadesse</div>
            </button>

            <button
              type="button"
              onClick={() => {
                const rnd = Math.floor(100 + Math.random() * 900);
                setFormData({
                  fullName: "Solomon Desta",
                  phoneNumber: "+251911223344",
                  email: `demo.business${rnd}@ethiodiaspora.com`,
                  password: "Password123!",
                  confirmPassword: "Password123!",
                  role: "local_business",
                });
                setFormErrors({ fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", role: "" });
              }}
              className="px-2 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#FFD700]/20 border border-gray-700 hover:border-[#FFD700]/60 transition-all text-left group cursor-pointer"
            >
              <div className="text-xs font-bold text-white group-hover:text-[#FFD700] flex items-center gap-1">
                💼 Business
              </div>
              <div className="text-[10px] text-gray-400 truncate mt-0.5">Solomon Desta</div>
            </button>

            <button
              type="button"
              onClick={() => {
                const rnd = Math.floor(100 + Math.random() * 900);
                setFormData({
                  fullName: "Mulugeta Bekele",
                  phoneNumber: "+251911883344",
                  email: `demo.admin${rnd}@ethiodiaspora.com`,
                  password: "Password123!",
                  confirmPassword: "Password123!",
                  role: "admin",
                });
                setFormErrors({ fullName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", role: "" });
              }}
              className="px-2 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#FFD700]/20 border border-gray-700 hover:border-[#FFD700]/60 transition-all text-left group cursor-pointer"
            >
              <div className="text-xs font-bold text-white group-hover:text-[#FFD700] flex items-center gap-1">
                🛡️ Admin
              </div>
              <div className="text-[10px] text-gray-400 truncate mt-0.5">Mulugeta B.</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Write your full name"
                className={`w-full bg-[#1A1A1A] border ${formErrors.fullName ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.fullName && (
              <p className="mt-1 text-sm text-red-400">{formErrors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="tel"
                name="phoneNumber" // Fixed: lowercase 'p'
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Write your phone number"
                className={`w-full bg-[#1A1A1A] border ${formErrors.phoneNumber ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.phoneNumber && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.phoneNumber}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Write your email"
                className={`w-full bg-[#1A1A1A] border ${formErrors.email ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full bg-[#1A1A1A] border ${formErrors.password ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-500"
                size={20}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`w-full bg-[#1A1A1A] border ${formErrors.confirmPassword ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Choose Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose Role
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full bg-[#1A1A1A] border ${formErrors.role ? "border-red-500" : "border-gray-700"} text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all appearance-none`}
                required
              >
                <option value="" disabled className="text-gray-500">
                  Choose Role
                </option>
                <option
                  value="local_business"
                  className="text-white bg-[#1A1A1A]"
                >
                  Business Owner
                </option>
                <option
                  value="diaspora_investor"
                  className="text-white bg-[#1A1A1A]"
                >
                  As Investor
                </option>
                <option value="admin" className="text-white bg-[#1A1A1A]">
                  Admin
                </option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {formErrors.role && (
              <p className="mt-1 text-sm text-red-400">{formErrors.role}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-6"></div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-500 hover:to-[#FFD700] text-black font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                Creating Account...
              </span>
            ) : (
              "Register"
            )}
          </button>

          {/* Already Registered */}
          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-[#FFD700] hover:text-yellow-400 font-semibold transition-colors"
              >
                Login To account
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Terms & Conditions */}
      <p className="text-center text-gray-500 text-sm mt-8 max-w-md">
        By registering, you agree to our Terms & Conditions and Privacy Policy
      </p>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
