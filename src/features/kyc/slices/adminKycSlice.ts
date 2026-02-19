// slices/adminKycSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { KYCSubmissionRecord, AdminSubmission } from "../types/kycTypes";
import { adminKycService } from "../service/kycService";
import type { RootState } from "@/store/store";

interface AdminKYCState {
  submissions: KYCSubmissionRecord[];
  selectedSubmission: KYCSubmissionRecord | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    level: string;
    page: number;
    limit: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: AdminKYCState = {
  submissions: [],
  selectedSubmission: null,
  loading: false,
  error: null,
  filters: {
    status: "all",
    level: "all",
    page: 1,
    limit: 20,
  },
  pagination: null,
};

// Async Thunks
export const fetchAdminSubmissions = createAsyncThunk(
  "adminKyc/fetchSubmissions",
  async (
    { token, filters }: { token: string; filters?: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.getAllSubmissions(token, filters);
      return response.data;
    } catch (error: any) {
      console.error("Fetch submissions error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch submissions",
      );
    }
  },
);

export const fetchPendingSubmissions = createAsyncThunk(
  "adminKyc/fetchPending",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await adminKycService.getPendingSubmissions(token);
      return response.data;
    } catch (error: any) {
      console.error("Fetch pending error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending submissions",
      );
    }
  },
);

export const fetchSubmissionDetails = createAsyncThunk(
  "adminKyc/fetchDetails",
  async (
    { kycId, token }: { kycId: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.getSubmissionDetails(kycId, token);
      return response.data;
    } catch (error: any) {
      console.error("Fetch details error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch submission details",
      );
    }
  },
);

export const approveSubmission = createAsyncThunk(
  "adminKyc/approve",
  async (
    { kycId, notes, token }: { kycId: string; notes: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.approveKYC(kycId, notes, token);
      return { kycId, ...response.data };
    } catch (error: any) {
      console.error("Approve error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve submission",
      );
    }
  },
);

export const rejectSubmission = createAsyncThunk(
  "adminKyc/reject",
  async (
    {
      kycId,
      reason,
      notes,
      token,
    }: { kycId: string; reason: string; notes: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.rejectKYC(
        kycId,
        reason,
        notes,
        token,
      );
      return { kycId, ...response.data };
    } catch (error: any) {
      console.error("Reject error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject submission",
      );
    }
  },
);

export const requestMoreInfo = createAsyncThunk(
  "adminKyc/requestInfo",
  async (
    {
      kycId,
      message,
      token,
    }: { kycId: string; message: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.requestMoreInfo(
        kycId,
        message,
        token,
      );
      return { kycId, ...response.data };
    } catch (error: any) {
      console.error("Request info error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to request more information",
      );
    }
  },
);

const adminKycSlice = createSlice({
  name: "adminKyc",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedSubmission: (state, action) => {
      state.selectedSubmission = action.payload;
    },
    clearSelectedSubmission: (state) => {
      state.selectedSubmission = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAdminKYC: (state) => {
      state.submissions = [];
      state.selectedSubmission = null;
      state.error = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all submissions
      .addCase(fetchAdminSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAdminSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch pending submissions
      .addCase(fetchPendingSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions || [];
      })
      .addCase(fetchPendingSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch submission details
      .addCase(fetchSubmissionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubmission = action.payload;
      })
      .addCase(fetchSubmissionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Approve submission
      .addCase(approveSubmission.fulfilled, (state, action) => {
        const { kycId } = action.payload;
        state.submissions = state.submissions.map((sub) =>
          sub._id === kycId ? { ...sub, status: "approved" } : sub,
        );
        if (state.selectedSubmission?._id === kycId) {
          state.selectedSubmission = {
            ...state.selectedSubmission,
            status: "approved",
          };
        }
      })
      // Reject submission
      .addCase(rejectSubmission.fulfilled, (state, action) => {
        const { kycId } = action.payload;
        state.submissions = state.submissions.map((sub) =>
          sub._id === kycId ? { ...sub, status: "rejected" } : sub,
        );
        if (state.selectedSubmission?._id === kycId) {
          state.selectedSubmission = {
            ...state.selectedSubmission,
            status: "rejected",
          };
        }
      })
      // Request more info
      .addCase(requestMoreInfo.fulfilled, (state, action) => {
        const { kycId } = action.payload;
        state.submissions = state.submissions.map((sub) =>
          sub._id === kycId ? { ...sub, status: "requires_update" } : sub,
        );
        if (state.selectedSubmission?._id === kycId) {
          state.selectedSubmission = {
            ...state.selectedSubmission,
            status: "requires_update",
          };
        }
      });
  },
});

export const {
  setFilters,
  setSelectedSubmission,
  clearSelectedSubmission,
  clearError,
  resetAdminKYC,
} = adminKycSlice.actions;
export default adminKycSlice.reducer;

// Selectors
export const selectAdminKYC = (state: RootState) => state.adminKyc;
export const selectAdminSubmissions = (state: RootState) =>
  state.adminKyc.submissions;
export const selectSelectedSubmission = (state: RootState) =>
  state.adminKyc.selectedSubmission;
export const selectAdminLoading = (state: RootState) => state.adminKyc.loading;
export const selectAdminError = (state: RootState) => state.adminKyc.error;
export const selectAdminFilters = (state: RootState) => state.adminKyc.filters;
export const selectAdminPagination = (state: RootState) =>
  state.adminKyc.pagination;
