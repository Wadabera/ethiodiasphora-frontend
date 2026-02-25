// src/features/publicInvestment/slices/publicInvestmentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type{
  // PublicInvestment,
  PublicInvestmentState,
  // PublicInvestmentFilters,
} from "../types/publicInvestment.types";

const initialState: PublicInvestmentState = {
  list: [],
  featured: [],
  selectedInvestment: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
  filters: {},
};

// Fetch all public investments
export const fetchPublicInvestments = createAsyncThunk(
  "publicInvestments/fetchAll",
  async (
    params: { page?: number; limit?: number } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get("/api/v1/investments", { params });
      return {
        investments:
          response.data.investments || response.data.data || response.data,
        pagination: response.data.pagination || {
          page: params.page || 1,
          limit: params.limit || 12,
          total: response.data.total || response.data.investments?.length || 0,
          totalPages: response.data.pages || 1,
        },
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch investments",
      );
    }
  },
);

// Fetch investment by ID
export const fetchPublicInvestmentById = createAsyncThunk(
  "publicInvestments/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/investments/${id}`);
      return response.data.investment || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Investment not found",
      );
    }
  },
);

// Fetch featured investments (just get first 3 from list or filter)
export const fetchFeaturedInvestments = createAsyncThunk(
  "publicInvestments/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/investments", {
        params: { limit: 10 }, // Get more to pick featured from
      });
      const investments =
        response.data.investments || response.data.data || response.data;
      // Return all, we'll pick featured in the component or slice
      return investments;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch featured investments",
      );
    }
  },
);

const publicInvestmentSlice = createSlice({
  name: "publicInvestments",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearSelected: (state) => {
      state.selectedInvestment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all investments
      .addCase(fetchPublicInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.investments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPublicInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch featured investments
      .addCase(fetchFeaturedInvestments.fulfilled, (state, action) => {
        // Pick first 3 as featured, or you can add logic to mark some as featured
        state.featured = action.payload.slice(0, 3);
      })

      // Fetch investment by ID
      .addCase(fetchPublicInvestmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicInvestmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvestment = action.payload;
      })
      .addCase(fetchPublicInvestmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedInvestment = null;
      });
  },
});

export const { setFilters, clearFilters, clearSelected, clearError } =
  publicInvestmentSlice.actions;
export default publicInvestmentSlice.reducer;
