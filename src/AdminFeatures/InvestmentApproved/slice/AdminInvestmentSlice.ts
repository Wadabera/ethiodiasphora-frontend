
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { Investment } from "@/types/index";

interface AdminInvestmentState {
  fetchLoading: boolean;
  detailsLoading: boolean;
  actionLoading: string | null;
  error: string | null;
  successMessage: string | null;
  investments: Investment[];
  selectedInvestment?: Investment | null;
  filteredInvestments: Investment[];
  stats: {
    total: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
    published: number;
  };
  filters: {
    status: string;
    search: string;
  };
}

const initialState: AdminInvestmentState = {
  fetchLoading: false,
  detailsLoading: false,
  actionLoading: null,
  error: null,
  successMessage: null,
  investments: [],
  filteredInvestments: [],
  stats: {
    total: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    published: 0,
  },
  filters: {
    status: "all",
    search: "",
  },
};

// =================== ASYNC THUNKS ===================
// 1. Fetch all investments for admin
export const fetchAdminInvestments = createAsyncThunk<
  Investment[],
  void,
  { rejectValue: string }
>("adminInvestments/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/investments/admin/all");
    return response.data.investments || response.data || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch investments",
    );
  }
});
//admin fetch details of a single investment
///api/v1/investments/698073a30cd0cb67a6a27d06

export const fetchInvestmentDetails = createAsyncThunk<
  Investment,
  string,
  { rejectValue: string }
>("adminInvestments/fetchDetails", async (id, { rejectWithValue }) => { 
  try {
    const response = await api.get(`/api/v1/investments/${id}`);
    return response.data.investment || response.data || null;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch investment details",
    );
  }
});
// 2. REJECT INVESTMENT
export const rejectInvestment = createAsyncThunk<
  Investment,
  { id: string; reason: string },
  { rejectValue: string }
>("adminInvestments/reject", async ({ id, reason }, { rejectWithValue }) => {
  try {
    console.log(`Sending reject request for investment ${id}`);
    console.log(`Reason: ${reason}`);

    const response = await api.put(`/api/v1/investments/admin/${id}/reject`, {
      reason: reason,
    });

    console.log("Reject API Response:", response.data);

    if (response.data.investment) {
      return response.data.investment;
    } else if (response.data.data) {
      return response.data.data;
    } else {
      return response.data;
    }
  } catch (error: any) {
    console.error("Reject API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return rejectWithValue(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to reject investment",
    );
  }
});

// 3. Approve investment
export const approveInvestment = createAsyncThunk<
  Investment,
  { id: string; notes?: string },
  { rejectValue: string }
>("adminInvestments/approve", async ({ id, notes }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/investments/admin/${id}/approve`, {
      notes: notes || "Approved by admin",
    });

    if (response.data.investment) {
      return response.data.investment;
    } else if (response.data.data) {
      return response.data.data;
    } else {
      return response.data;
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to approve investment",
    );
  }
});

// 4. Publish investment
export const publishInvestment = createAsyncThunk<
  Investment,
  string,
  { rejectValue: string }
>("adminInvestments/publish", async (id, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/investments/admin/${id}/publish`);

    if (response.data.investment) {
      return response.data.investment;
    } else if (response.data.data) {
      return response.data.data;
    } else {
      return response.data;
    }
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to publish investment",
    );
  }
});

// Helper function to normalize status
const normalizeStatus = (status: string): string => {
  if (!status) return "unknown";
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "cancelled") return "rejected";
  return lowerStatus;
};

// Helper function to calculate stats
const calculateStats = (investments: Investment[]) => {
  return {
    total: investments.length,
    draft: investments.filter((inv) => normalizeStatus(inv.status) === "draft")
      .length,
    pending: investments.filter(
      (inv) => normalizeStatus(inv.status) === "pending",
    ).length,
    approved: investments.filter(
      (inv) => normalizeStatus(inv.status) === "approved",
    ).length,
    rejected: investments.filter((inv) => {
      const status = normalizeStatus(inv.status);
      return status === "rejected";
    }).length,
    published: investments.filter(
      (inv) => normalizeStatus(inv.status) === "published",
    ).length,
  };
};

const adminInvestmentSlice = createSlice({
  name: "adminInvestments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<AdminInvestmentState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };

      state.filteredInvestments = state.investments.filter((investment) => {
        const matchesStatus =
          state.filters.status === "all" ||
          investment.status === state.filters.status;

        const matchesSearch =
          !state.filters.search ||
          investment.title
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase()) ||
          investment.businessName
            ?.toLowerCase()
            .includes(state.filters.search.toLowerCase());

        return matchesStatus && matchesSearch;
      });
    },

    // Manual update for optimistic UI updates
    updateInvestmentManually: (
      state,
      action: PayloadAction<{ id: string; status: string }>,
    ) => {
      const { id, status } = action.payload;
      const index = state.investments.findIndex((i) => i._id === id);

      if (index !== -1) {
        const oldStatus = state.investments[index].status;

        // Update the investment
        state.investments[index] = {
          ...state.investments[index],
          status: status,
        };

        // Update filtered investments
        state.filteredInvestments = [...state.investments];

        // Update stats using the helper
        state.stats = calculateStats(state.investments);
      }
    },

    // NEW: Update stats manually
    updateStats: (
      state,
      action: PayloadAction<Partial<AdminInvestmentState["stats"]>>,
    ) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    // NEW: Recalculate stats from current investments
    recalculateStats: (state) => {
      state.stats = calculateStats(state.investments);
    },

    // NEW: Reset state
    resetState: () => initialState,
  },
  extraReducers: (builder) => {

    // =================== FETCH ALL INVESTMENTS ===================
    builder
      .addCase(fetchAdminInvestments.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminInvestments.fulfilled,
        (state, action: PayloadAction<Investment[]>) => {
          state.fetchLoading = false;
          state.investments = action.payload;
          state.filteredInvestments = action.payload;

          // Use the helper function for consistent stats calculation
          state.stats = calculateStats(action.payload);
        },
      )
      .addCase(
        fetchAdminInvestments.rejected,
        (state, action: PayloadAction<any>) => {
          state.fetchLoading = false;
          state.error = action.payload || "Failed to fetch investments";
        },
      );
      //------------------ FETCH INVESTMENT DETAILS ------------------
      builder
      .addCase(fetchInvestmentDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchInvestmentDetails.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.detailsLoading = false;
          state.selectedInvestment = action.payload;
        },
      )
      .addCase(fetchInvestmentDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload || "Failed to fetch investment details";
      });

    // =================== REJECT INVESTMENT ===================
    builder
      .addCase(rejectInvestment.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
        state.error = null;

        // Optimistic update: immediately show as rejected
        const investmentId = action.meta.arg.id;
        const investment = state.investments.find(
          (i) => i._id === investmentId,
        );

        if (investment) {
          const index = state.investments.findIndex(
            (i) => i._id === investmentId,
          );
          if (index !== -1) {
            state.investments[index] = {
              ...state.investments[index],
              status: "rejected",
            };
            state.filteredInvestments = [...state.investments];

            // Recalculate stats
            state.stats = calculateStats(state.investments);
          }
        }
      })
      .addCase(
        rejectInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.actionLoading = null;

          console.log("Reject fulfilled with:", action.payload);

          const index = state.investments.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (index !== -1) {
            state.investments[index] = {
              ...state.investments[index],
              ...action.payload,
              status: action.payload.status || "rejected",
            };
            state.filteredInvestments = [...state.investments];

            // Recalculate stats
            state.stats = calculateStats(state.investments);
          }

          state.successMessage = "Investment rejected successfully!";
        },
      )
      .addCase(rejectInvestment.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to reject investment";

        // Rollback optimistic update on error
        const investmentId = action.meta.arg.id;
        const index = state.investments.findIndex(
          (i) => i._id === investmentId,
        );

        if (index !== -1) {
          // Rollback to original status (default to pending)
          state.investments[index] = {
            ...state.investments[index],
            status: "pending",
          };
          state.filteredInvestments = [...state.investments];

          // Recalculate stats
          state.stats = calculateStats(state.investments);
        }
      });

    // =================== APPROVE INVESTMENT ===================
    builder
      .addCase(approveInvestment.pending, (state, action) => {
        state.actionLoading = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        approveInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.actionLoading = null;

          const index = state.investments.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (index !== -1) {
            state.investments[index] = {
              ...state.investments[index],
              ...action.payload,
              status: action.payload.status || "approved",
            };
            state.filteredInvestments = [...state.investments];

            // Recalculate stats
            state.stats = calculateStats(state.investments);
          }

          state.successMessage = "Investment approved successfully!";
        },
      )
      .addCase(approveInvestment.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to approve investment";
      });

    // =================== PUBLISH INVESTMENT ===================
    builder
      .addCase(publishInvestment.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
        state.error = null;
      })
      .addCase(
        publishInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.actionLoading = null;

          const index = state.investments.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (index !== -1) {
            state.investments[index] = {
              ...state.investments[index],
              ...action.payload,
              status: action.payload.status || "published",
            };
            state.filteredInvestments = [...state.investments];

            // Recalculate stats
            state.stats = calculateStats(state.investments);
          }

          state.successMessage = "Investment published successfully!";
        },
      )
      .addCase(publishInvestment.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload || "Failed to publish investment";
      });
  },
});

// Export all actions
export const {
  clearError,
  clearSuccessMessage,
  setFilters,
  updateInvestmentManually,
  updateStats,
  recalculateStats,
  resetState,
} = adminInvestmentSlice.actions;

export default adminInvestmentSlice.reducer;
