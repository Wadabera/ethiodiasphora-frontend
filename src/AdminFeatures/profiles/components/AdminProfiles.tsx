import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchProfile, updateProfile } from "../../../BusinessOwnerFeatures/profiles/slice/profileSlice";
import ProfileAvatar from "@/BusinessOwnerFeatures/Dashboard/components/ProfileAvatar";
import { Eye, EyeOff, Lock, User, Mail, Phone } from "lucide-react";

export default function AdminProfiles() {
  const dispatch = useAppDispatch();
  const { profile, loading, updateLoading } = useAppSelector(
    (state) => state.profile,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [step, setStep] = useState(1); // For multi-step form if needed

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.phoneNumber) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setErrorMessage("");
    await dispatch(updateProfile(formData));
    dispatch(fetchProfile());
  };

  const handleDiscard = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        email: profile.email || "",
      });
    }
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-[#FFD700] font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      {/* Gold blur effect background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Header with gold gradient */}
        <div className="bg-gradient-to-r from-[#FFD700]/90 to-[#FFA500]/90 rounded-2xl p-6 mb-8 shadow-xl border border-[#FFD700]/30">
          <h2 className="text-2xl font-bold font-montserrat text-black">
            Personal Information
          </h2>
          <p className="text-black/80 text-sm mt-1">
            Update your personal details below
          </p>
        </div>

        <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 p-8">
            {/* LEFT SIDEBAR - Profile Section */}
            <div className="md:w-1/3 flex flex-col items-center text-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-[#FFD700] border border-gray-700 flex items-center justify-center">
                  <ProfileAvatar fullName={profile?.fullName} />
                </div>

                
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-xl text-white">
                  {profile?.fullName || "User"}
                </h3>
                <div className="inline-block bg-[#FFD700]/10 text-[#FFD700] px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {profile?.role || "User Role"}
                </div>
              </div>

              <button
                type="button"
                className="w-full px-4 py-2 border-2 border-[#FFD700] text-[#FFD700] rounded-lg font-medium hover:bg-[#FFD700]/10 transition-colors duration-300"
              >
                Upload Photo
              </button>

              
            </div>

            {/* RIGHT FORM */}
            <form onSubmit={handleSubmit} className="md:w-2/3 space-y-6">
              {errorMessage && (
                <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name Field */}
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
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="w-full bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>

                {/* Phone Number Field */}
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
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="+251 9xx xxx xxx"
                      className="w-full bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field (Disabled) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3.5 text-gray-500"
                    size={20}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    
                    className="w-full bg-[#2A2A2A]/50 border border-gray-700 text-gray-400 placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-3.5">
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                      change email
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Email address cannot be changed
                </p>
              </div>

              {/* Password Update Section (Optional) */}
              <div className="pt-4 border-t border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Password Update (Optional)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-3.5 text-gray-500"
                        size={20}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-[#FFD700] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full bg-[#2A2A2A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-10 focus:outline-none focus:border-[#FFD700] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300"
                >
                  Discard Changes
                </button>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* FOOTER STATUS BAR */}
          {profile && (
            <div className="border-t border-gray-800 bg-[#1A1A1A] px-8 py-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                  <span className="text-gray-400">Account Created:</span>
                  <span className="text-white font-medium">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white font-medium">
                    {profile.updatedAt
                      ? new Date(profile.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-400">User ID:</span>
                  <span className="text-white font-medium font-mono">
                    {profile.id ? profile.id.slice(0, 8) + "..." : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
