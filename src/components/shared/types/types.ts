// features/kyc/shared/types/kyc.types.ts

export type KYCLevel = "basic" | "intermediate" | "advanced";
export type KYCStatus = "pending" | "under_review" | "approved" | "rejected";
export type UserRole = "investor" | "business_owner" | "admin";

// KYC Submission Types
export interface KYCBaseSubmission {
  level: KYCLevel;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface BasicKYCSubmission extends KYCBaseSubmission {
  level: "basic";
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface IntermediateKYCSubmission {
  level: "intermediate";
  idDocumentType: "passport" | "national_id" | "drivers_license";
  idDocumentNumber: string;
  idDocumentImage?: File | string;
  employmentStatus: "employed" | "self_employed" | "unemployed" | "student";
  occupation?: string;
  annualIncome?: number;
}

export interface AdvancedKYCSubmission {
  level: "advanced";
  sourceOfFunds: string;
  investmentExperience: string;
  riskTolerance: "low" | "medium" | "high";
  proofOfAddress?: File | string;
}

// Combined KYC Data
export interface KYCSubmissionData {
  userId: string;
  basic?: BasicKYCSubmission;
  intermediate?: IntermediateKYCSubmission;
  advanced?: AdvancedKYCSubmission;
}

// API Response Types
export interface KYCSubmissionResponse {
  _id: string;
  userId: {
    _id: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
  status: KYCStatus;
  isPoliticallyExposed: boolean;
  sanctionScreeningResults: any[];
  level: KYCLevel;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  idDocumentType?: string;
  idDocumentNumber?: string;
  employmentStatus?: string;
  occupation?: string;
  annualIncome?: number;
  sourceOfFunds?: string;
  investmentExperience?: string;
  riskTolerance?: string;
  createdAt: string;
  updatedAt: string;
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface KYCStatusResponse {
  overall: KYCStatus;
  byLevel: {
    basic: KYCStatus;
    intermediate: KYCStatus;
    advanced: KYCStatus;
  };
  records: KYCSubmissionResponse[];
}

export interface KYCAdminListResponse {
  data: KYCSubmissionResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  summary?: {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    totalSubmissions: number;
  };
}
