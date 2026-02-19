// features/investments/slice/InvestmentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { CreateInvestmentRequest, Investment } from "@/types/index";

interface InvestmentState {
  // Creation state
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;

  // Portfolio fetch state
  portfolioLoading: boolean;
  portfolioError: string | null;

  // Data
  investment: Investment | null;
  portfolio: Investment[];
  myInvestments: Investment[];
  myCreatedInvestments: Investment[];


  
}


const initialState: InvestmentState = {
  createLoading: false,
  createError: null,
  createSuccess: false,
  portfolioLoading: false,
  portfolioError: null,
  investment: null,
  portfolio: [],

  myInvestments: [],
  myCreatedInvestments: [],
};

// CREATE INVESTMENT
export const createInvestment = createAsyncThunk<
  Investment,
  CreateInvestmentRequest,
  { rejectValue: string }
>("investment/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/v1/investments", payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create investment",
    );
  }
});

// FETCH MY PORTFOLIO
export const fetchMyPortfolio = createAsyncThunk<
  Investment[],
  void,
  { rejectValue: string }
>("investment/fetchPortfolio", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/investments/my-portfolio");
    return response.data.investments;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch portfolio",
    );
  }
});

// FETCH MY published project
export const fetchMyPuplishedProject = createAsyncThunk<
  Investment[],
  void,
  { rejectValue: string }
>("investment/fetchPortfolio", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/investments/my-portfolio");
    return response.data.investments;
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
    clearError: (state) => {
      state.createError = null;
      state.portfolioError = null;
    },
    resetSuccess: (state) => {
      state.createSuccess = false;
    },
    clearPortfolio: (state) => {
      state.portfolio = [];
      state.myInvestments = [];
      state.myCreatedInvestments = [];
    },
    clearInvestment: (state) => {
      state.investment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE INVESTMENT
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
          state.investment = action.payload;
        },
      )
      .addCase(
        createInvestment.rejected,
        (state, action: PayloadAction<any>) => {
          state.createLoading = false;
          state.createError = action.payload;
        },
      )

      // FETCH MY PORTFOLIO
      .addCase(fetchMyPortfolio.pending, (state) => {
        state.portfolioLoading = true;
        state.portfolioError = null;
      })
      .addCase(
        fetchMyPortfolio.fulfilled,
        (state, action: PayloadAction<Investment[]>) => {
          state.portfolioLoading = false;
          state.portfolio = action.payload;

          // Get current user ID for filtering
          const userId =
            localStorage.getItem("userId") ||
            sessionStorage.getItem("userId") ||
            localStorage.getItem("user_id") ||
            sessionStorage.getItem("user_id");

          if (userId) {
            // Separate investments where user is the creator
            state.myCreatedInvestments = action.payload.filter((inv) => {
              const ownerId =
                typeof inv.businessOwnerId === "string"
                  ? inv.businessOwnerId
                  : inv.businessOwnerId?._id;
              return ownerId === userId;
            });

            // Separate investments where user has invested
            state.myInvestments = action.payload.filter((inv) => {
              // Check if user has any investment transactions in this investment
              return inv.investments?.some((transaction) => {
                const transactionInvestorId =
                  typeof transaction.investorId === "string"
                    ? transaction.investorId
                    : transaction.investorId?._id;
                return transactionInvestorId === userId;
              });
            });
          }
        },
      )
      .addCase(
        fetchMyPortfolio.rejected,
        (state, action: PayloadAction<any>) => {
          state.portfolioLoading = false;
          state.portfolioError = action.payload;
        },
      );
  },
});

export const { clearError, resetSuccess, clearPortfolio, clearInvestment } =
  investmentSlice.actions;

export default investmentSlice.reducer;
