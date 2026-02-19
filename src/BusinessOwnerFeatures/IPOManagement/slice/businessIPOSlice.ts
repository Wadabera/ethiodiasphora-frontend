// src/features/business/IPOManagement/slice/businessIPOSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  IPO,
  CreateIPORequest,
  IPOFilters,
  BusinessIPOStats,
  status 
} from "../types/businessIPOtypes";

interface BusinessIPOState {
  // My IPOs list
  ipos: IPO[];
  selectedIPO: IPO | null;
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

  // Stats - calculated from IPOs
  stats: BusinessIPOStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Creation
  createLoading: boolean;
  createSuccess: boolean;
  createError: string | null;
}

const initialState: BusinessIPOState = {
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
    IPOstatus: "",
    search: "",
  },
  stats: null,
  statsLoading: false,
  statsError: null,
  createLoading: false,
  createSuccess: false,
  createError: null,
};

// Helper function to calculate stats from IPOs array
const calculateStatsFromIPOs = (ipos: IPO[]): BusinessIPOStats => {
  const stats: BusinessIPOStats = {
    totalIPOs: ipos.length,
    pendingApproval: ipos.filter((ipo) => ipo.status === "pending_approval")
      .length,
    announced: ipos.filter((ipo) => ipo.status === "announced").length,
    open: ipos.filter((ipo) => ipo.status === "open").length,
    closed: ipos.filter((ipo) => ipo.status === "closed").length,
    allotted: ipos.filter((ipo) => ipo.status === "allotted").length,
    listed: ipos.filter((ipo) => ipo.status === "listed").length,
    rejected: ipos.filter((ipo) => ipo.status === "rejected").length,
    totalSubscribed: ipos.reduce(
      (sum, ipo) => sum + (ipo.totalSubscribed || 0),
      0,
    ),
    totalRaised: ipos.reduce((sum, ipo) => {
      // Only count raised for closed, allotted, or listed IPOs
      if (["closed", "allotted", "listed"].includes(ipo.status)) {
        return sum + (ipo.totalSubscribed || 0) * (ipo.offerPrice || 0);
      }
      return sum;
    }, 0),
  };

  return stats;
};

// Create IPO
export const createIPO = createAsyncThunk(
  "businessIPO/create",
  async (ipoData: CreateIPORequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/ipo/create", ipoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create IPO",
      );
    }
  },
);

// Get My IPOs - with proper filter handling
export const fetchMyIPOs = createAsyncThunk(
  "businessIPO/fetchMyIPOs",
  async (filters: IPOFilters, { rejectWithValue }) => {
    try {
      console.log("Fetching IPOs with filters:", filters);

      // Build query params
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };

      // Only add status if it exists and is not empty
      if (filters.status && filters.status.trim() !== "") {
        params.status = filters.status;
      }

      // Add search if exists
      if (filters.search && filters.search.trim() !== "") {
        params.search = filters.search;
      }

      console.log("API Request params:", params);

      const response = await api.get("/api/v1/ipo/my-ipos", { params });

      console.log("API Response:", response.data);

      // Handle both array and object responses
      let data = [];
      let total = 0;

      if (Array.isArray(response.data)) {
        // Direct array response
        data = response.data;
        total = data.length;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Paginated response with data property
        data = response.data.data;
        total = response.data.pagination?.total || data.length;
      } else {
        // Unknown format, try to extract array
        data = response.data || [];
        total = data.length;
      }

      return {
        data,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total,
          totalPages: Math.ceil(total / filters.limit),
        },
      };
    } catch (error: any) {
      console.error("Error fetching IPOs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IPOs",
      );
    }
  },
);

// Get Single IPO
export const fetchIPOById = createAsyncThunk(
  "businessIPO/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/ipo/my-ipos/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch IPO",
      );
    }
  },
);

// Get IPO Statistics - calculated from all IPOs
export const fetchBusinessIPOStats = createAsyncThunk(
  "businessIPO/fetchStats",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // First, fetch all IPOs to calculate stats
      // We'll fetch a large limit to get all IPOs for accurate stats
      const response = await api.get("/api/v1/ipo/my-ipos", {
        params: {
          page: 1,
          limit: 1000, // Large limit to get all IPOs
        },
      });

      console.log("Fetching all IPOs for stats calculation");

      // Extract IPO data
      let ipos = [];
      if (Array.isArray(response.data)) {
        ipos = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ipos = response.data.data;
      } else {
        ipos = response.data || [];
      }

      // Calculate stats from IPOs
      const stats = calculateStatsFromIPOs(ipos);
      console.log("Calculated stats:", stats);

      return stats;
    } catch (error: any) {
      console.error("Error fetching IPOs for stats:", error);

      // If we can't fetch all IPOs, try to use existing state
      // This will be handled in the reducer with a fallback
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats",
      );
    }
  },
);

const businessIPOSlice = createSlice({
  name: "businessIPO",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      // Merge new filters with existing ones, always reset to page 1
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: 1, // Reset to first page when filter changes
      };

      console.log("Filters updated in slice:", state.filters);
    },
    clearSelectedIPO: (state) => {
      state.selectedIPO = null;
    },
    clearCreateState: (state) => {
      state.createLoading = false;
      state.createSuccess = false;
      state.createError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.statsError = null;
      state.createError = null;
    },
    // Manual stats calculation from current IPOs
    calculateStatsFromCurrentIPOs: (state) => {
      if (state.ipos.length > 0) {
        state.stats = calculateStatsFromIPOs(state.ipos);
        state.statsLoading = false;
        state.statsError = null;
      }
    },
    // Reset filters to default
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        status: "",
        search: "",
      };
    },
    // Clear specific filter
    clearFilter: (state, action) => {
      const filterKey = action.payload;
      if (filterKey === "status") {
        state.filters.status = "";
      } else if (filterKey === "search") {
        state.filters.search = "";
      }
      state.filters.page = 1; // Reset to first page
    },
  },
  extraReducers: (builder) => {
    builder
      // Create IPO
      .addCase(createIPO.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createIPO.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.ipos = [action.payload, ...state.ipos];
        // Recalculate stats after adding new IPO
        state.stats = calculateStatsFromIPOs(state.ipos);
      })
      .addCase(createIPO.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })

      // Fetch My IPOs
      .addCase(fetchMyIPOs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyIPOs.fulfilled, (state, action) => {
        state.loading = false;
        state.ipos = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          page: state.filters.page,
          limit: state.filters.limit,
          total: 0,
          totalPages: 0,
        };

        console.log(
          `Fetched ${state.ipos.length} IPOs with status filter:`,
          state.filters.status,
        );
      })
      .addCase(fetchMyIPOs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.ipos = [];
      })

      // Fetch Single IPO
      .addCase(fetchIPOById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIPOById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIPO = action.payload;
      })
      .addCase(fetchIPOById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Stats
      .addCase(fetchBusinessIPOStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchBusinessIPOStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        state.statsError = null;
      })
      .addCase(fetchBusinessIPOStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;

        // Fallback: Calculate stats from existing IPOs if available
        if (state.ipos.length > 0) {
          console.log("Falling back to stats calculation from current IPOs");
          state.stats = calculateStatsFromIPOs(state.ipos);
          state.statsError = null; // Clear error since we have fallback data
        } else {
          state.stats = null;
        }
      });
  },
});

export const {
  setFilters,
  clearSelectedIPO,
  clearCreateState,
  clearError,
  calculateStatsFromCurrentIPOs,
  resetFilters,
  clearFilter,
} = businessIPOSlice.actions;

export default businessIPOSlice.reducer;
