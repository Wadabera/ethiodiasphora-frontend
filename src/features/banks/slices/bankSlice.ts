// features/banks/slices/bankSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type{ Bank, ExchangeRatesResponse } from "../types/bank.types";
import bankService from "../services/bankService";

interface BankState {
  banks: Bank[];
  filteredBanks: Bank[];
  rates: ExchangeRatesResponse | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCurrency: string;
  lastUpdated: string | null;
}

const initialState: BankState = {
  banks: [],
  filteredBanks: [],
  rates: null,
  loading: false,
  error: null,
  searchQuery: "",
  selectedCurrency: "USD",
  lastUpdated: null,
};

// Async Thunks
export const fetchAllBanks = createAsyncThunk(
  "banks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bankService.getAllBanks();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchExchangeRates = createAsyncThunk(
  "banks/fetchRates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bankService.getExchangeRates();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const searchBanks = createAsyncThunk(
  "banks/search",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await bankService.searchBanks({ query });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const bankSlice = createSlice({
  name: "banks",
  initialState,
  reducers: {
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = "";
      state.filteredBanks = state.banks;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Banks
      .addCase(fetchAllBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload;
        state.filteredBanks = action.payload;
      })
      .addCase(fetchAllBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Exchange Rates
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search Banks
      .addCase(searchBanks.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredBanks = action.payload;
        state.searchQuery = action.meta.arg;
      })
      .addCase(searchBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCurrency, clearSearch, clearError } =
  bankSlice.actions;
export default bankSlice.reducer;
