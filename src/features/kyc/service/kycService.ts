// service/kycService.ts
import api from "@/services/api";
import type { KYCResponse, KYCStatusResponse } from "../types/kycTypes";

// Helper function to get token
const getToken = (): string => {
  const token =
    localStorage.getItem("access_token");
    
  if (!token) {
    console.error("No authentication token found in storage");
    throw new Error("Please login to access this feature");
  }
  return token;
};

export const kycService = {
  // ========== USER KYC FUNCTIONS ==========

  // Submit KYC (all levels)
  async submitKYC(level: string, data: any): Promise<KYCResponse> {
    const token = getToken();

    const response = await api.post(
      `/api/v1/kyc/submit`,
      {
        level,
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  // Get KYC status
  async getKYCStatus(): Promise<KYCStatusResponse> {
    const token = getToken();

    const response = await api.get(`/api/v1/kyc/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Upload document/file
  async uploadDocument(file: File, type: string): Promise<{ url: string }> {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await api.post(`/api/v1/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ========== ADMIN KYC FUNCTIONS ==========

  // Admin: Get all KYC submissions
  async getAllSubmissions(
    filters = {},
  ): Promise<{ submissions: KYCResponse[]; pagination?: any }> {
    const token = getToken();

    const response = await api.get(`/api/v1/kyc/admin/all`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Admin: Get pending submissions
  async getPendingSubmissions(): Promise<{
    submissions: KYCResponse[];
    total: number;
  }> {
    const token = getToken();

    const response = await api.get(`/api/v1/kyc/admin/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Admin: Get submission details
  async getSubmissionDetails(kycId: string): Promise<KYCResponse> {
    const token = getToken();

    const response = await api.get(`/api/v1/kyc/admin/${kycId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Admin: Approve KYC
  async approveKYC(kycId: string, notes: string): Promise<KYCResponse> {
    const token = getToken();

    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/approve`,
      { notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  // Admin: Reject KYC
  async rejectKYC(
    kycId: string,
    reason: string,
    notes: string,
  ): Promise<KYCResponse> {
    const token = getToken();

    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/reject`,
      { reason, notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  // Admin: Request more information
  async requestMoreInfo(kycId: string, message: string): Promise<KYCResponse> {
    const token = getToken();

    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/request-info`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
};

// Export for backward compatibility
export const adminKycService = kycService;
