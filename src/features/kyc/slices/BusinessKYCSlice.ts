// ============================================
// KYC SLICE - User KYC State Management
// ============================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { KYCState, KYCSubmissionRequest } from "../types/kycTypes";
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
  async (data: KYCSubmissionRequest, { rejectWithValue }) => {
    try {
      const response = await kycService.submitKYC(data);
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await kycService.getKYCStatus();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch KYC status",
      );
    }
  },
);

export const uploadDocument = createAsyncThunk(
  "kyc/upload",
  async ({ file, type }: { file: File; type: string }, { rejectWithValue }) => {
    try {
      const response = await kycService.uploadDocument(file, type);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload document",
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
        // Refresh status after submission
        // Status will be fetched separately
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

        // Auto-set current level based on status
        if (action.payload.byLevel.basic !== "approved") {
          state.currentLevel = "basic";
        } else if (action.payload.byLevel.intermediate !== "approved") {
          state.currentLevel = "intermediate";
        } else if (action.payload.byLevel.advanced !== "approved") {
          state.currentLevel = "advanced";
        }
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
export const selectCurrentLevel = (state: RootState) => state.kyc.currentLevel;
