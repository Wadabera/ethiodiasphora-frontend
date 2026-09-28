import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  verifyEmailOtp,
  resendVerificationOtp,
  clearError,
  resetVerificationState,
} from "../slice/authSlice";

export default function VerifyEmail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Get email and OTP from router state, query params, or Redux store
  const reduxEmail = useAppSelector((state) => state.auth.verificationEmail);
  const reduxOtp = useAppSelector((state) => state.auth.verificationOtp);
  const stateOtp = (location.state as any)?.otp;
  const activeOtp = stateOtp || reduxOtp;

  const initialEmail =
    (location.state as any)?.email ||
    searchParams.get("email") ||
    reduxEmail ||
    "";

  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(
    activeOtp && activeOtp.length === 6 ? activeOtp.split("") : ["", "", "", "", "", ""]
  );
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verificationLoading, verificationSuccess, error, verificationMessage } =
    useAppSelector((state) => state.auth);

  // Sync otpDigits if activeOtp becomes available later (e.g. after resend)
  useEffect(() => {
    if (activeOtp && activeOtp.length === 6) {
      setOtpDigits(activeOtp.split(""));
    }
  }, [activeOtp]);

  useEffect(() => {
    dispatch(clearError());
    dispatch(resetVerificationState());
  }, [dispatch]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0 && !canResend) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, canResend]);

  // Auto focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric
    const cleanVal = value.replace(/[^0-9]/g, "");
    if (!cleanVal && value !== "") return;

    const newDigits = [...otpDigits];

    // Handling paste
    if (cleanVal.length > 1) {
      const pastedChars = cleanVal.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedChars[i] || "";
      }
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pastedChars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto advance to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");

    if (!email) {
      alert("Please provide an email address.");
      return;
    }

    if (fullOtp.length !== 6) {
      return;
    }

    const result = await dispatch(verifyEmailOtp({ email: email.trim(), otp: fullOtp }));

    if (result.meta.requestStatus === "fulfilled") {
      setLocalSuccess(true);
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Email verified successfully! You can now log in to your account.",
            email: email.trim(),
          },
        });
      }, 2500);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    setCanResend(false);
    setResendCooldown(60);
    await dispatch(resendVerificationOtp({ email: email.trim() }));
  };

  const isOtpComplete = otpDigits.every((d) => d.length === 1);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-gray-900 to-black">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
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
          <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-400 text-sm">
            Enter the 6-digit code sent to activate your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Success Banner */}
          {(localSuccess || verificationSuccess) && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/40 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-semibold text-sm">
                  {verificationMessage || "Account Activated Successfully!"}
                </p>
                <p className="text-green-400/80 text-xs mt-1">
                  Redirecting to login page in a moment...
                </p>
              </div>
            </div>
          )}

          {/* Info Banner when email was just sent */}
          {!localSuccess && !verificationSuccess && (
            <div className="mb-4 p-3.5 bg-yellow-500/10 border border-[#FFD700]/30 rounded-xl flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#FFD700] flex-shrink-0" />
              <div className="text-xs text-gray-300 overflow-hidden">
                <span className="text-gray-400">Code sent to: </span>
                <span className="text-white font-medium truncate block">{email || "your email"}</span>
              </div>
            </div>
          )}

          {/* Direct OTP Display Banner */}
          {activeOtp && !localSuccess && !verificationSuccess && (
            <div className="mb-6 p-4 bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-xl">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#FFD700] uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound size={14} /> Verification Code
                </span>
                <button
                  type="button"
                  onClick={() => setOtpDigits(activeOtp.split(""))}
                  className="text-xs text-[#FFD700] hover:text-white underline font-medium cursor-pointer"
                >
                  Auto-fill Code
                </button>
              </div>
              <div className="font-mono text-2xl font-bold tracking-[0.3em] text-[#FFD700] text-center py-2 bg-black/50 border border-[#FFD700]/20 rounded-lg select-all">
                {activeOtp}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-center">
                Use this 6-digit code to activate your account.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && !localSuccess && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {/* If email wasn't passed, allow editing email */}
            {!initialEmail && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#FFD700] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}

            {/* 6 Digit OTP Input Grid */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={idx === 0 ? 6 : 1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-[#1A1A1A] border border-gray-700 focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700] text-[#FFD700] rounded-xl outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={verificationLoading || !isOtpComplete || localSuccess}
              className="w-full bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-500 hover:to-[#FFD700] text-black font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {verificationLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-black" />
                  Verifying Code...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5" />
                  Verify & Activate Account
                </span>
              )}
            </button>

            {/* Resend Code Section */}
            <div className="pt-2 text-center">
              <p className="text-gray-400 text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || verificationLoading}
                  className="text-[#FFD700] hover:text-yellow-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canResend ? "Resend Code" : `Resend in ${resendCooldown}s`}
                </button>
              </p>
            </div>

            <div className="border-t border-gray-800 pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
