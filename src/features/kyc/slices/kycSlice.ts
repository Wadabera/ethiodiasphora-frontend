import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { KYCState } from "../types/kycTypes";
// import type { KYCStatusResponse } from "../types/kyctypes";
import type { KYCFormSubmission } from "../types/kycTypes";
import { kycService } from "../service/kycService";
import type { RootState } from "@/store/store";

const initialState: KYCState = {
  loading: false,
  error: null,
  kycStatus: null,
  currentLevel: "basic",
  submissions: [],
};

// Async Thunks
export const submitKYC = createAsyncThunk(
  "kyc/submit",
  async (
    { data, token }: { data: KYCSubmission; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await kycService.submitKYC(data, token);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit KYC",
      );
    }
  },
);

export const getKYCStatus = createAsyncThunk(
  "kyc/status",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await kycService.getKYCStatus(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch KYC status",
      );
    }
  },
);

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setCurrentLevel: (state, action) => {
      state.currentLevel = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetKYC: (state) => {
      state.loading = false;
      state.error = null;
      state.kycStatus = null;
      state.submissions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit KYC
      .addCase(submitKYC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKYC.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions.push(action.payload);
      })
      .addCase(submitKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get KYC Status
      .addCase(getKYCStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKYCStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.kycStatus = action.payload;
      })
      .addCase(getKYCStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentLevel, clearError, resetKYC } = kycSlice.actions;
export default kycSlice.reducer;

// Selectors
export const selectKYC = (state: RootState) => state.kyc;
export const selectKYCStatus = (state: RootState) => state.kyc.kycStatus;
export const selectKYCError = (state: RootState) => state.kyc.error;
export const selectKYCLoading = (state: RootState) => state.kyc.loading;
