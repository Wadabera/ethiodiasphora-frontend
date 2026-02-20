import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchRemittanceRates,
  fetchRemittanceCompare,
  fetchAllProviders,
  fetchProviderByName,
  selectProvider,
  setCalculatorInput,
  setFilters,
  clearFilters,
  clearComparison,
} from "../slices/remittanceSlice";
import type {
  CalculatorInput,
  RemittanceFilters,
  DisplayProvider,
  ProviderDetail,
} from "../types/remittance.types";

interface UseRemittanceReturn {
  // Data from endpoints
  ratesData: any;
  compareData: any;
  providersList: any[];
  providerDetails: any[] | null;

  // UI State
  displayProviders: DisplayProvider[];
  selectedProvider: ProviderDetail | null;
  loading: boolean;
  error: string | null;
  filters: RemittanceFilters;
  calculatorInput: CalculatorInput;

  // API Functions
  fetchRates: () => Promise<void>;
  fetchCompare: (fromCurrency?: string, amount?: number) => Promise<void>;
  fetchAllProviders: () => Promise<void>;
  fetchProviderByName: (provider: string) => Promise<void>;

  // UI Actions
  setCalculatorInput: (input: Partial<CalculatorInput>) => void;
  setFilters: (filters: Partial<RemittanceFilters>) => void;
  clearFilters: () => void;
  selectProvider: (provider: ProviderDetail | null) => void;
  clearComparison: () => void;

  // Helpers
  getFilteredProviders: () => DisplayProvider[];
  getBestProvider: () => DisplayProvider | undefined;
  getSavings: () => { amount: number; percentage: number } | null;
}

export const useRemittance = (): UseRemittanceReturn => {
  const dispatch = useAppDispatch();
  const {
    ratesData,
    compareData,
    providersList,
    providerDetails,
    displayProviders,
    selectedProvider,
    loading,
    error,
    filters,
    calculatorInput,
  } = useAppSelector((state) => state.remittance);

  // ===== API Functions =====
  const fetchRates = useCallback(async () => {
    await dispatch(fetchRemittanceRates()).unwrap();
  }, [dispatch]);

  const fetchCompare = useCallback(
    async (fromCurrency: string = "USD", amount: number = 1000) => {
      await dispatch(fetchRemittanceCompare({ fromCurrency, amount })).unwrap();
    },
    [dispatch],
  );

  const fetchAllProvidersAction = useCallback(async () => {
    await dispatch(fetchAllProviders()).unwrap();
  }, [dispatch]);

  const fetchProviderByNameAction = useCallback(
    async (provider: string) => {
      await dispatch(fetchProviderByName(provider)).unwrap();
    },
    [dispatch],
  );

  // ===== UI Actions =====
  const setCalculatorInputAction = useCallback(
    (input: Partial<CalculatorInput>) => {
      dispatch(setCalculatorInput(input));
    },
    [dispatch],
  );

  const setFiltersAction = useCallback(
    (newFilters: Partial<RemittanceFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  const clearFiltersAction = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const selectProviderAction = useCallback(
    (provider: ProviderDetail | null) => {
      dispatch(selectProvider(provider));
    },
    [dispatch],
  );

  const clearComparisonAction = useCallback(() => {
    dispatch(clearComparison());
  }, [dispatch]);

  // ===== Helpers =====
  const getFilteredProviders = useCallback(() => {
    let filtered = [...displayProviders];

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((p) => p.type === filters.type);
    }

    if (filters.minRate) {
      filtered = filtered.filter((p) => p.exchangeRate >= filters.minRate!);
    }

    if (filters.maxFee) {
      filtered = filtered.filter((p) => p.fee <= filters.maxFee!);
    }

    return filtered;
  }, [displayProviders, filters]);

  const getBestProvider = useCallback(() => {
    if (displayProviders.length === 0) return undefined;
    return displayProviders.reduce((best, current) =>
      current.amountReceived > best.amountReceived ? current : best,
    );
  }, [displayProviders]);

  const getSavings = useCallback(() => {
    if (!compareData) return null;
    return {
      amount: compareData.marketInsights.savings,
      percentage:
        (compareData.marketInsights.savings /
          compareData.bestOption.amountReceived) *
        100,
    };
  }, [compareData]);

  // Load initial data
  useEffect(() => {
    fetchCompare("USD", 1000);
    fetchAllProvidersAction();
    fetchRates();
  }, []);

  return {
    // Data
    ratesData,
    compareData,
    providersList,
    providerDetails,

    // UI State
    displayProviders,
    selectedProvider,
    loading,
    error,
    filters,
    calculatorInput,

    // API Functions
    fetchRates,
    fetchCompare,
    fetchAllProviders: fetchAllProvidersAction,
    fetchProviderByName: fetchProviderByNameAction,

    // UI Actions
    setCalculatorInput: setCalculatorInputAction,
    setFilters: setFiltersAction,
    clearFilters: clearFiltersAction,
    selectProvider: selectProviderAction,
    clearComparison: clearComparisonAction,

    // Helpers
    getFilteredProviders,
    getBestProvider,
    getSavings,
  };
};
