// src/features/admin/IPOManagement/slice/adminIPOSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  AdminIPO,
  AdminIPOStats,
  ApproveIPORequest,
  RejectIPORequest,
  OpenIPORequest,
  CloseIPORequest,
  AllotmentRequest,
  ListStockRequest,
  IPOFilters,
  AllotmentResponse,
} from "../types/adminIPOtypes";

interface AdminIPOState {
  // IPOs list
  ipos: AdminIPO[];
  selectedIPO: AdminIPO | null;
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: IPOFilters;

  // Stats
  stats: AdminIPOStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Action states
  actionLoading: boolean;
  actionSuccess: boolean;
  actionError: string | null;
  allotmentResult: AllotmentResponse | null;
}

const initialState: AdminIPOState = {
  ipos: [],
  selectedIPO: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    page: 1,
    limit: 10,
  },
  stats: null,
  statsLoading: false,
  statsError: null,
  actionLoading: false,
  actionSuccess: false,
  actionError: null,
  allotmentResult: null,
};

// ============= HELPER FUNCTIONS =============

/**
 * Calculate comprehensive stats from IPO array
 */
const calculateStatsFromIPOs = (ipos: AdminIPO[]): AdminIPOStats => {
  const stats: AdminIPOStats = {
    totalIPOs: ipos.length,
    pendingApproval: ipos.filter((ipo) => ipo?.status === "pending_approval")
      .length,
    announced: ipos.filter((ipo) => ipo?.status === "announced").length,
    open: ipos.filter((ipo) => ipo?.status === "open").length,
    closed: ipos.filter((ipo) => ipo?.status === "closed").length,
    allotted: ipos.filter((ipo) => ipo?.status === "allotted").length,
    listed: ipos.filter((ipo) => ipo?.status === "listed").length,
    rejected: ipos.filter((ipo) => ipo?.status === "rejected").length,
    totalSubscribed: ipos.reduce(
      (sum, ipo) => sum + (ipo?.totalSubscribed || 0),
      0,
    ),
    totalRaised: ipos.reduce((sum, ipo) => {
      if (["closed", "allotted", "listed"].includes(ipo?.status || "")) {
        return sum + (ipo?.totalSubscribed || 0) * (ipo?.offerPrice || 0);
      }
      return sum;
    }, 0),
    totalApplications: ipos.reduce(
      (sum, ipo) => sum + (ipo?.totalApplications || 0),
      0,
    ),
    averageSubscriptionRatio:
      ipos.length > 0
        ? ipos.reduce((sum, ipo) => sum + (ipo?.subscriptionRatio || 0), 0) /
          ipos.length
        : 0,
    bySector: calculateSectorBreakdown(ipos),
  };

  return stats;
};

/**
 * Calculate sector breakdown from IPO array
 */
const calculateSectorBreakdown = (ipos: AdminIPO[]) => {
  const sectorMap = new Map<string, { count: number; totalValue: number }>();

  ipos.forEach((ipo) => {
    if (ipo?.sector) {
      const current = sectorMap.get(ipo.sector) || { count: 0, totalValue: 0 };
      sectorMap.set(ipo.sector, {
        count: current.count + 1,
        totalValue: current.totalValue + (ipo.issueSize || 0),
      });
    }
  });

  return Array.from(sectorMap.entries()).map(([sector, data]) => ({
    sector,
    count: data.count,
    totalValue: data.totalValue,
  }));
};

/**
 * Get default stats when no data available
 */
const getDefaultStats = (): AdminIPOStats => ({
  totalIPOs: 0,
  pendingApproval: 0,
  announced: 0,
  open: 0,
  closed: 0,
  allotted: 0,
  listed: 0,
  rejected: 0,
  totalSubscribed: 0,
  totalRaised: 0,
  totalApplications: 0,
  averageSubscriptionRatio: 0,
  bySector: [],
});

/**
 * Process API response to extract IPO array
 */
const processAPIResponse = (responseData: any, filters: IPOFilters) => {
  console.log("📡 Processing API Response:", responseData);

  let iposArray: AdminIPO[] = [];
  let total = 0;

  if (Array.isArray(responseData)) {
    // Direct array response
    iposArray = responseData;
    total = iposArray.length;
    console.log(`✅ Direct array response with ${total} items`);
  } else if (responseData?.data && Array.isArray(responseData.data)) {
    // Paginated response with data property
    iposArray = responseData.data;
    total = responseData.pagination?.total || iposArray.length;
    console.log(
      `✅ Paginated response with ${iposArray.length} items, total: ${total}`,
    );
  } else if (responseData && typeof responseData === "object") {
    // Try to extract array from object
    const possibleArrays = Object.values(responseData).filter((val) =>
      Array.isArray(val),
    );
    if (possibleArrays.length > 0) {
      iposArray = possibleArrays[0] as AdminIPO[];
      total = iposArray.length;
      console.log(`✅ Extracted array from object with ${total} items`);
    } else {
      console.warn("⚠️ Could not extract array from response:", responseData);
    }
  }

  return {
    data: iposArray,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total: total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};

// ============= ASYNC THUNKS =============

/**
 * Fetch all IPOs with filters
 */
export const fetchAllIPOs = createAsyncThunk(
  "adminIPO/fetchAll",
  async (filters: IPOFilters, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching all IPOs with filters:", filters);

      const response = await api.get("/api/v1/ipo/admin/all", {
        params: filters,
      });

      console.log("📡 API Response:", response.data);

      return processAPIResponse(response.data, filters);
    } catch (error: any) {
      console.error("❌ Error fetching IPOs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IPOs",
      );
    }
  },
);

/**
 * Fetch pending IPOs
 */
export const fetchPendingIPOs = createAsyncThunk(
  "adminIPO/fetchPending",
  async (filters: IPOFilters, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching pending IPOs with filters:", filters);

      const response = await api.get("/api/v1/ipo/admin/pending", {
        params: filters,
      });

      console.log("📡 Pending API Response:", response.data);

      return processAPIResponse(response.data, filters);
    } catch (error: any) {
      console.error("❌ Error fetching pending IPOs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending IPOs",
      );
    }
  },
);

/**
 * Fetch single IPO details by ID
 */
export const fetchIPODetails = createAsyncThunk(
  "adminIPO/fetchDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching IPO details for ID:", id);

      const response = await api.get(`/api/v1/ipo/admin/${id}`);

      console.log("📡 IPO Details Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching IPO details:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IPO details",
      );
    }
  },
);

/**
 * Approve IPO
 */
export const approveIPO = createAsyncThunk(
  "adminIPO/approve",
  async (data: ApproveIPORequest, { rejectWithValue }) => {
    try {
      console.log("✅ Approving IPO:", data.ipoId);

      const response = await api.put(
        `/api/v1/ipo/admin/${data.ipoId}/approve`,
        {
          notes: data.notes,
          approved: true,
        },
      );

      console.log("📡 Approve Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error approving IPO:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve IPO",
      );
    }
  },
);

/**
 * Reject IPO
 */
export const rejectIPO = createAsyncThunk(
  "adminIPO/reject",
  async (data: RejectIPORequest, { rejectWithValue }) => {
    try {
      console.log("❌ Rejecting IPO:", data.ipoId);

      const response = await api.put(`/api/v1/ipo/admin/${data.ipoId}/reject`, {
        reason: data.reason,
        notes: data.notes,
      });

      console.log("📡 Reject Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error rejecting IPO:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject IPO",
      );
    }
  },
);

/**
 * Open IPO for subscription
 */
export const openIPO = createAsyncThunk(
  "adminIPO/open",
  async (data: OpenIPORequest, { rejectWithValue }) => {
    try {
      console.log("🔓 Opening IPO:", data.ipoId);

      const response = await api.put(`/api/v1/ipo/admin/${data.ipoId}/open`, {
        openDate: data.openDate,
      });

      console.log("📡 Open Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error opening IPO:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to open IPO",
      );
    }
  },
);

/**
 * Close IPO subscription
 */
export const closeIPO = createAsyncThunk(
  "adminIPO/close",
  async (data: CloseIPORequest, { rejectWithValue }) => {
    try {
      console.log("🔒 Closing IPO:", data.ipoId);

      const response = await api.put(`/api/v1/ipo/admin/${data.ipoId}/close`, {
        closeDate: data.closeDate,
      });

      console.log("📡 Close Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error closing IPO:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to close IPO",
      );
    }
  },
);

/**
 * Process IPO allotment
 */
export const processAllotment = createAsyncThunk(
  "adminIPO/allot",
  async (data: AllotmentRequest, { rejectWithValue }) => {
    try {
      console.log("📊 Processing allotment for IPO:", data.ipoId);

      const response = await api.post(`/api/v1/ipo/admin/${data.ipoId}/allot`, {
        method: data.method,
        notes: data.notes,
      });

      console.log("📡 Allotment Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error processing allotment:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to process allotment",
      );
    }
  },
);

/**
 * List IPO as stock
 */
export const listAsStock = createAsyncThunk(
  "adminIPO/list",
  async (data: ListStockRequest, { rejectWithValue }) => {
    try {
      console.log("📈 Listing IPO as stock:", data.ipoId);

      const response = await api.put(`/api/v1/ipo/admin/${data.ipoId}/list`, {
        listingPrice: data.listingPrice,
        exchange: data.exchange,
        listingDate: data.listingDate,
      });

      console.log("📡 List Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error listing IPO:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to list IPO as stock",
      );
    }
  },
);

// ============= SLICE =============

const adminIPOSlice = createSlice({
  name: "adminIPO",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    clearSelectedIPO: (state) => {
      state.selectedIPO = null;
    },
    clearActionStates: (state) => {
      state.actionLoading = false;
      state.actionSuccess = false;
      state.actionError = null;
      state.allotmentResult = null;
    },
    clearError: (state) => {
      state.error = null;
      state.actionError = null;
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH ALL IPOS =====
      .addCase(fetchAllIPOs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIPOs.fulfilled, (state, action) => {
        state.loading = false;
        state.ipos = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: action.payload.data?.length || 0,
          totalPages: Math.ceil((action.payload.data?.length || 0) / 10),
        };

        // Update stats after fetching IPOs
        state.stats = calculateStatsFromIPOs(state.ipos);
        console.log("📊 Stats updated:", state.stats);
      })
      .addCase(fetchAllIPOs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.ipos = [];
        state.stats = getDefaultStats();
      })

      // ===== FETCH PENDING IPOS =====
      .addCase(fetchPendingIPOs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingIPOs.fulfilled, (state, action) => {
        state.loading = false;
        state.ipos = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: action.payload.data?.length || 0,
          totalPages: Math.ceil((action.payload.data?.length || 0) / 10),
        };

        // Update stats after fetching IPOs
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(fetchPendingIPOs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.ipos = [];
        state.stats = getDefaultStats();
      })

      // ===== FETCH IPO DETAILS =====
      .addCase(fetchIPODetails.fulfilled, (state, action) => {
        state.selectedIPO = action.payload;
      })

      // ===== APPROVE IPO =====
      .addCase(approveIPO.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(approveIPO.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // Update IPO in list
        const index = state.ipos.findIndex(
          (ipo) => ipo?._id === action.payload?._id,
        );
        if (index !== -1) state.ipos[index] = action.payload;
        if (state.selectedIPO?._id === action.payload?._id) {
          state.selectedIPO = action.payload;
        }

        // Update stats
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(approveIPO.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })

      // ===== REJECT IPO =====
      .addCase(rejectIPO.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(rejectIPO.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // Update IPO in list
        const index = state.ipos.findIndex(
          (ipo) => ipo?._id === action.payload?._id,
        );
        if (index !== -1) state.ipos[index] = action.payload;
        if (state.selectedIPO?._id === action.payload?._id) {
          state.selectedIPO = action.payload;
        }

        // Update stats
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(rejectIPO.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })

      // ===== OPEN IPO =====
      .addCase(openIPO.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(openIPO.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // Update IPO in list
        const index = state.ipos.findIndex(
          (ipo) => ipo?._id === action.payload?._id,
        );
        if (index !== -1) state.ipos[index] = action.payload;
        if (state.selectedIPO?._id === action.payload?._id) {
          state.selectedIPO = action.payload;
        }

        // Update stats
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(openIPO.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })

      // ===== CLOSE IPO =====
      .addCase(closeIPO.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(closeIPO.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // Update IPO in list
        const index = state.ipos.findIndex(
          (ipo) => ipo?._id === action.payload?._id,
        );
        if (index !== -1) state.ipos[index] = action.payload;
        if (state.selectedIPO?._id === action.payload?._id) {
          state.selectedIPO = action.payload;
        }

        // Update stats
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(closeIPO.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })

      // ===== PROCESS ALLOTMENT =====
      .addCase(processAllotment.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.allotmentResult = null;
      })
      .addCase(processAllotment.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;
        state.allotmentResult = action.payload;

        // Update IPO in list
        const index = state.ipos.findIndex(
          (ipo) => ipo?._id === action.payload?.ipo?._id,
        );
        if (index !== -1) state.ipos[index] = action.payload.ipo;
        if (state.selectedIPO?._id === action.payload?.ipo?._id) {
          state.selectedIPO = action.payload.ipo;
        }

        // Update stats
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(processAllotment.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      })

      // ===== LIST AS STOCK =====
      .addCase(listAsStock.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(listAsStock.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.actionSuccess = true;

        // Update IPO in list
        const index = state.ipos.findIndex(
          (ipo) => ipo?._id === action.payload?._id,
        );
        if (index !== -1) state.ipos[index] = action.payload;
        if (state.selectedIPO?._id === action.payload?._id) {
          state.selectedIPO = action.payload;
        }

        // Update stats
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(listAsStock.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload as string;
      });
  },
});

export const { setFilters, clearSelectedIPO, clearActionStates, clearError } =
  adminIPOSlice.actions;
export default adminIPOSlice.reducer;
