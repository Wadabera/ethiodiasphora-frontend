// BusinessOwnerFeatures/MyInvestment/slice/InvestmentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  Investment,
  PortfolioSummary,
  CreateInvestmentRequest,
} from "../types/InvestmentTypes";

interface InvestmentState {
  // Loading states
  createLoading: boolean;
  portfolioLoading: boolean;

  // Error states
  createError: string | null;
  portfolioError: string | null;

  // Success states
  createSuccess: boolean;

  // Data
  myCreatedInvestments: Investment[]; // Where user is business owner
  portfolioSummary: PortfolioSummary | null;

  // Pagination
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

const initialState: InvestmentState = {
  createLoading: false,
  portfolioLoading: false,

  createError: null,
  portfolioError: null,

  createSuccess: false,

  myCreatedInvestments: [],
  portfolioSummary: null,

  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
};

// ---------- ONLY 2 ASYNC THUNKS ----------

// 1. CREATE INVESTMENT
export const createInvestment = createAsyncThunk<
  Investment,
  CreateInvestmentRequest,
  { rejectValue: string }
>("investment/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/v1/investments", payload);
    return response.data.investment || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create investment",
    );
  }
});

// 2. FETCH MY PORTFOLIO (Created Investments)
export const fetchMyPortfolio = createAsyncThunk<
  { investments: Investment[]; summary: PortfolioSummary },
  void,
  { rejectValue: string }
>("investment/fetchPortfolio", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/investments/my-portfolio");
    console.log("📡 Portfolio response:", response.data);

    return {
      investments: response.data.investments || [],
      summary: response.data.summary || {
        totalOpportunities: 0,
        draftOpportunities: 0,
        approvedOpportunities: 0,
        fundedOpportunities: 0,
        totalFundingGoal: 0,
        totalRaised: 0,
        totalInvestors: 0,
        averageFundingProgress: "0",
      },
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch portfolio",
    );
  }
});

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.createError = null;
      state.portfolioError = null;
    },
    resetSuccess: (state) => {
      state.createSuccess = false;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== CREATE INVESTMENT ==========
      .addCase(createInvestment.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(
        createInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.createLoading = false;
          state.createSuccess = true;

          // Add to myCreatedInvestments
          state.myCreatedInvestments = [
            action.payload,
            ...state.myCreatedInvestments,
          ];

          // Update portfolio summary
          if (state.portfolioSummary) {
            state.portfolioSummary.totalOpportunities += 1;
            state.portfolioSummary.totalFundingGoal +=
              action.payload.fundingGoal;
          }
        },
      )
      .addCase(createInvestment.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create investment";
      })

      // ========== FETCH MY PORTFOLIO ==========
      .addCase(fetchMyPortfolio.pending, (state) => {
        state.portfolioLoading = true;
        state.portfolioError = null;
      })
      .addCase(
        fetchMyPortfolio.fulfilled,
        (
          state,
          action: PayloadAction<{
            investments: Investment[];
            summary: PortfolioSummary;
          }>,
        ) => {
          state.portfolioLoading = false;
          state.myCreatedInvestments = action.payload.investments;
          state.portfolioSummary = action.payload.summary;
          state.totalItems = action.payload.investments.length;
        },
      )
      .addCase(fetchMyPortfolio.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = action.payload || "Failed to fetch portfolio";
      });
  },
});

export const { clearErrors, resetSuccess, setCurrentPage } =
  investmentSlice.actions;

export default investmentSlice.reducer;
