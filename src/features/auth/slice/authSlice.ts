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
};

// ✅ LOGIN - Returns user WITH role
export const loginUser = createAsyncThunk<
  LoginResponse, // Return type
  { email: string; password: string }, // Args type
  { rejectValue: { message: string; status?: number } }
>("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>(
      "/api/v1/auth/login/",
      userData,
    );


    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || error.message || "Login failed",
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
    // ✅ userData includes: fullName, email, password, role, phoneNumber
    const response = await api.post("/api/v1/auth/register/", userData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message:
        error.response?.data?.message || error.message || "Register failed",
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
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // ✅ If backend returns user after registration, store it
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Register failed";
      });
  },
});

export default authSlice.reducer;
export const { logout, clearError, updateUserRole } = authSlice.actions;
