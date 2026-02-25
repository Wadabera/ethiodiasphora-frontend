// ============================================
// KYC SERVICE - Complete API Integration
// ============================================

import api from "@/services/api";
import type {
  KYCResponse,
  KYCStatusResponse,
  KYCSubmissionRequest,
  FileUploadResponse,
} from "../types/kycTypes";

const getToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Please login to access this feature");
  }
  return token;
};

export const kycService = {
  // ========== USER KYC FUNCTIONS ==========

  // Submit KYC by level (basic/intermediate/advanced)
  async submitKYC(data: KYCSubmissionRequest): Promise<KYCResponse> {
    const token = getToken();
    const response = await api.post(`/api/v1/kyc/submit`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get user's KYC status
  async getKYCStatus(): Promise<KYCStatusResponse> {
    const token = getToken();
    const response = await api.get(`/api/v1/kyc/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Upload document file
  async uploadDocument(file: File, type: string): Promise<FileUploadResponse> {
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

  // Get all KYC submissions (with filters)
  async getAllSubmissions(filters?: any): Promise<{
    kycs: KYCResponse[];
    pagination?: any;
  }> {
    const token = getToken();
    const response = await api.get(`/api/v1/kyc/admin/all`, {
      params: filters,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get pending submissions
  async getPendingSubmissions(): Promise<{ submissions: KYCResponse[] }> {
    const token = getToken();
    const response = await api.get(`/api/v1/kyc/admin/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Get single submission details
  async getSubmissionDetails(kycId: string): Promise<KYCResponse> {
    const token = getToken();
    const response = await api.get(`/api/v1/kyc/admin/${kycId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Approve KYC
  async approveKYC(kycId: string, notes: string): Promise<KYCResponse> {
    const token = getToken();
    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/approve`,
      { notes, sendNotifications: true },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  // Reject KYC
  async rejectKYC(
    kycId: string,
    reason: string,
    notes: string,
  ): Promise<KYCResponse> {
    const token = getToken();
    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/reject`,
      { reason, notes, sendNotifications: true },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  // Request more information
  async requestMoreInfo(kycId: string, message: string): Promise<KYCResponse> {
    const token = getToken();
    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/request-info`,
      { message, sendNotifications: true },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },

  // Send to review
  async sendToReview(kycId: string, notes: string): Promise<KYCResponse> {
    const token = getToken();
    const response = await api.put(
      `/api/v1/kyc/admin/${kycId}/review`,
      { notes },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  },
};

export const adminKycService = kycService;
