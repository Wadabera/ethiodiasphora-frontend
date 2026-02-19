import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// ---------- Types ----------
export interface InvestorInfo {
  userId: string;
  amount: number;
  date: string;
  status?: string;
}

export interface Investment {
  _id: string;
  title: string;
  description: string;
  businessName: string;
  sector: string;
  fundingGoal: number;
  currentFunding: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;
  status: string;
  riskFactors: string;
  useOfFunds: string;
  businessPlan: string;
  isVerified: boolean;
  fundingProgress: number;
  remainingAmount: number;
  businessOwnerId?: {
    _id: string;
    email: string;
  };
  investments?: Array<{
    investorId: string;
    amount: number;
    investmentDate: string;
    status: string;
  }>;
  // Track user-specific investment data
  hasUserInvested?: boolean;
  userInvestmentAmount?: number;
  userInvestmentDate?: string;
  investedBy?: InvestorInfo[];
  isFullyFunded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioInvestment {
  investmentId: string;
  title: string;
  businessName: string;
  businessOwnerName: string;
  businessOwnerEmail: string;
  sector: string;
  location: string;
  myInvestmentAmount: number;
  investmentDate: string;
  expectedReturn: number;
  investmentPeriod: number;
  fundingGoal: number;
  currentFunding: number;
  fundingProgress: string;
  remainingAmount: number;
  totalInvestors: number;
  investmentStatus: string;
  isFullyFunded: boolean;
}

export interface PortfolioSummary {
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
  myPortfolio: PortfolioInvestment[];
  portfolioSummary: PortfolioSummary | null;
  investedIds: Set<string>; // Track which investment IDs user has invested in
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
  investedIds: new Set(),
  loading: false,
  investing: false,
  error: null,
  success: false,
  pagination: { page: 1, limit: 20, total: 0, pages: 1 },
};

// Get current user from localStorage helper
const getCurrentUserId = (): string | null => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user._id || null;
  } catch {
    return null;
  }
};

// Invest in opportunity
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

// Fetch all investments (Public)
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

// Fetch investment by ID (Public)
export const fetchInvestmentById = createAsyncThunk(
  "published/fetchById",
  async (id: string) => {
    console.log(`📡 Fetching investment: ${id}`);
    const response = await api.get(`/api/v1/investments/${id}`);
    console.log("✅ Investment details:", response.data);

    return response.data.investment || response.data.data || response.data;
  },
);

// Fetch user portfolio
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

// Fetch sectors
export const fetchSectors = createAsyncThunk(
  "published/fetchSectors",
  async () => {
    console.log("📡 Fetching sectors");
    const response = await api.get("/api/v1/investments/sectors");
    return response.data.sectors || response.data;
  },
);

// Fetch investment stats
export const fetchInvestmentStats = createAsyncThunk(
  "published/fetchStats",
  async () => {
    console.log("📡 Fetching investment stats");
    const response = await api.get("/api/v1/investments/stats");
    return response.data.stats || response.data;
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
    // Manually mark an investment as invested (useful for testing)
    markAsInvested: (state, action) => {
      const { investmentId, amount } = action.payload;
      const userId = getCurrentUserId();

      if (!userId) return;

      state.investedIds.add(investmentId);

      const investment = state.list.find((inv) => inv._id === investmentId);
      if (investment) {
        investment.hasUserInvested = true;
        investment.userInvestmentAmount = amount;
        investment.userInvestmentDate = new Date().toISOString();

        if (!investment.investedBy) {
          investment.investedBy = [];
        }
        investment.investedBy.push({
          userId,
          amount,
          date: new Date().toISOString(),
        });
      }
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

        // Reset invested flags - will be updated by portfolio fetch
        state.list = state.list.map((inv) => ({
          ...inv,
          hasUserInvested: state.investedIds.has(inv._id),
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
          hasUserInvested: state.investedIds.has(action.payload._id),
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
        const userId = getCurrentUserId();

        if (!userId) return;

        // Add to investedIds Set
        state.investedIds.add(investmentId);

        // Update the investment in the list
        const index = state.list.findIndex((inv) => inv._id === investmentId);
        if (index !== -1) {
          state.list[index].currentFunding += amount;
          state.list[index].fundingProgress =
            (state.list[index].currentFunding / state.list[index].fundingGoal) *
            100;
          state.list[index].remainingAmount =
            state.list[index].fundingGoal - state.list[index].currentFunding;

          // Mark that current user has invested
          state.list[index].hasUserInvested = true;
          state.list[index].userInvestmentAmount = amount;
          state.list[index].userInvestmentDate = new Date().toISOString();

          // Add to investedBy array
          if (!state.list[index].investedBy) {
            state.list[index].investedBy = [];
          }
          state.list[index].investedBy.push({
            userId,
            amount,
            date: new Date().toISOString(),
          });

          // Check if fully funded
          state.list[index].isFullyFunded =
            state.list[index].currentFunding >= state.list[index].fundingGoal;
        }

        // Update selected investment if it's the same
        if (state.selected && state.selected._id === investmentId) {
          state.selected.currentFunding += amount;
          state.selected.fundingProgress =
            (state.selected.currentFunding / state.selected.fundingGoal) * 100;
          state.selected.remainingAmount =
            state.selected.fundingGoal - state.selected.currentFunding;
          state.selected.hasUserInvested = true;
          state.selected.userInvestmentAmount = amount;
          state.selected.userInvestmentDate = new Date().toISOString();

          if (!state.selected.investedBy) {
            state.selected.investedBy = [];
          }
          state.selected.investedBy.push({
            userId,
            amount,
            date: new Date().toISOString(),
          });

          state.selected.isFullyFunded =
            state.selected.currentFunding >= state.selected.fundingGoal;
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

        // Update investedIds Set and mark investments in list
        const investedIds = new Set<string>();
        action.payload.investments.forEach((inv: PortfolioInvestment) => {
          investedIds.add(inv.investmentId);
        });

        state.investedIds = investedIds;

        // Update list with invested flags
        state.list = state.list.map((investment) => ({
          ...investment,
          hasUserInvested: investedIds.has(investment._id),
          userInvestmentAmount: action.payload.investments.find(
            (inv: PortfolioInvestment) => inv.investmentId === investment._id,
          )?.myInvestmentAmount,
        }));

        // Update selected if it exists
        if (state.selected) {
          state.selected.hasUserInvested = investedIds.has(state.selected._id);
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

export const {
  clearSelected,
  clearError,
  resetInvest,
  resetSuccess,
  markAsInvested,
} = publishedInvestmentSlice.actions;

export default publishedInvestmentSlice.reducer;
