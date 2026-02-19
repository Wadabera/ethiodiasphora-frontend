import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

import type { Investment, PortfolioInvestment } from "../types/InvestmentTypes";
interface PortfolioSummary {
  totalInvested: number;
  activeInvestments: number;
  totalInvestments: number;
  averageReturn: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PublishedState {
  list: Investment[];
  selected: Investment | null;
  myPortfolio: PortfolioInvestment[]; // For portfolio
  portfolioSummary: PortfolioSummary | null;
  investedIds: string[]; // Track which investments user has invested in
  loading: boolean;
  investing: boolean;
  error: string | null;
  success: boolean;
  pagination: Pagination;
}

const initialState: PublishedState = {
  list: [],
  selected: null,
  myPortfolio: [],
  portfolioSummary: null,
  investedIds: [],
  loading: false,
  investing: false,
  error: null,
  success: false,
  pagination: { page: 1, limit: 20, total: 0, pages: 1 },
};

// Helper to get current user
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// 1️⃣ POST /api/v1/investments/:id/invest - Make investment
export const investInOpportunity = createAsyncThunk(
  "published/invest",
  async ({
    id,
    amount,
    paymentMethod = "bank_transfer",
    notes,
  }: {
    id: string;
    amount: number;
    paymentMethod?: string;
    notes?: string;
  }) => {
    const token = localStorage.getItem("token");
    console.log(`📡 Investing ${amount} in ${id} via ${paymentMethod}`);

    const payload: any = {
      amount,
      paymentMethod,
    };

    if (notes) {
      payload.notes = notes;
    }

    const response = await api.post(
      `/api/v1/investments/${id}/invest`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("✅ Investment response:", response.data);
    return response.data;
  },
);

// 2️⃣ GET /api/v1/investments - Browse opportunities (Public)
export const fetchInvestments = createAsyncThunk(
  "published/fetchAll",
  async (
    params: {
      page?: number;
      limit?: number;
      sector?: string;
      search?: string;
      minAmount?: number;
      maxAmount?: number;
    } = {},
  ) => {
    console.log("📡 Fetching investments with params:", params);
    const response = await api.get("/api/v1/investments", { params });
    console.log("✅ Investments response:", response.data);

    return {
      investments:
        response.data.investments || response.data.data || response.data,
      pagination: response.data.pagination || {
        page: params.page || 1,
        limit: params.limit || 20,
        total: response.data.total || response.data.length || 0,
        pages: response.data.pages || 1,
      },
    };
  },
);

// 3️⃣ GET /api/v1/investments/:id - Get opportunity details (Public)
export const fetchInvestmentById = createAsyncThunk(
  "published/fetchById",
  async (id: string) => {
    console.log(`📡 Fetching investment: ${id}`);
    const response = await api.get(`/api/v1/investments/${id}`);
    console.log("✅ Investment details:", response.data);

    return response.data.investment || response.data.data || response.data;
  },
);

// 4️⃣ GET /api/v1/investments/my-portfolio - Get user investments
export const fetchMyPortfolio = createAsyncThunk(
  "published/fetchMyPortfolio",
  async () => {
    console.log("📡 Fetching my portfolio");
    const response = await api.get("/api/v1/investments/my-portfolio");
    console.log("✅ Portfolio response:", response.data);

    return {
      investments: response.data.investments || [],
      summary: response.data.summary || {
        totalInvested: 0,
        activeInvestments: 0,
        totalInvestments: 0,
        averageReturn: 0,
      },
    };
  },
);

// ---------- Slice ----------
const publishedInvestmentSlice = createSlice({
  name: "published",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetInvest: (state) => {
      state.investing = false;
      state.success = false;
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Investments
      .addCase(fetchInvestments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.investments;
        state.pagination = action.payload.pagination;

        // Mark which investments user has invested in
        state.list = state.list.map((inv) => ({
          ...inv,
          hasUserInvested: state.investedIds.includes(inv._id),
          userInvestmentAmount: state.myPortfolio.find(
            (p) => p.investmentId === inv._id,
          )?.myInvestmentAmount,
        }));

        state.error = null;
      })
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch investments";
      })

      // Fetch Investment By ID
      .addCase(fetchInvestmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvestmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = {
          ...action.payload,
          hasUserInvested: state.investedIds.includes(action.payload._id),
          userInvestmentAmount: state.myPortfolio.find(
            (p) => p.investmentId === action.payload._id,
          )?.myInvestmentAmount,
        };
        state.error = null;
      })
      .addCase(fetchInvestmentById.rejected, (state, action) => {
        state.loading = false;
        state.selected = null;
        state.error = action.error.message || "Investment not found";
      })

      // Invest
      .addCase(investInOpportunity.pending, (state) => {
        state.investing = true;
        state.error = null;
        state.success = false;
      })
      .addCase(investInOpportunity.fulfilled, (state, action) => {
        state.investing = false;
        state.success = true;
        state.error = null;

        const { investmentId, amount } = action.payload;

        // Add to investedIds if not already there
        if (!state.investedIds.includes(investmentId)) {
          state.investedIds.push(investmentId);
        }

        // Update the investment in the list
        const index = state.list.findIndex((inv) => inv._id === investmentId);
        if (index !== -1) {
          state.list[index].currentFunding += amount;
          state.list[index].fundingProgress =
            (state.list[index].currentFunding / state.list[index].fundingGoal) *
            100;
          state.list[index].remainingAmount =
            state.list[index].fundingGoal - state.list[index].currentFunding;
          state.list[index].hasUserInvested = true;
          state.list[index].userInvestmentAmount = amount;
          state.list[index].userInvestmentDate = new Date().toISOString();
        }

        // Update the selected investment
        if (state.selected && state.selected._id === investmentId) {
          state.selected.currentFunding += amount;
          state.selected.fundingProgress =
            (state.selected.currentFunding / state.selected.fundingGoal) * 100;
          state.selected.remainingAmount =
            state.selected.fundingGoal - state.selected.currentFunding;
          state.selected.hasUserInvested = true;
          state.selected.userInvestmentAmount = amount;
          state.selected.userInvestmentDate = new Date().toISOString();
        }
      })
      .addCase(investInOpportunity.rejected, (state, action) => {
        state.investing = false;
        state.success = false;
        state.error = action.error.message || "Investment failed";
      })

      // My Portfolio
      .addCase(fetchMyPortfolio.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.myPortfolio = action.payload.investments;
        state.portfolioSummary = action.payload.summary;

        // Update investedIds
        state.investedIds = action.payload.investments.map(
          (inv: PortfolioInvestment) => inv.investmentId,
        );

        // Update list with invested flags
        state.list = state.list.map((investment) => ({
          ...investment,
          hasUserInvested: state.investedIds.includes(investment._id),
          userInvestmentAmount: action.payload.investments.find(
            (inv: PortfolioInvestment) => inv.investmentId === investment._id,
          )?.myInvestmentAmount,
        }));

        // Update selected if it exists
        if (state.selected) {
          state.selected.hasUserInvested = state.investedIds.includes(
            state.selected._id,
          );
          state.selected.userInvestmentAmount = action.payload.investments.find(
            (inv: PortfolioInvestment) =>
              inv.investmentId === state.selected?._id,
          )?.myInvestmentAmount;
        }

        state.error = null;
      })
      .addCase(fetchMyPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.myPortfolio = [];
        state.portfolioSummary = null;
        state.error = action.error.message || "Failed to fetch portfolio";
      });
  },
});

export const { clearSelected, clearError, resetInvest, resetSuccess } =
  publishedInvestmentSlice.actions;
export default publishedInvestmentSlice.reducer;
