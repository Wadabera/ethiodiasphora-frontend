// src/features/remittance/services/remittanceService.ts
import api from "@/services/api";
import {
  mockCompareResponse,
  mockRatesResponse,
  mockProvidersResponse,
  mockProviderDetailsResponse,
} from "./mockRemittanceData";
import type {
  RatesResponse,
  CompareResponse,
  ProviderBasic,
  ProviderDetail,
} from "../types/remittance.types";

// Toggle for mock data - set to false when backend is ready
const USE_MOCK_DATA = true;

export const remittanceService = {
  // GET /api/v1/remittance/rates
  fetchRates: async (): Promise<RatesResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockRatesResponse;
    }
    try {
      const response = await api.get("/api/v1/remittance/rates");
      return response.data;
    } catch (error) {
      console.error("Error fetching rates:", error);
      throw error;
    }
  },

  // GET /api/v1/remittance/compare?from=USD&amount=1000
  fetchCompare: async (
    fromCurrency: string,
    amount: number,
  ): Promise<CompareResponse> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockCompareResponse(fromCurrency, amount);
    }
    try {
      const response = await api.get("/api/v1/remittance/compare", {
        params: { from: fromCurrency, amount },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching comparison:", error);
      throw error;
    }
  },

  // GET /api/v1/remittance/providers
  fetchAllProviders: async (): Promise<ProviderBasic[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockProvidersResponse;
    }
    try {
      const response = await api.get("/api/v1/remittance/providers");
      return response.data;
    } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
    }
  },

  // GET /api/v1/remittance/providers/:provider
  fetchProviderByName: async (provider: string): Promise<ProviderDetail[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProviderDetailsResponse[provider] || [];
    }
    try {
      const response = await api.get(
        `/api/v1/remittance/providers/${provider}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching provider:", error);
      throw error;
    }
  },
};
