// src/features/remittance/hooks/useRemittance.ts
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchRemittanceRates,
  fetchRemittanceCompare,
  fetchAllProviders,
  // fetchProviderByName,
  setCalculatorInput,
  setFilters,
  clearFilters,
  selectProvider,
  clearComparison,
  setViewMode,
} from "../slices/remittanceSlice";
import type {
  CalculatorInput,
  RemittanceFilters,
  DisplayProvider,
  ProviderDetail,
} from "../types/remittance.types";

interface UseRemittanceReturn {
  // Data
  compareData: any;
  displayProviders: DisplayProvider[];
  selectedProvider: ProviderDetail | null;
  loading: boolean;
  error: string | null;
  filters: RemittanceFilters;
  calculatorInput: CalculatorInput;
  viewMode: "card" | "table";

  // Actions
  fetchCompare: (fromCurrency?: string, amount?: number) => Promise<void>;
  setCalculatorInput: (input: Partial<CalculatorInput>) => void;
  setFilters: (filters: Partial<RemittanceFilters>) => void;
  clearFilters: () => void;
  selectProvider: (provider: ProviderDetail | null) => void;
  clearComparison: () => void;
  setViewMode: (mode: "card" | "table") => void;

  // Helpers
  getFilteredProviders: () => DisplayProvider[];
  getBestProvider: () => DisplayProvider | undefined;
  getSavings: () => { amount: number; percentage: number } | null;
  getBestRate: () => number;
  getFastestDelivery: () => string;
  getLowestFee: () => string;
  handleDownloadApp: () => void;
}

// This is a named export - so you need curly braces when importing
export const useRemittance = (): UseRemittanceReturn => {
  const dispatch = useAppDispatch();
  const {
    compareData,
    displayProviders,
    selectedProvider,
    loading,
    error,
    filters,
    calculatorInput,
    viewMode,
  } = useAppSelector((state) => state.remittance);

  // Fetch compare data
  const fetchCompare = useCallback(
    async (fromCurrency: string = "USD", amount: number = 1000) => {
      await dispatch(fetchRemittanceCompare({ fromCurrency, amount })).unwrap();
    },
    [dispatch],
  );

  // UI Actions
  const updateCalculatorInput = useCallback(
    (input: Partial<CalculatorInput>) => {
      dispatch(setCalculatorInput(input));
    },
    [dispatch],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<RemittanceFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleSelectProvider = useCallback(
    (provider: ProviderDetail | null) => {
      dispatch(selectProvider(provider));
    },
    [dispatch],
  );

  const handleClearComparison = useCallback(() => {
    dispatch(clearComparison());
  }, [dispatch]);

  const handleSetViewMode = useCallback(
    (mode: "card" | "table") => {
      dispatch(setViewMode(mode));
    },
    [dispatch],
  );

  // Handle download app
  const handleDownloadApp = useCallback(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(
          "https://apps.apple.com/app/ethio-diaspora/id123456789",
          "_blank",
        );
      } else if (/Android/i.test(navigator.userAgent)) {
        window.open(
          "https://play.google.com/store/apps/details?id=com.ethiodiaspora.app",
          "_blank",
        );
      }
    } else {
      window.open(
        "https://play.google.com/store/apps/details?id=com.ethiodiaspora.app",
        "_blank",
      );
    }
  }, []);

  // Helper functions
  const getFilteredProviders = useCallback(() => {
    let filtered = [...displayProviders];

    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((p) =>
        filters.type === "international"
          ? p.type === "international_provider"
          : p.type === "ethiopian_bank",
      );
    }

    if (filters.provider) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.provider!.toLowerCase()),
      );
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

  const getBestRate = useCallback(() => {
    if (displayProviders.length === 0) return 0;
    return Math.max(...displayProviders.map((p) => p.exchangeRate));
  }, [displayProviders]);

  const getFastestDelivery = useCallback(() => {
    if (displayProviders.length === 0) return "N/A";
    const fastest = displayProviders.reduce((fastest, current) => {
      const getMinutes = (time: string) => {
        if (time.includes("minutes")) return 1;
        if (time.includes("hour")) return 60;
        if (time.includes("days")) return 1440;
        return 9999;
      };
      return getMinutes(current.deliveryTime) < getMinutes(fastest.deliveryTime)
        ? current
        : fastest;
    });
    return fastest.deliveryTime;
  }, [displayProviders]);

  const getLowestFee = useCallback(() => {
    if (displayProviders.length === 0) return "N/A";
    const lowest = displayProviders.reduce((lowest, current) =>
      current.fee < lowest.fee ? current : lowest,
    );
    return lowest.fee === 0 ? "No fee" : `$${lowest.fee}`;
  }, [displayProviders]);

  // Load initial data
  useEffect(() => {
    fetchCompare("USD", 1000);
    dispatch(fetchAllProviders());
    dispatch(fetchRemittanceRates());
  }, []);

  return {
    // Data
    compareData,
    displayProviders,
    selectedProvider,
    loading,
    error,
    filters,
    calculatorInput,
    viewMode,

    // Actions
    fetchCompare,
    setCalculatorInput: updateCalculatorInput,
    setFilters: updateFilters,
    clearFilters: clearAllFilters,
    selectProvider: handleSelectProvider,
    clearComparison: handleClearComparison,
    setViewMode: handleSetViewMode,

    // Helpers
    getFilteredProviders,
    getBestProvider,
    getSavings,
    getBestRate,
    getFastestDelivery,
    getLowestFee,
    handleDownloadApp,
  };
};
