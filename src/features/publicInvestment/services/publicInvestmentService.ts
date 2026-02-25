// src/features/publicInvestment/services/publicInvestmentService.ts
import api from "@/services/api";
import type{ PublicInvestmentFilters } from "../types/publicInvestment.types";

export const publicInvestmentService = {
  // Get all investments
  getInvestments: async (
    params?: PublicInvestmentFilters & { page?: number; limit?: number },
  ) => {
    const response = await api.get("/api/v1/investments", { params });
    return response.data;
  },

  // Get investment by ID
  getInvestmentById: async (id: string) => {
    const response = await api.get(`/api/v1/investments/${id}`);
    return response.data;
  },

  // Get featured investments
  getFeaturedInvestments: async () => {
    const response = await api.get("/api/v1/investments", {
      params: { featured: true, limit: 3 },
    });
    return response.data;
  },

  // Get investment stats
  getInvestmentStats: async () => {
    const response = await api.get("/api/v1/investments/stats");
    return response.data;
  },
};
