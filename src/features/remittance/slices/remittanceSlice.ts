// src/features/remittance/slices/remittanceSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { remittanceService } from "../services/remittanceService";
import type {
  // RatesResponse,
  // CompareResponse,
  // ProviderBasic,
  ProviderDetail,
  CalculatorInput,
  RemittanceFilters,
  DisplayProvider,
  RemittanceState,
} from "../types/remittance.types";

const initialState: RemittanceState = {
  ratesData: null,
  compareData: null,
  providersList: [],
  providerDetails: null,
  loading: false,
  error: null,
  selectedProvider: null,
  displayProviders: [],
  calculatorInput: {
    fromCurrency: "USD",
    toCurrency: "ETB",
    amount: 1000,
    deliveryMethod: "bank_transfer",
  },
  filters: {
    type: "all",
  },
  viewMode: "card",
};

// Async Thunks
export const fetchRemittanceRates = createAsyncThunk(
  "remittance/fetchRates",
  async (_, { rejectWithValue }) => {
    try {
      return await remittanceService.fetchRates();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch rates");
    }
  },
);

export const fetchRemittanceCompare = createAsyncThunk(
  "remittance/fetchCompare",
  async (
    { fromCurrency, amount }: { fromCurrency: string; amount: number },
    { rejectWithValue },
  ) => {
    try {
      return await remittanceService.fetchCompare(fromCurrency, amount);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch comparison");
    }
  },
);

export const fetchAllProviders = createAsyncThunk(
  "remittance/fetchAllProviders",
  async (_, { rejectWithValue }) => {
    try {
      return await remittanceService.fetchAllProviders();
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch providers");
    }
  },
);

export const fetchProviderByName = createAsyncThunk(
  "remittance/fetchProviderByName",
  async (provider: string, { rejectWithValue }) => {
    try {
      return await remittanceService.fetchProviderByName(provider);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch provider");
    }
  },
);

const remittanceSlice = createSlice({
  name: "remittance",
  initialState,
  reducers: {
    setCalculatorInput: (
      state,
      action: PayloadAction<Partial<CalculatorInput>>,
    ) => {
      state.calculatorInput = { ...state.calculatorInput, ...action.payload };

      // Update display providers when amount changes
      if (
        state.compareData &&
        state.calculatorInput.fromCurrency === state.compareData.fromCurrency
      ) {
        state.displayProviders = state.displayProviders.map((p) => ({
          ...p,
          amountReceived: calculateAmountReceived(
            p,
            state.calculatorInput.amount,
          ),
        }));
      }
    },

    setFilters: (state, action: PayloadAction<Partial<RemittanceFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = { type: "all" };
    },

    selectProvider: (state, action: PayloadAction<ProviderDetail | null>) => {
      state.selectedProvider = action.payload;
    },

    clearComparison: (state) => {
      state.compareData = null;
      state.displayProviders = [];
    },

    setViewMode: (state, action: PayloadAction<"card" | "table">) => {
      state.viewMode = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rates
      .addCase(fetchRemittanceRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemittanceRates.fulfilled, (state, action) => {
        state.loading = false;
        state.ratesData = action.payload;
      })
      .addCase(fetchRemittanceRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Compare
      .addCase(fetchRemittanceCompare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemittanceCompare.fulfilled, (state, action) => {
        state.loading = false;
        state.compareData = action.payload;

        // Create display providers
        const allProviders = [
          ...action.payload.internationalProviders.map((p) =>
            createDisplayProvider(p, action.payload.bestOption.provider),
          ),
          ...action.payload.ethiopianBanks.map((p) =>
            createDisplayProvider(p, action.payload.bestOption.provider, true),
          ),
        ];

        state.displayProviders = allProviders.sort(
          (a, b) => b.amountReceived - a.amountReceived,
        );
      })
      .addCase(fetchRemittanceCompare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch All Providers
      .addCase(fetchAllProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providersList = action.payload;
      })
      .addCase(fetchAllProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Provider By Name
      .addCase(fetchProviderByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderByName.fulfilled, (state, action) => {
        state.loading = false;
        state.providerDetails = action.payload;
      })
      .addCase(fetchProviderByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Helper functions
const calculateAmountReceived = (
  provider: DisplayProvider,
  amount: number,
): number => {
  if (provider.feeType === "fixed") {
    return (amount - provider.fee) * provider.exchangeRate;
  } else if (provider.feeType === "percentage") {
    return (amount - (amount * provider.fee) / 100) * provider.exchangeRate;
  }
  return amount * provider.exchangeRate;
};

const createDisplayProvider = (
  p: any,
  bestProviderName: string,
  isBank: boolean = false,
): DisplayProvider => ({
  id: p.provider.replace(/\s+/g, "-").toLowerCase(),
  name: p.provider,
  type: isBank ? "ethiopian_bank" : "international_provider",
  logo: p.logo,
  exchangeRate: p.exchangeRate,
  fee: p.fee,
  feeType: p.feeType,
  amountReceived: p.amountReceived,
  deliveryMethod: p.deliveryMethod,
  deliveryTime: p.deliveryTime,
  rating: isBank ? 4.2 : 4.5,
  isBest: p.provider === bestProviderName,
  cashBuying: p.cashBuying,
  cashSelling: p.cashSelling,
  transactionBuying: p.transactionBuying,
  transactionSelling: p.transactionSelling,
});

export const {
  setCalculatorInput,
  setFilters,
  clearFilters,
  selectProvider,
  clearComparison,
  setViewMode,
  setLoading,
  setError,
  resetState,
} = remittanceSlice.actions;

export default remittanceSlice.reducer;
