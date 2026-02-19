import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type {
  Investment,
  PortfolioSummary,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
} from "../types/InvestmentTypes";

interface InvestmentState {
  // Loading states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  fetchLoading: boolean;
  portfolioLoading: boolean;

  // Error states
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  fetchError: string | null;
  portfolioError: string | null;

  // Success states
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;

  // Data
  investment: Investment | null;
  investments: Investment[];
  portfolio: Investment[];
  myInvestments: Investment[]; // Where user is investor
  myCreatedInvestments: Investment[]; // Where user is business owner
  portfolioSummary: PortfolioSummary | null;

  // Pagination
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

const initialState: InvestmentState = {
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchLoading: false,
  portfolioLoading: false,

  createError: null,
  updateError: null,
  deleteError: null,
  fetchError: null,
  portfolioError: null,

  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,

  investment: null,
  investments: [],
  portfolio: [],
  myInvestments: [],
  myCreatedInvestments: [],
  portfolioSummary: null,

  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
};

// Helper to get current user ID from localStorage/sessionStorage
const getCurrentUserId = (): string | null => {
  return (
    localStorage.getItem("userId") ||
    sessionStorage.getItem("userId") ||
    localStorage.getItem("user_id") ||
    sessionStorage.getItem("user_id") ||
    null
  );
};

// Helper to check if user is business owner
const isBusinessOwner = (): boolean => {
  const role =
    localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
  return role === "local_business";
};

// ---------- Async Thunks ----------

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

// 2. UPDATE INVESTMENT
export const updateInvestment = createAsyncThunk<
  Investment,
  { id: string; data: UpdateInvestmentRequest },
  { rejectValue: string }
>("investment/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/api/v1/investments/${id}`, data);
    return response.data.investment || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update investment",
    );
  }
});

// 3. DELETE INVESTMENT
export const deleteInvestment = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("investment/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/v1/investments/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete investment",
    );
  }
});

// 4. FETCH SINGLE INVESTMENT
export const fetchInvestmentById = createAsyncThunk<
  Investment,
  string,
  { rejectValue: string }
>("investment/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/v1/investments/${id}`);
    return response.data.investment || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch investment",
    );
  }
});

// 5. FETCH ALL INVESTMENTS (with filters)
export const fetchInvestments = createAsyncThunk<
  { investments: Investment[]; total: number; pages: number },
  {
    page?: number;
    limit?: number;
    sector?: string;
    status?: string;
    search?: string;
  },
  { rejectValue: string }
>("investment/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/investments", { params });
    return {
      investments: response.data.investments || response.data.data || [],
      total: response.data.total || response.data.pagination?.total || 0,
      pages: response.data.pages || response.data.pagination?.pages || 1,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch investments",
    );
  }
});

// 6. FETCH MY PORTFOLIO (Business Owner - based on your API response)
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

// 7. APPROVE INVESTOR INVESTMENT (Business Owner action)
export const approveInvestorInvestment = createAsyncThunk<
  Investment,
  { investmentId: string; investorId: string; status: "approved" | "rejected" },
  { rejectValue: string }
>(
  "investment/approveInvestor",
  async ({ investmentId, investorId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/api/v1/investments/${investmentId}/investors/${investorId}`,
        {
          status,
        },
      );
      return response.data.investment || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update investor status",
      );
    }
  },
);

// 8. FETCH INVESTMENTS BY SECTOR
export const fetchInvestmentsBySector = createAsyncThunk<
  Investment[],
  string,
  { rejectValue: string }
>("investment/fetchBySector", async (sector, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/investments", {
      params: { sector },
    });
    return response.data.investments || response.data.data || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch investments by sector",
    );
  }
});

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    // Clear error states
    clearErrors: (state) => {
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.fetchError = null;
      state.portfolioError = null;
    },

    // Reset success states
    resetSuccess: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },

    // Clear all data
    clearAllData: (state) => {
      state.investment = null;
      state.investments = [];
      state.portfolio = [];
      state.myInvestments = [];
      state.myCreatedInvestments = [];
      state.portfolioSummary = null;
    },

    // Clear investment
    clearInvestment: (state) => {
      state.investment = null;
    },

    // Update investor status locally (optimistic update)
    updateInvestorStatus: (
      state,
      action: PayloadAction<{
        investmentId: string;
        investorEmail: string;
        status: string;
      }>,
    ) => {
      const { investmentId, investorEmail, status } = action.payload;

      // Find investment in portfolio
      const investment =
        state.portfolio.find((inv) => inv._id === investmentId) ||
        state.myCreatedInvestments.find((inv) => inv._id === investmentId);

      if (investment && investment.investorsDetails) {
        const investor = investment.investorsDetails.find(
          (inv) => inv.investorEmail === investorEmail,
        );
        if (investor) {
          investor.status = status as any;
        }
      }

      // Also update in investments array
      const invInList = state.investments.find(
        (inv) => inv._id === investmentId,
      );
      if (invInList && invInList.investorsDetails) {
        const investor = invInList.investorsDetails.find(
          (inv) => inv.investorEmail === investorEmail,
        );
        if (investor) {
          investor.status = status as any;
        }
      }
    },

    // Set current page
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
          state.investment = action.payload;

          // Add to myCreatedInvestments if business owner
          if (isBusinessOwner()) {
            state.myCreatedInvestments = [
              action.payload,
              ...state.myCreatedInvestments,
            ];
          }

          // Add to portfolio
          state.portfolio = [action.payload, ...state.portfolio];
        },
      )
      .addCase(createInvestment.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create investment";
      })

      // ========== UPDATE INVESTMENT ==========
      .addCase(updateInvestment.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(
        updateInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.updateLoading = false;
          state.updateSuccess = true;

          // Update in portfolio
          const index = state.portfolio.findIndex(
            (inv) => inv._id === action.payload._id,
          );
          if (index !== -1) {
            state.portfolio[index] = action.payload;
          }

          // Update in myCreatedInvestments
          const createdIndex = state.myCreatedInvestments.findIndex(
            (inv) => inv._id === action.payload._id,
          );
          if (createdIndex !== -1) {
            state.myCreatedInvestments[createdIndex] = action.payload;
          }

          // Update in investments list
          const listIndex = state.investments.findIndex(
            (inv) => inv._id === action.payload._id,
          );
          if (listIndex !== -1) {
            state.investments[listIndex] = action.payload;
          }

          // Update selected investment
          if (state.investment?._id === action.payload._id) {
            state.investment = action.payload;
          }
        },
      )
      .addCase(updateInvestment.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Failed to update investment";
      })

      // ========== DELETE INVESTMENT ==========
      .addCase(deleteInvestment.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(
        deleteInvestment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteLoading = false;
          state.deleteSuccess = true;

          // Remove from all arrays
          state.portfolio = state.portfolio.filter(
            (inv) => inv._id !== action.payload,
          );
          state.myCreatedInvestments = state.myCreatedInvestments.filter(
            (inv) => inv._id !== action.payload,
          );
          state.investments = state.investments.filter(
            (inv) => inv._id !== action.payload,
          );

          // Clear selected if deleted
          if (state.investment?._id === action.payload) {
            state.investment = null;
          }
        },
      )
      .addCase(deleteInvestment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "Failed to delete investment";
      })

      // ========== FETCH INVESTMENT BY ID ==========
      .addCase(fetchInvestmentById.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(
        fetchInvestmentById.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.fetchLoading = false;
          state.investment = action.payload;
        },
      )
      .addCase(fetchInvestmentById.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload || "Failed to fetch investment";
      })

      // ========== FETCH ALL INVESTMENTS ==========
      .addCase(fetchInvestments.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(
        fetchInvestments.fulfilled,
        (
          state,
          action: PayloadAction<{
            investments: Investment[];
            total: number;
            pages: number;
          }>,
        ) => {
          state.fetchLoading = false;
          state.investments = action.payload.investments;
          state.totalItems = action.payload.total;
          state.totalPages = action.payload.pages;
        },
      )
      .addCase(fetchInvestments.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload || "Failed to fetch investments";
      })

      // ========== FETCH MY PORTFOLIO (Business Owner) ==========
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
          state.portfolio = action.payload.investments;
          state.portfolioSummary = action.payload.summary;

          const userId = getCurrentUserId();

          if (userId) {
            // Separate investments where user is the creator (business owner)
            state.myCreatedInvestments = action.payload.investments.filter(
              (inv) => {
                const ownerId =
                  typeof inv.businessOwnerId === "string"
                    ? inv.businessOwnerId
                    : inv.businessOwnerId?._id;
                return ownerId === userId;
              },
            );

            // Separate investments where user has invested (investor)
            state.myInvestments = action.payload.investments.filter((inv) => {
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

          // Add investorsDetails from investments array if not present
          state.portfolio = state.portfolio.map((inv) => {
            if (!inv.investorsDetails && inv.investments) {
              // Transform investments array to investorsDetails format
              inv.investorsDetails = inv.investments.map((invItem) => ({
                investorName: (invItem.investorId as any)?.name || "Anonymous",
                investorEmail: (invItem.investorId as any)?.email || "",
                amount: invItem.amount,
                investmentDate: invItem.investmentDate,
                status: invItem.status as any,
              }));
            }
            return inv;
          });
        },
      )
      .addCase(fetchMyPortfolio.rejected, (state, action) => {
        state.portfolioLoading = false;
        state.portfolioError = action.payload || "Failed to fetch portfolio";
      })

      // ========== APPROVE INVESTOR INVESTMENT ==========
      .addCase(approveInvestorInvestment.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(
        approveInvestorInvestment.fulfilled,
        (state, action: PayloadAction<Investment>) => {
          state.updateLoading = false;
          state.updateSuccess = true;

          // Update in all relevant arrays
          const updateInvestmentInArray = (array: Investment[]) => {
            const index = array.findIndex(
              (inv) => inv._id === action.payload._id,
            );
            if (index !== -1) {
              array[index] = action.payload;
            }
          };

          updateInvestmentInArray(state.portfolio);
          updateInvestmentInArray(state.myCreatedInvestments);
          updateInvestmentInArray(state.investments);

          if (state.investment?._id === action.payload._id) {
            state.investment = action.payload;
          }
        },
      )
      .addCase(approveInvestorInvestment.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Failed to approve investor";
      })

      // ========== FETCH INVESTMENTS BY SECTOR ==========
      .addCase(fetchInvestmentsBySector.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(
        fetchInvestmentsBySector.fulfilled,
        (state, action: PayloadAction<Investment[]>) => {
          state.fetchLoading = false;
          state.investments = action.payload;
        },
      )
      .addCase(fetchInvestmentsBySector.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError =
          action.payload || "Failed to fetch investments by sector";
      });
  },
});

export const {
  clearErrors,
  resetSuccess,
  clearAllData,
  clearInvestment,
  updateInvestorStatus,
  setCurrentPage,
} = investmentSlice.actions;

export default investmentSlice.reducer;
