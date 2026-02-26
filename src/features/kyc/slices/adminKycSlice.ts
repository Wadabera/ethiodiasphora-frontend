// ============================================
// ADMIN KYC SLICE - Admin State Management
// ============================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AdminKYCState,  } from "../types/kycTypes";
import { adminKycService } from "../service/kycService";
import type { RootState } from "@/store/store";

const initialState: AdminKYCState = {
  submissions: [],
  selectedSubmission: null,
  loading: false,
  error: null,
  filters: {
    status: "all",
    level: "all",
    userType: "all",
    search: "",
    page: 1,
    limit: 20,
  },
  pagination: null,
};

// Async Thunks
export const fetchAdminSubmissions = createAsyncThunk(
  "adminKyc/fetchSubmissions",
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await adminKycService.getAllSubmissions(filters);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch submissions",
      );
    }
  },
);

export const fetchSubmissionDetails = createAsyncThunk(
  "adminKyc/fetchDetails",
  async (kycId: string, { rejectWithValue }) => {
    try {
      const response = await adminKycService.getSubmissionDetails(kycId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch details",
      );
    }
  },
);

export const approveSubmission = createAsyncThunk(
  "adminKyc/approve",
  async (
    { kycId, notes }: { kycId: string; notes: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.approveKYC(kycId, notes);
      return { kycId, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve",
      );
    }
  },
);

export const rejectSubmission = createAsyncThunk(
  "adminKyc/reject",
  async (
    { kycId, reason, notes }: { kycId: string; reason: string; notes: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.rejectKYC(kycId, reason, notes);
      return { kycId, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject",
      );
    }
  },
);

export const requestMoreInfo = createAsyncThunk(
  "adminKyc/requestInfo",
  async (
    { kycId, message }: { kycId: string; message: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.requestMoreInfo(kycId, message);
      return { kycId, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request info",
      );
    }
  },
);

export const sendToReview = createAsyncThunk(
  "adminKyc/sendToReview",
  async (
    { kycId, notes }: { kycId: string; notes: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await adminKycService.sendToReview(kycId, notes);
      return { kycId, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send to review",
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
    updateSubmissionStatus: (state, action) => {
      const { kycId, status, notes, rejectionReason } = action.payload;

      // Update in submissions list
      state.submissions = state.submissions.map((sub) =>
        sub._id === kycId
          ? {
              ...sub,
              status,
              reviewNotes: notes || sub.reviewNotes,
              rejectionReason: rejectionReason || sub.rejectionReason,
              reviewedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : sub,
      );

      // Update selected submission if it's the same
      if (state.selectedSubmission && state.selectedSubmission._id === kycId) {
        state.selectedSubmission = {
          ...state.selectedSubmission,
          status,
          reviewNotes: notes || state.selectedSubmission.reviewNotes,
          rejectionReason:
            rejectionReason || state.selectedSubmission.rejectionReason,
          reviewedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
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
        state.submissions = action.payload.kycs || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAdminSubmissions.rejected, (state, action) => {
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
      })

      // Send to review
      .addCase(sendToReview.fulfilled, (state, action) => {
        const { kycId } = action.payload;
        state.submissions = state.submissions.map((sub) =>
          sub._id === kycId ? { ...sub, status: "under_review" } : sub,
        );
        if (state.selectedSubmission?._id === kycId) {
          state.selectedSubmission = {
            ...state.selectedSubmission,
            status: "under_review",
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
  updateSubmissionStatus,
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
