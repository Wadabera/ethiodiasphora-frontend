import api from "@/services/api";
import {
  mockRemittanceComparison,
  mockProviders,
  mockDeliveryMethods,
  mockProviderRates,
} from "./mockRemittanceData";
import type {
  RemittanceComparison,
  RemittanceProvider,
  DeliveryMethod,
  ProviderRate,
} from "../types/remittance.types";

// Toggle for mock/production
const USE_MOCK_DATA = true;

export const remittanceService = {
  // Compare all remittance options
  compareRemittance: async (
    fromCurrency: string = "USD",
    amount: number = 1000,
    toCurrency: string = "ETB",
  ): Promise<RemittanceComparison> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        ...mockRemittanceComparison,
        fromCurrency,
        toCurrency,
        sendAmount: amount,
      };
    }

    try {
      const response = await api.get("/api/v1/remittance/compare", {
        params: { from: fromCurrency, amount, to: toCurrency },
      });
      return response.data;
    } catch (error) {
      console.error("API failed, using mock data:", error);
      return {
        ...mockRemittanceComparison,
        fromCurrency,
        toCurrency,
        sendAmount: amount,
      };
    }
  },

  // Get all providers
  getProviders: async (): Promise<RemittanceProvider[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProviders;
    }

    try {
      const response = await api.get("/api/v1/remittance/providers");
      return response.data;
    } catch (error) {
      console.error("API failed, using mock data:", error);
      return mockProviders;
    }
  },

  // Get provider by ID
  getProviderById: async (
    providerId: string,
  ): Promise<RemittanceProvider | null> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockProviders.find((p) => p.id === providerId) || null;
    }

    try {
      const response = await api.get(
        `/api/v1/remittance/providers/${providerId}`,
      );
      return response.data;
    } catch (error) {
      console.error("API failed, using mock data:", error);
      return mockProviders.find((p) => p.id === providerId) || null;
    }
  },

  // Get provider rates
  getProviderRates: async (providerId: string): Promise<ProviderRate[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockProviderRates.filter((r) => r.providerId === providerId);
    }

    try {
      const response = await api.get(
        `/api/v1/remittance/providers/${providerId}/rates`,
      );
      return response.data;
    } catch (error) {
      console.error("API failed, using mock data:", error);
      return mockProviderRates.filter((r) => r.providerId === providerId);
    }
  },

  // Get delivery methods
  getDeliveryMethods: async (): Promise<DeliveryMethod[]> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockDeliveryMethods;
    }

    try {
      const response = await api.get("/api/v1/remittance/delivery-methods");
      return response.data;
    } catch (error) {
      console.error("API failed, using mock data:", error);
      return mockDeliveryMethods;
    }
  },

  // Calculate transfer
  calculateTransfer: async (
    fromCurrency: string,
    toCurrency: string,
    amount: number,
    providerId: string,
  ): Promise<any> => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const provider = mockProviders.find((p) => p.id === providerId);
      const rate = provider?.rates?.find((r) => r.currency === toCurrency);

      return {
        fromAmount: amount,
        toAmount: amount * (rate?.rate || 55.5),
        rate: rate?.rate || 55.5,
        fee: 4.99,
        total: amount - 4.99,
        providerId,
        providerName: provider?.name,
      };
    }

    try {
      const response = await api.post("/api/v1/remittance/calculate", {
        fromCurrency,
        toCurrency,
        amount,
        providerId,
      });
      return response.data;
    } catch (error) {
      console.error("Calculation failed:", error);
      throw error;
    }
  },

  // Seed data (admin only)
  seedRemittanceData: async (): Promise<any> => {
    if (USE_MOCK_DATA) {
      return { message: "Mock data seeded successfully" };
    }

    try {
      const response = await api.get("/api/v1/remittance/seed");
      return response.data;
    } catch (error) {
      console.error("Failed to seed data:", error);
      throw error;
    }
  },
};
