// InvestorFeatures/IPOInvesting/slice/investorIPO.slice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  InvestorIPO,
  InvestorSubscription,
  SubscribeRequest,
  SubscriptionSummary,
  BrowseFilters,
} from "../types/investorIPOtypes";

interface InvestorIPOState {
  // Browse IPOs
  ipos: InvestorIPO[];
  selectedIPO: InvestorIPO | null;
  browseLoading: boolean;
  browseError: string | null;
  browsePagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  browseFilters: BrowseFilters;

  // My Subscriptions
  subscriptions: InvestorSubscription[];
  subscriptionSummary: SubscriptionSummary | null;
  subscriptionsLoading: boolean;
  subscriptionsError: string | null;
  subscriptionsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Subscribe action
  subscribing: boolean;
  subscribeSuccess: boolean;
  subscribeError: string | null;
}

const initialState: InvestorIPOState = {
  ipos: [],
  selectedIPO: null,
  browseLoading: false,
  browseError: null,
  browsePagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  browseFilters: {
    page: 1,
    limit: 10,
  },
  subscriptions: [],
  subscriptionSummary: null,
  subscriptionsLoading: false,
  subscriptionsError: null,
  subscriptionsPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  subscribing: false,
  subscribeSuccess: false,
  subscribeError: null,
};

// ============= HELPER FUNCTIONS =============

/**
 * Process API response to extract IPO array
 */
const processBrowseResponse = (responseData: any, filters: BrowseFilters) => {
  console.log("📡 Processing Browse Response:", responseData);

  let iposArray: InvestorIPO[] = [];
  let total = 0;
  let page = filters.page;
  let limit = filters.limit;

  if (Array.isArray(responseData)) {
    // Direct array response
    iposArray = responseData;
    total = iposArray.length;
    console.log(`✅ Direct array response with ${total} items`);
  } else if (responseData?.data && Array.isArray(responseData.data)) {
    // Paginated response with data property
    iposArray = responseData.data;
    total = responseData.pagination?.total || iposArray.length;
    page = responseData.pagination?.page || filters.page;
    limit = responseData.pagination?.limit || filters.limit;
    console.log(
      `✅ Paginated response with ${iposArray.length} items, total: ${total}`,
    );
  } else if (responseData?.ipos && Array.isArray(responseData.ipos)) {
    // Response with ipos property (like from getActiveListings)
    iposArray = responseData.ipos;
    total = iposArray.length;
    console.log(`✅ Response with ipos property with ${total} items`);
  } else if (responseData && typeof responseData === "object") {
    // Try to extract array from object
    const possibleArrays = Object.values(responseData).filter((val) =>
      Array.isArray(val),
    );
    if (possibleArrays.length > 0) {
      iposArray = possibleArrays[0] as InvestorIPO[];
      total = iposArray.length;
      console.log(`✅ Extracted array from object with ${total} items`);
    } else {
      console.warn("⚠️ Could not extract array from response:", responseData);
    }
  }

  return {
    data: iposArray,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Process subscriptions response
 */
const processSubscriptionsResponse = (responseData: any) => {
  console.log("📡 Processing Subscriptions Response:", responseData);

  let subscriptionsArray: InvestorSubscription[] = [];
  let summary: SubscriptionSummary = {
    totalSubscriptions: 0,
    totalInvested: 0,
    pendingSubscriptions: 0,
    allottedSubscriptions: 0,
    totalRefund: 0,
  };
  let page = 1;
  let limit = 10;
  let total = 0;

  if (Array.isArray(responseData)) {
    // Direct array response
    subscriptionsArray = responseData;
    total = subscriptionsArray.length;

    // Calculate summary from array
    summary = {
      totalSubscriptions: subscriptionsArray.length,
      totalInvested: subscriptionsArray.reduce(
        (sum, sub) => sum + (sub.totalAmount || 0),
        0,
      ),
      pendingSubscriptions: subscriptionsArray.filter(
        (s) => s.status === "pending",
      ).length,
      allottedSubscriptions: subscriptionsArray.filter((s) =>
        ["allotted", "partial"].includes(s.status),
      ).length,
      totalRefund: subscriptionsArray.reduce(
        (sum, sub) => sum + (sub.refundAmount || 0),
        0,
      ),
    };
  } else if (responseData?.data && Array.isArray(responseData.data)) {
    // Paginated response
    subscriptionsArray = responseData.data;
    summary = responseData.summary || summary;
    page = responseData.pagination?.page || 1;
    limit = responseData.pagination?.limit || 10;
    total = responseData.pagination?.total || subscriptionsArray.length;
  } else if (
    responseData?.subscriptions &&
    Array.isArray(responseData.subscriptions)
  ) {
    // Response with subscriptions property
    subscriptionsArray = responseData.subscriptions;
    summary = responseData.summary || summary;
    total = subscriptionsArray.length;
  }

  return {
    data: subscriptionsArray,
    summary,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ============= ASYNC THUNKS =============

// Browse IPOs (public endpoint)
export const browseIPOs = createAsyncThunk(
  "investorIPO/browse",
  async (filters: BrowseFilters, { rejectWithValue }) => {
    try {
      console.log("🔍 Browsing IPOs with filters:", filters);

      const response = await api.get("/api/v1/ipo/browse", {
        params: {
          page: filters.page,
          limit: filters.limit,
          status: filters.status,
          sector: filters.sector,
          search: filters.search,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        },
      });

      console.log("📡 Browse API Response:", response.data);

      return processBrowseResponse(response.data, filters);
    } catch (error: any) {
      console.error("❌ Error browsing IPOs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to browse IPOs",
      );
    }
  },
);

// Get IPO details (public)
export const getIPODetails = createAsyncThunk(
  "investorIPO/getDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching IPO details for ID:", id);

      const response = await api.get(`/api/v1/ipo/${id}`);

      console.log("📡 IPO Details Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching IPO details:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get IPO details",
      );
    }
  },
);

// Subscribe to IPO
export const subscribeToIPO = createAsyncThunk(
  "investorIPO/subscribe",
  async (data: SubscribeRequest, { rejectWithValue }) => {
    try {
      console.log(
        "📝 Subscribing to IPO:",
        data.ipoId,
        "Quantity:",
        data.quantity,
      );

      const response = await api.post(`/api/v1/ipo/${data.ipoId}/subscribe`, {
        quantity: data.quantity,
        bidPrice: data.bidPrice,
      });

      console.log("📡 Subscribe Response:", response.data);

      return response.data;
    } catch (error: any) {
      console.error("❌ Error subscribing to IPO:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to subscribe",
      );
    }
  },
);

// Get my subscriptions
export const getMySubscriptions = createAsyncThunk(
  "investorIPO/getMySubscriptions",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      console.log("🔍 Fetching my subscriptions, page:", page, "limit:", limit);

      const response = await api.get("/api/v1/ipo/my-subscriptions", {
        params: { page, limit },
      });

      console.log("📡 Subscriptions Response:", response.data);

      return processSubscriptionsResponse(response.data);
    } catch (error: any) {
      console.error("❌ Error fetching subscriptions:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get subscriptions",
      );
    }
  },
);

// Get active listings (public)
export const getActiveListings = createAsyncThunk(
  "investorIPO/getActiveListings",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching active listings");

      const response = await api.get("/api/v1/ipo/listings/active");

      console.log("📡 Active Listings Response:", response.data);

      return processBrowseResponse(response.data, { page: 1, limit: 100 });
    } catch (error: any) {
      console.error("❌ Error fetching active listings:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get active listings",
      );
    }
  },
);

// Get upcoming IPOs (public)
export const getUpcomingIPOs = createAsyncThunk(
  "investorIPO/getUpcoming",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching upcoming IPOs");

      const response = await api.get("/api/v1/ipo/listings/upcoming/all");

      console.log("📡 Upcoming IPOs Response:", response.data);

      return processBrowseResponse(response.data, { page: 1, limit: 100 });
    } catch (error: any) {
      console.error("❌ Error fetching upcoming IPOs:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to get upcoming IPOs",
      );
    }
  },
);

// ============= SLICE =============

const investorIPOSlice = createSlice({
  name: "investorIPO",
  initialState,
  reducers: {
    setBrowseFilters: (state, action) => {
      state.browseFilters = {
        ...state.browseFilters,
        ...action.payload,
        page: 1,
      };
    },
    clearSelectedIPO: (state) => {
      state.selectedIPO = null;
    },
    clearSubscribeState: (state) => {
      state.subscribing = false;
      state.subscribeSuccess = false;
      state.subscribeError = null;
    },
    clearError: (state) => {
      state.browseError = null;
      state.subscriptionsError = null;
      state.subscribeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== BROWSE IPOS =====
      .addCase(browseIPOs.pending, (state) => {
        state.browseLoading = true;
        state.browseError = null;
      })
      .addCase(browseIPOs.fulfilled, (state, action) => {
        state.browseLoading = false;
        state.ipos = action.payload.data || [];
        state.browsePagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: action.payload.data?.length || 0,
          totalPages: Math.ceil((action.payload.data?.length || 0) / 10),
        };
        console.log("📊 IPOs loaded:", state.ipos.length);
      })
      .addCase(browseIPOs.rejected, (state, action) => {
        state.browseLoading = false;
        state.browseError = action.payload as string;
        state.ipos = [];
      })

      // ===== GET IPO DETAILS =====
      .addCase(getIPODetails.pending, (state) => {
        state.browseLoading = true;
      })
      .addCase(getIPODetails.fulfilled, (state, action) => {
        state.browseLoading = false;
        state.selectedIPO = action.payload;
      })
      .addCase(getIPODetails.rejected, (state) => {
        state.browseLoading = false;
      })

      // ===== SUBSCRIBE TO IPO =====
      .addCase(subscribeToIPO.pending, (state) => {
        state.subscribing = true;
        state.subscribeError = null;
        state.subscribeSuccess = false;
      })
      .addCase(subscribeToIPO.fulfilled, (state, action) => {
        state.subscribing = false;
        state.subscribeSuccess = true;
        // Add subscription to list if it exists
        if (action.payload) {
          state.subscriptions = [action.payload, ...state.subscriptions];
        }
      })
      .addCase(subscribeToIPO.rejected, (state, action) => {
        state.subscribing = false;
        state.subscribeError = action.payload as string;
      })

      // ===== GET MY SUBSCRIPTIONS =====
      .addCase(getMySubscriptions.pending, (state) => {
        state.subscriptionsLoading = true;
        state.subscriptionsError = null;
      })
      .addCase(getMySubscriptions.fulfilled, (state, action) => {
        state.subscriptionsLoading = false;
        state.subscriptions = action.payload.data || [];
        state.subscriptionSummary = action.payload.summary || {
          totalSubscriptions: 0,
          totalInvested: 0,
          pendingSubscriptions: 0,
          allottedSubscriptions: 0,
          totalRefund: 0,
        };
        state.subscriptionsPagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: action.payload.data?.length || 0,
          totalPages: Math.ceil((action.payload.data?.length || 0) / 10),
        };
      })
      .addCase(getMySubscriptions.rejected, (state, action) => {
        state.subscriptionsLoading = false;
        state.subscriptionsError = action.payload as string;
        state.subscriptions = [];
      })

      // ===== GET ACTIVE LISTINGS =====
      .addCase(getActiveListings.pending, (state) => {
        state.browseLoading = true;
        state.browseError = null;
      })
      .addCase(getActiveListings.fulfilled, (state, action) => {
        state.browseLoading = false;
        state.ipos = action.payload.data || [];
        state.browsePagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: action.payload.data?.length || 0,
          totalPages: Math.ceil((action.payload.data?.length || 0) / 10),
        };
      })
      .addCase(getActiveListings.rejected, (state, action) => {
        state.browseLoading = false;
        state.browseError = action.payload as string;
      })

      // ===== GET UPCOMING IPOS =====
      .addCase(getUpcomingIPOs.pending, (state) => {
        state.browseLoading = true;
        state.browseError = null;
      })
      .addCase(getUpcomingIPOs.fulfilled, (state, action) => {
        state.browseLoading = false;
        state.ipos = action.payload.data || [];
        state.browsePagination = action.payload.pagination || {
          page: 1,
          limit: 10,
          total: action.payload.data?.length || 0,
          totalPages: Math.ceil((action.payload.data?.length || 0) / 10),
        };
      })
      .addCase(getUpcomingIPOs.rejected, (state, action) => {
        state.browseLoading = false;
        state.browseError = action.payload as string;
      });
  },
});

export const {
  setBrowseFilters,
  clearSelectedIPO,
  clearSubscribeState,
  clearError,
} = investorIPOSlice.actions;
export default investorIPOSlice.reducer;
