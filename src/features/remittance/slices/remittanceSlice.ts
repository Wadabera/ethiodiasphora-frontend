import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import {
  mockRatesResponse,
  mockCompareResponse,
  mockProvidersResponse,
  mockProviderDetailsResponse,
  
} from "../services/mockRemittanceData";
import type {
  RatesResponse,
  CompareResponse,
  ProviderBasic,
  ProviderDetail,
  CalculatorInput,
  RemittanceFilters,
  DisplayProvider,
} from "../types/remittance.types";

// Toggle for mock data - set to false when backend is ready
const USE_MOCK_DATA = true;

interface RemittanceState {
  // Data from endpoints
  ratesData: RatesResponse | null;
  compareData: CompareResponse | null;
  providersList: ProviderBasic[];
  providerDetails: ProviderDetail[] | null;

  // UI State
  loading: boolean;
  error: string | null;

  // Selected data
  selectedProvider: ProviderDetail | null;
  displayProviders: DisplayProvider[];

  // Calculator State
  calculatorInput: CalculatorInput;
  filters: RemittanceFilters;
}

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
};

// ==================== 4 ENDPOINTS ====================

// 1. GET /api/v1/remittance/rates
export const fetchRemittanceRates = createAsyncThunk(
  "remittance/fetchRates",
  async (_, { rejectWithValue }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockRatesResponse;
    }
    try {
      const response = await api.get("/api/v1/remittance/rates");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rates",
      );
    }
  },
);

// 2. GET /api/v1/remittance/compare?from=USD&amount=1000
export const fetchRemittanceCompare = createAsyncThunk(
  "remittance/fetchCompare",
  async (
    { fromCurrency, amount }: { fromCurrency: string; amount: number },
    { rejectWithValue },
  ) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        ...mockCompareResponse,
        fromCurrency,
        sendAmount: amount,
        internationalProviders: mockCompareResponse.internationalProviders.map(
          (p) => ({
            ...p,
            amountReceived:
              p.feeType === "fixed"
                ? (amount - p.fee) * p.exchangeRate
                : (amount - (amount * p.fee) / 100) * p.exchangeRate,
          }),
        ),
        ethiopianBanks: mockCompareResponse.ethiopianBanks.map((p) => ({
          ...p,
          amountReceived: amount * p.exchangeRate,
        })),
      };
    }
    try {
      const response = await api.get("/api/v1/remittance/compare", {
        params: { from: fromCurrency, amount },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comparison",
      );
    }
  },
);

// 3. GET /api/v1/remittance/providers
export const fetchAllProviders = createAsyncThunk(
  "remittance/fetchAllProviders",
  async (_, { rejectWithValue }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockProvidersResponse;
    }
    try {
      const response = await api.get("/api/v1/remittance/providers");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch providers",
      );
    }
  },
);

// 4. GET /api/v1/remittance/providers/:provider
export const fetchProviderByName = createAsyncThunk(
  "remittance/fetchProviderByName",
  async (provider: string, { rejectWithValue }) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProviderDetailsResponse.filter((p) => p.provider === provider);
    }
    try {
      const response = await api.get(
        `/api/v1/remittance/providers/${provider}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch provider",
      );
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

      // Update display providers when amount or currency changes
      if (
        state.compareData &&
        state.calculatorInput.fromCurrency === state.compareData.fromCurrency
      ) {
        state.displayProviders = state.displayProviders.map((p) => ({
          ...p,
          amountReceived:
            p.feeType === "fixed"
              ? (state.calculatorInput.amount - p.fee) * p.exchangeRate
              : (state.calculatorInput.amount -
                  (state.calculatorInput.amount * p.fee) / 100) *
                p.exchangeRate,
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
      // ===== FETCH RATES =====
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
        state.error = (action.payload as string) || "Failed to fetch rates";
      })

      // ===== FETCH COMPARE =====
      .addCase(fetchRemittanceCompare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemittanceCompare.fulfilled, (state, action) => {
        state.loading = false;
        state.compareData = action.payload;

        // Create display providers from compare data
        const allProviders = [
          ...action.payload.internationalProviders.map((p) => ({
            id: p.provider.replace(/\s+/g, "-").toLowerCase(),
            name: p.provider,
            type: "international_provider" as const,
            exchangeRate: p.exchangeRate,
            fee: p.fee,
            feeType: p.feeType,
            amountReceived: p.amountReceived,
            deliveryMethod: p.deliveryMethod,
            deliveryTime: p.deliveryTime,
            rating: 4.5,
            isBest: p.provider === action.payload.bestOption.provider,
          })),
          ...action.payload.ethiopianBanks.map((p) => ({
            id: p.provider.replace(/\s+/g, "-").toLowerCase(),
            name: p.provider,
            type: "ethiopian_bank" as const,
            logo: p.logo,
            exchangeRate: p.exchangeRate,
            fee: p.fee,
            feeType: p.feeType,
            amountReceived: p.amountReceived,
            deliveryMethod: p.deliveryMethod,
            deliveryTime: p.deliveryTime,
            rating: 4.2,
            isBest: p.provider === action.payload.bestOption.provider,
          })),
        ];

        state.displayProviders = allProviders.sort(
          (a, b) => b.amountReceived - a.amountReceived,
        );
      })
      .addCase(fetchRemittanceCompare.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch comparison";
      })

      // ===== FETCH ALL PROVIDERS =====
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
        state.error = (action.payload as string) || "Failed to fetch providers";
      })

      // ===== FETCH PROVIDER BY NAME =====
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
        state.error = (action.payload as string) || "Failed to fetch provider";
      });
  },
});

export const {
  setCalculatorInput,
  setFilters,
  clearFilters,
  selectProvider,
  clearComparison,
  setLoading,
  setError,
  resetState,
} = remittanceSlice.actions;

export default remittanceSlice.reducer;
