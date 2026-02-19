// features/ipo/slices/IpoSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";
import type{ IPO, IPOSubscription, IPOCreateDTO } from "../types/ipo.types";

// ============ STATE INTERFACE ============
interface IpoState {
  // Browse IPOs (public)
  ipos: IPO[];
  selectedIpo: IPO | null;

  // My IPOs (business owner)
  myIpos: IPO[];

  // My Subscriptions (investor)
  mySubscriptions: IPOSubscription[];

  // Admin
  pendingIpos: IPO[];
  allIpos: IPO[];

  // UI State
  loading: boolean;
  subscribing: boolean;
  allotting: boolean;
  error: string | null;
  success: boolean;

  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: IpoState = {
  ipos: [],
  selectedIpo: null,
  myIpos: [],
  mySubscriptions: [],
  pendingIpos: [],
  allIpos: [],
  loading: false,
  subscribing: false,
  allotting: false,
  error: null,
  success: false,
  pagination: { page: 1, limit: 20, total: 0, pages: 1 },
};

// ============ ASYNC THUNKS ============

// 1️⃣ BROWSE IPOS - Public (Investor sees available IPOs)
export const browseIpos = createAsyncThunk(
  "ipo/browse",
  async (params: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get("/api/v1/ipo/browse", { params });
    return {
      ipos: response.data.ipos || response.data.data || response.data,
      pagination: response.data.pagination,
    };
  },
);

// 2️⃣ GET IPO DETAILS - Public
export const fetchIpoById = createAsyncThunk(
  "ipo/fetchById",
  async (id: string) => {
    const response = await api.get(`/api/v1/ipo/${id}`);
    return response.data.ipo || response.data.data || response.data;
  },
);

// 3️⃣ CREATE IPO - Business Owner Only
export const createIpo = createAsyncThunk(
  "ipo/create",
  async (ipoData: IPOCreateDTO, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/v1/ipo/create", ipoData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.ipo || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create IPO",
      );
    }
  },
);

// 4️⃣ SUBSCRIBE TO IPO - Investor Only
export const subscribeToIpo = createAsyncThunk(
  "ipo/subscribe",
  async (
    { ipoId, shares }: { ipoId: string; shares: number },
    { rejectWithValue },
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/v1/ipo/${ipoId}/subscribe`,
        { shares },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Subscription failed",
      );
    }
  },
);

// 5️⃣ GET MY IPOS - Business Owner Only
export const fetchMyIpos = createAsyncThunk(
  "ipo/fetchMyIpos",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/ipo/my-ipos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.ipos || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your IPOs",
      );
    }
  },
);

// 6️⃣ GET MY SUBSCRIPTIONS - Investor Only
export const fetchMySubscriptions = createAsyncThunk(
  "ipo/fetchMySubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/ipo/my-subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.subscriptions || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscriptions",
      );
    }
  },
);

// 7️⃣ ADMIN: GET PENDING IPOS
export const fetchPendingIpos = createAsyncThunk(
  "ipo/fetchPending",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/v1/ipo/admin/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.ipos || response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending IPOs",
      );
    }
  },
);

// 8️⃣ ADMIN: APPROVE IPO
export const approveIpo = createAsyncThunk(
  "ipo/approve",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/v1/ipo/admin/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve IPO",
      );
    }
  },
);

// 9️⃣ ADMIN: OPEN IPO FOR SUBSCRIPTION
export const openIpo = createAsyncThunk(
  "ipo/open",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/v1/ipo/admin/${id}/open`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to open IPO",
      );
    }
  },
);

// 🔟 ADMIN: CLOSE IPO
export const closeIpo = createAsyncThunk(
  "ipo/close",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/v1/ipo/admin/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to close IPO",
      );
    }
  },
);

// 1️⃣1️⃣ ADMIN: PROCESS ALLOTMENT (CRITICAL FEATURE)
export const allotIpo = createAsyncThunk(
  "ipo/allot",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/v1/ipo/admin/${id}/allot`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Allotment failed",
      );
    }
  },
);

// 1️⃣2️⃣ ADMIN: LIST IPO AS STOCK
export const listIpoAsStock = createAsyncThunk(
  "ipo/list",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/api/v1/ipo/admin/${id}/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to list IPO as stock",
      );
    }
  },
);

// ============ SLICE ============
const ipoSlice = createSlice({
  name: "ipo",
  initialState,
  reducers: {
    clearSelectedIpo: (state) => {
      state.selectedIpo = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== BROWSE IPOS =====
      .addCase(browseIpos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(browseIpos.fulfilled, (state, action) => {
        state.loading = false;
        state.ipos = action.payload.ipos;
        state.pagination = action.payload.pagination;
      })
      .addCase(browseIpos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== FETCH IPO DETAILS =====
      .addCase(fetchIpoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIpoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIpo = action.payload;
      })
      .addCase(fetchIpoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== CREATE IPO =====
      .addCase(createIpo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIpo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myIpos = [action.payload, ...state.myIpos];
      })
      .addCase(createIpo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ===== SUBSCRIBE TO IPO =====
      .addCase(subscribeToIpo.pending, (state) => {
        state.subscribing = true;
        state.error = null;
      })
      .addCase(subscribeToIpo.fulfilled, (state, action) => {
        state.subscribing = false;
        state.success = true;

        // Update IPO subscription count
        if (state.selectedIpo) {
          state.selectedIpo.subscriptionCount += 1;
          state.selectedIpo.totalSubscribedShares += action.payload.shares;
        }
      })
      .addCase(subscribeToIpo.rejected, (state, action) => {
        state.subscribing = false;
        state.error = action.payload as string;
      })

      // ===== FETCH MY IPOS =====
      .addCase(fetchMyIpos.fulfilled, (state, action) => {
        state.myIpos = action.payload;
      })

      // ===== FETCH MY SUBSCRIPTIONS =====
      .addCase(fetchMySubscriptions.fulfilled, (state, action) => {
        state.mySubscriptions = action.payload;
      })

      // ===== ADMIN: PENDING IPOS =====
      .addCase(fetchPendingIpos.fulfilled, (state, action) => {
        state.pendingIpos = action.payload;
      })

      // ===== ADMIN: APPROVE IPO =====
      .addCase(approveIpo.fulfilled, (state, action) => {
        state.success = true;
        // Remove from pending list
        state.pendingIpos = state.pendingIpos.filter(
          (ipo) => ipo._id !== action.meta.arg,
        );
        // Update in all lists
        const updateIpoStatus = (ipo: IPO) => {
          if (ipo._id === action.meta.arg) ipo.status = "approved";
          return ipo;
        };
        state.ipos = state.ipos.map(updateIpoStatus);
        state.myIpos = state.myIpos.map(updateIpoStatus);
        if (state.selectedIpo?._id === action.meta.arg) {
          state.selectedIpo.status = "approved";
        }
      })

      // ===== ADMIN: OPEN IPO =====
      .addCase(openIpo.fulfilled, (state, action) => {
        state.success = true;
        const updateIpoStatus = (ipo: IPO) => {
          if (ipo._id === action.meta.arg) ipo.status = "open";
          return ipo;
        };
        state.ipos = state.ipos.map(updateIpoStatus);
        state.myIpos = state.myIpos.map(updateIpoStatus);
        if (state.selectedIpo?._id === action.meta.arg) {
          state.selectedIpo.status = "open";
        }
      })

      // ===== ADMIN: CLOSE IPO =====
      .addCase(closeIpo.fulfilled, (state, action) => {
        state.success = true;
        const updateIpoStatus = (ipo: IPO) => {
          if (ipo._id === action.meta.arg) ipo.status = "closed";
          return ipo;
        };
        state.ipos = state.ipos.map(updateIpoStatus);
        state.myIpos = state.myIpos.map(updateIpoStatus);
        if (state.selectedIpo?._id === action.meta.arg) {
          state.selectedIpo.status = "closed";
        }
      })

      // ===== ADMIN: ALLOT IPO (CRITICAL) =====
      .addCase(allotIpo.pending, (state) => {
        state.allotting = true;
      })
      .addCase(allotIpo.fulfilled, (state, action) => {
        state.allotting = false;
        state.success = true;

        // Update IPO status to 'allotted'
        const updateIpoStatus = (ipo: IPO) => {
          if (ipo._id === action.meta.arg) {
            ipo.status = "allotted";
            ipo.allotmentRatio = action.payload.allotmentRatio;
          }
          return ipo;
        };

        state.ipos = state.ipos.map(updateIpoStatus);
        state.myIpos = state.myIpos.map(updateIpoStatus);
        if (state.selectedIpo?._id === action.meta.arg) {
          state.selectedIpo.status = "allotted";
          state.selectedIpo.allotmentRatio = action.payload.allotmentRatio;
        }

        // Update my subscriptions with allotment results
        if (action.payload.subscriptions) {
          state.mySubscriptions = state.mySubscriptions.map((sub) => {
            const updated = action.payload.subscriptions.find(
              (s: any) => s._id === sub._id,
            );
            return updated || sub;
          });
        }
      })
      .addCase(allotIpo.rejected, (state, action) => {
        state.allotting = false;
        state.error = action.payload as string;
      })

      // ===== ADMIN: LIST IPO AS STOCK =====
      .addCase(listIpoAsStock.fulfilled, (state, action) => {
        state.success = true;
        const updateIpoStatus = (ipo: IPO) => {
          if (ipo._id === action.meta.arg) ipo.status = "listed";
          return ipo;
        };
        state.ipos = state.ipos.map(updateIpoStatus);
        state.myIpos = state.myIpos.map(updateIpoStatus);
        if (state.selectedIpo?._id === action.meta.arg) {
          state.selectedIpo.status = "listed";
        }
      });
  },
});

export const { clearSelectedIpo, clearError, resetSuccess } = ipoSlice.actions;
export default ipoSlice.reducer;
