// services/ServiceManager.ts
import api from "./api";
import type { KYCResponse, KYCStatusResponse } from "../features/kyc/types/kycTypes";
import type { Investment, InvestmentFilters } from "../types/index";

class ServiceManager {
  private static instance: ServiceManager;

  private constructor() {}

  static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  // ========== COMMON UTILITIES ==========

  private getToken(): string {
    // Check multiple possible token locations for compatibility
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token");

    if (!token) {
      console.error("No authentication token found");
      throw new Error("Please login to access this feature");
    }

    return token;
  }

  // Check if user has specific role
  private checkRole(allowedRoles: string[]): boolean {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;

    try {
      const user = JSON.parse(userStr);
      return allowedRoles.includes(user.role);
    } catch {
      return false;
    }
  }

  // ========== KYC SERVICES ==========

  kyc = {
    // Submit KYC (all levels)
    submit: async (level: string, data: any): Promise<KYCResponse> => {
      const response = await api.post(`/kyc/submit`, { level, ...data });
      return response.data;
    },

    // Get KYC status
    getStatus: async (): Promise<KYCStatusResponse> => {
      const response = await api.get(`/kyc/status`);
      return response.data;
    },

    // Upload document/file
    uploadDocument: async (
      file: File,
      type: string,
    ): Promise<{ url: string }> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await api.post(`/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  };

  // ========== INVESTMENT SERVICES ==========

  investments = {
    // Public endpoints
    browse: async (filters: InvestmentFilters = {}) => {
      const response = await api.get(`/investments`, { params: filters });
      return response.data;
    },

    getDetails: async (id: string) => {
      const response = await api.get(`/investments/${id}`);
      return response.data;
    },

    // Business owner endpoints
    create: async (investmentData: FormData) => {
      if (!this.checkRole(["local_business", "admin"])) {
        throw new Error("Only business owners can create investments");
      }

      const response = await api.post("/investments", investmentData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    update: async (id: string, data: Partial<Investment>) => {
      const response = await api.put(`/investments/${id}`, data);
      return response.data;
    },

    getMyInvestments: async () => {
      const response = await api.get("/investments/my-portfolio");
      return response.data;
    },

    // Investor endpoints
    invest: async (id: string, amount: number, paymentMethod: string) => {
      if (!this.checkRole(["diaspora_investor", "admin"])) {
        throw new Error("Only investors can make investments");
      }

      const response = await api.post(`/investments/${id}/invest`, {
        amount,
        paymentMethod,
      });
      return response.data;
    },

    getSummary: async () => {
      const response = await api.get("/investments/summary");
      return response.data;
    },
  };

  // ========== IPO SERVICES ==========

  ipos = {
    // Public endpoints
    browse: async (filters: any = {}) => {
      const response = await api.get(`/ipo/browse`, { params: filters });
      return response.data;
    },

    getDetails: async (id: string) => {
      const response = await api.get(`/ipo/${id}`);
      return response.data;
    },

    // Investor endpoints
    subscribe: async (ipoId: string, quantity: number, paymentData: any) => {
      const response = await api.post(`/ipo/${ipoId}/subscribe`, {
        quantity,
        ...paymentData,
      });
      return response.data;
    },

    getMySubscriptions: async () => {
      const response = await api.get("/ipo/my-subscriptions");
      return response.data;
    },

    // Business owner endpoints
    create: async (ipoData: any) => {
      const response = await api.post("/ipo/create", ipoData);
      return response.data;
    },

    getMyIPOs: async () => {
      const response = await api.get("/ipo/my-ipos");
      return response.data;
    },
  };

  // ========== PORTFOLIO SERVICES ==========

  portfolio = {
    getHoldings: async () => {
      const response = await api.get("/portfolio");
      return response.data;
    },

    getAnalytics: async () => {
      const response = await api.get("/portfolio/analytics");
      return response.data;
    },
  };

  // ========== ADMIN SERVICES ==========

  admin = {
    // KYC Management
    kyc: {
      getAllSubmissions: async (filters = {}) => {
        const response = await api.get(`/kyc/admin/all`, { params: filters });
        return response.data;
      },

      getPendingSubmissions: async () => {
        const response = await api.get(`/kyc/admin/pending`);
        return response.data;
      },

      getSubmissionDetails: async (kycId: string) => {
        const response = await api.get(`/kyc/admin/${kycId}`);
        return response.data;
      },

      approve: async (kycId: string, notes: string) => {
        const response = await api.put(`/kyc/admin/${kycId}/approve`, {
          notes,
        });
        return response.data;
      },

      reject: async (kycId: string, reason: string, notes: string) => {
        const response = await api.put(`/kyc/admin/${kycId}/reject`, {
          reason,
          notes,
        });
        return response.data;
      },

      requestMoreInfo: async (kycId: string, message: string) => {
        const response = await api.put(`/kyc/admin/${kycId}/request-info`, {
          message,
        });
        return response.data;
      },
    },

    // Investment Management
    investments: {
      getPendingInvestments: async () => {
        const response = await api.get("/investments/admin/pending");
        return response.data;
      },

      getAllInvestments: async (filters: InvestmentFilters = {}) => {
        const response = await api.get("/investments/admin/all", {
          params: filters,
        });
        return response.data;
      },

      getInvestmentDetails: async (id: string) => {
        const response = await api.get(`/investments/admin/${id}`);
        return response.data;
      },

      approve: async (id: string, notes?: string) => {
        const response = await api.put(`/investments/admin/${id}/approve`, {
          notes,
        });
        return response.data;
      },

      reject: async (id: string, reason: string, notes?: string) => {
        const response = await api.put(`/investments/admin/${id}/reject`, {
          reason,
          notes,
        });
        return response.data;
      },

      requestMoreInfo: async (id: string, message: string) => {
        const response = await api.put(
          `/investments/admin/${id}/request-info`,
          { message },
        );
        return response.data;
      },
    },

    // IPO Management
    ipos: {
      getPendingIPOs: async () => {
        const response = await api.get("/ipo/admin/pending");
        return response.data;
      },

      getAllIPOs: async (filters: any = {}) => {
        const response = await api.get("/ipo/admin/all", { params: filters });
        return response.data;
      },

      getIPODetails: async (id: string) => {
        const response = await api.get(`/ipo/admin/${id}`);
        return response.data;
      },

      approve: async (id: string, notes: string) => {
        const response = await api.put(`/ipo/admin/${id}/approve`, { notes });
        return response.data;
      },

      open: async (id: string) => {
        const response = await api.put(`/ipo/admin/${id}/open`);
        return response.data;
      },

      close: async (id: string) => {
        const response = await api.put(`/ipo/admin/${id}/close`);
        return response.data;
      },
    },

    // User Management
    users: {
      getAllUsers: async (filters?: any) => {
        const response = await api.get("/users/admin/all", { params: filters });
        return response.data;
      },

      getUserDetails: async (userId: string) => {
        const response = await api.get(`/users/admin/${userId}`);
        return response.data;
      },

      activate: async (userId: string) => {
        const response = await api.put(`/users/admin/${userId}/activate`);
        return response.data;
      },

      deactivate: async (userId: string) => {
        const response = await api.put(`/users/admin/${userId}/deactivate`);
        return response.data;
      },
    },

    // Company Management
    companies: {
      getPendingCompanies: async () => {
        const response = await api.get("/companies/admin/pending");
        return response.data;
      },

      getAllCompanies: async (filters?: any) => {
        const response = await api.get("/companies/admin/all", {
          params: filters,
        });
        return response.data;
      },

      getCompanyDetails: async (id: string) => {
        const response = await api.get(`/companies/admin/${id}`);
        return response.data;
      },

      verify: async (id: string, approved: boolean, notes: string) => {
        const response = await api.put(`/companies/admin/${id}/verify`, {
          approved,
          notes,
        });
        return response.data;
      },
    },
  };

  // ========== USER PROFILE SERVICES ==========

  user = {
    getProfile: async () => {
      const response = await api.get("/users/profile");
      return response.data;
    },

    updateProfile: async (data: any) => {
      const response = await api.put("/users/profile", data);
      return response.data;
    },

    getDashboard: async () => {
      const response = await api.get("/users/dashboard");
      return response.data;
    },
  };

  // ========== COMPANY SERVICES ==========

  companies = {
    register: async (companyData: any) => {
      const response = await api.post("/companies/register", companyData);
      return response.data;
    },

    getMyCompany: async () => {
      const response = await api.get("/companies/my-company");
      return response.data;
    },

    update: async (data: any) => {
      const response = await api.put("/companies/my-company", data);
      return response.data;
    },
  };

  // ========== PUBLIC SERVICES (No auth required) ==========

  public = {
    banks: {
      getAll: async () => {
        const response = await api.get("/banks");
        return response.data;
      },

      search: async (query: string) => {
        const response = await api.get("/banks/search", { params: { query } });
        return response.data;
      },

      seed: async () => {
        const response = await api.get("/banks/seed");
        return response.data;
      },
    },

    currency: {
      getRates: async () => {
        const response = await api.get("/currency/rates");
        return response.data;
      },
    },

    remittance: {
      getRates: async () => {
        const response = await api.get("/remittance/rates");
        return response.data;
      },

      getProviders: async () => {
        const response = await api.get("/remittance/providers");
        return response.data;
      },
    },

    analytics: {
      getEconomicIndicators: async () => {
        const response = await api.get("/analytics/economic/indicators");
        return response.data;
      },

      getMarketAnalytics: async () => {
        const response = await api.get("/analytics/ethiopian/market");
        return response.data;
      },
    },
  };
}

export const serviceManager = ServiceManager.getInstance();
