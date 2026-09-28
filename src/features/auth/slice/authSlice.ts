// ============ authSlice.ts ============
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../../services/api";
import type {
  User,
  LoginResponse,
  RegisterData,
  AuthState,
} from "../../../types/index";

// Use the AuthState interface from types
const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true" || false,
  user: localStorage.getItem("user")
    ? (JSON.parse(localStorage.getItem("user")!) as User)
    : null,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
  verificationEmail: null,
  verificationLoading: false,
  verificationSuccess: false,
  verificationMessage: null,
  verificationOtp: null,
};

// ✅ LOGIN - Returns user WITH role
export const loginUser = createAsyncThunk<
  LoginResponse, // Return type
  { email: string; password: string }, // Args type
  { rejectValue: { message: string; status?: number } }
>("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>(
      "/api/v1/auth/login",
      userData,
    );

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    const errorMsg =
      Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error.response?.data?.message || error.message || "Login failed";
    return rejectWithValue({
      message: errorMsg,
      status: error.response?.status,
    });
  }
});

// ✅ REGISTER - Send role to backend
export const registerUser = createAsyncThunk<
  { message: string; user?: User }, // Return type
  RegisterData, // ✅ Use RegisterData from types
  { rejectValue: { message: string; status?: number } }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const nameParts = (userData.fullName || "").trim().split(/\s+/);
    const firstName = userData.firstName || nameParts[0] || "User";
    const lastName =
      userData.lastName ||
      (nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0]) ||
      "User";

    let phone = (userData.phoneNumber || "").trim();
    if (phone && !phone.startsWith("+")) {
      phone = phone.startsWith("0") ? `+251${phone.slice(1)}` : `+251${phone}`;
    }

    const payload = {
      ...userData,
      firstName,
      lastName,
      phoneNumber: phone.length >= 10 ? phone : "+251911223344",
    };

    const response = await api.post("/api/v1/auth/register", payload);
    return response.data;
  } catch (error: any) {
    const errorMsg =
      Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error.response?.data?.message || error.message || "Register failed";
    return rejectWithValue({
      message: errorMsg,
      status: error.response?.status,
    });
  }
});

// ✅ VERIFY EMAIL OTP - Activates account
export const verifyEmailOtp = createAsyncThunk<
  { message: string },
  { email: string; otp: string },
  { rejectValue: { message: string; status?: number } }
>("auth/verifyEmailOtp", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/v1/auth/verify-email", { email, otp });
    return response.data;
  } catch (error: any) {
    const errorMsg =
      Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error.response?.data?.message || error.message || "Invalid OTP code";
    return rejectWithValue({
      message: errorMsg,
      status: error.response?.status,
    });
  }
});

// ✅ RESEND VERIFICATION OTP
export const resendVerificationOtp = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: { message: string; status?: number } }
>("auth/resendVerificationOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/v1/auth/resend-verification", { email });
    return response.data;
  } catch (error: any) {
    const errorMsg =
      Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(", ")
        : error.response?.data?.message || error.message || "Failed to resend code";
    return rejectWithValue({
      message: errorMsg,
      status: error.response?.status,
    });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
      state.verificationMessage = null;
    },
    setVerificationEmail(state, action: PayloadAction<string>) {
      state.verificationEmail = action.payload;
    },
    resetVerificationState(state) {
      state.verificationLoading = false;
      state.verificationSuccess = false;
      state.verificationMessage = null;
      state.verificationOtp = null;
      state.error = null;
    },
    // ✅ Add this to update user role if needed
    updateUserRole(state, action: PayloadAction<User["role"]>) {
      if (state.user) {
        state.user.role = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== LOGIN CASES =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = action.payload.access_token;
          state.user = action.payload.user; // ✅ User WITH role from backend
          state.error = null;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ===== REGISTER CASES =====
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.verificationEmail = action.meta.arg.email;
        state.verificationOtp = (action.payload as any)?.otp || null;
        state.verificationSuccess = false;
        state.verificationMessage = action.payload.message;
        // Do not set isAuthenticated = true here because email needs verification!
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Register failed";
      })

      // ===== VERIFY EMAIL CASES =====
      .addCase(verifyEmailOtp.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
        state.verificationSuccess = false;
      })
      .addCase(verifyEmailOtp.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verificationSuccess = true;
        state.verificationMessage = action.payload.message;
        state.verificationOtp = null;
        state.error = null;
      })
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationSuccess = false;
        state.error = action.payload?.message || "Invalid OTP code";
      })

      // ===== RESEND VERIFICATION CASES =====
      .addCase(resendVerificationOtp.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationOtp.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.verificationMessage = action.payload.message;
        state.verificationOtp = (action.payload as any)?.otp || null;
        state.error = null;
      })
      .addCase(resendVerificationOtp.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload?.message || "Failed to resend code";
      });
  },
});

export default authSlice.reducer;
export const {
  logout,
  clearError,
  updateUserRole,
  setVerificationEmail,
  resetVerificationState,
} = authSlice.actions;
