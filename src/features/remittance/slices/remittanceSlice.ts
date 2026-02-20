// features/remittance/slices/remittanceSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type{
  RemittanceProvider,
  Currency,
  RemittanceCalculation,
} from "../types/remittance.types";
import {
  mockProviders,
  calculateReceiveAmount,
  mockRates,
} from "../services/mockRemittanceData";

interface RemittanceState {
  providers: RemittanceProvider[];
  filteredProviders: RemittanceProvider[];
  loading: boolean;
  error: string | null;
  selectedCurrency: Currency;
  selectedProvider: RemittanceProvider | null;
  sendAmount: number;
  calculation: RemittanceCalculation | null;
  lastUpdated: string | null;
  rates: typeof mockRates;
}

const initialState: RemittanceState = {
  providers: mockProviders,
  filteredProviders: mockProviders.filter((p) => p.fromCurrency === "USD"),
  loading: false,
  error: null,
  selectedCurrency: "USD",
  selectedProvider: null,
  sendAmount: 1000,
  calculation: null,
  lastUpdated: mockRates.lastUpdated,
  rates: mockRates,
};

const remittanceSlice = createSlice({
  name: "remittance",
  initialState,
  reducers: {
    // Set selected currency
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;

      // Filter providers by currency
      state.filteredProviders = state.providers.filter(
        (p) => p.fromCurrency === action.payload,
      );

      // Clear selected provider when currency changes
      state.selectedProvider = null;
      state.calculation = null;
    },

    // Set send amount
    setSendAmount: (state, action) => {
      state.sendAmount = action.payload;

      // Recalculate if provider selected
      if (state.selectedProvider) {
        const { receiveAmount, fee } = calculateReceiveAmount(
          action.payload,
          state.selectedProvider.exchangeRate,
          state.selectedProvider.fee,
          state.selectedProvider.feeType,
        );
        state.calculation = {
          sendAmount: action.payload,
          receiveAmount,
          fee,
          exchangeRate: state.selectedProvider.exchangeRate,
          provider: state.selectedProvider.provider,
          deliveryMethod: state.selectedProvider.deliveryMethod,
          deliveryTime: state.selectedProvider.deliveryTime,
        };
      }
    },

    // Set selected provider
    setSelectedProvider: (state, action) => {
      state.selectedProvider = action.payload;

      // Calculate amount
      if (action.payload && state.sendAmount > 0) {
        const { receiveAmount, fee } = calculateReceiveAmount(
          state.sendAmount,
          action.payload.exchangeRate,
          action.payload.fee,
          action.payload.feeType,
        );
        state.calculation = {
          sendAmount: state.sendAmount,
          receiveAmount,
          fee,
          exchangeRate: action.payload.exchangeRate,
          provider: action.payload.provider,
          deliveryMethod: action.payload.deliveryMethod,
          deliveryTime: action.payload.deliveryTime,
        };
      }
    },

    // Reset selection
    resetSelection: (state) => {
      state.selectedProvider = null;
      state.calculation = null;
      state.sendAmount = 1000;
    },

    // Filter by delivery method
    filterByDeliveryMethod: (state, action) => {
      if (action.payload === "all") {
        state.filteredProviders = state.providers.filter(
          (p) => p.fromCurrency === state.selectedCurrency,
        );
      } else {
        state.filteredProviders = state.providers.filter(
          (p) =>
            p.fromCurrency === state.selectedCurrency &&
            p.deliveryMethod === action.payload,
        );
      }
    },

    // Refresh mock data (simulates API update)
    refreshMockData: (state) => {
      // Randomly adjust rates slightly to simulate real-time updates
      state.providers = state.providers.map((provider) => ({
        ...provider,
        exchangeRate: provider.exchangeRate + (Math.random() * 0.1 - 0.05),
      }));

      state.filteredProviders = state.providers.filter(
        (p) => p.fromCurrency === state.selectedCurrency,
      );

      state.lastUpdated = new Date().toISOString();
    },
  },
});

// Export actions
export const {
  setSelectedCurrency,
  setSendAmount,
  setSelectedProvider,
  resetSelection,
  filterByDeliveryMethod,
  refreshMockData,
} = remittanceSlice.actions;

// Selectors
export const selectFilteredProviders = (state: {
  remittance: RemittanceState;
}) => state.remittance.filteredProviders;

export const selectSelectedCurrency = (state: {
  remittance: RemittanceState;
}) => state.remittance.selectedCurrency;

export const selectSelectedProvider = (state: {
  remittance: RemittanceState;
}) => state.remittance.selectedProvider;

export const selectSendAmount = (state: { remittance: RemittanceState }) =>
  state.remittance.sendAmount;

export const selectCalculation = (state: { remittance: RemittanceState }) =>
  state.remittance.calculation;

export const selectRemittanceLoading = (state: {
  remittance: RemittanceState;
}) => state.remittance.loading;

export const selectRemittanceError = (state: { remittance: RemittanceState }) =>
  state.remittance.error;

export const selectLastUpdated = (state: { remittance: RemittanceState }) =>
  state.remittance.lastUpdated;

// Export reducer
export default remittanceSlice.reducer;
