// ============================================
// KYC TYPES - Complete Type Definitions
// ============================================

export type KYCStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "requires_update";

export type KYCLevel = "basic" | "intermediate" | "advanced";
export type UserRole = "diaspora_investor" | "local_business" | "admin";
export type UserType = "investor" | "business";

export type IDDocumentType = "passport" | "national_id" | "drivers_license";

export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "unemployed"
  | "student"
  | "retired";

export type SourceOfFunds =
  | "employment_salary"
  | "business_income"
  | "investments"
  | "inheritance"
  | "savings";

// ============================================
// User Interface
// ============================================
export interface KYCUser {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  kycStatus?: KYCStatus;
  kycLevel?: KYCLevel;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// KYC Data Interfaces by Level
// ============================================

// Level 1: Basic KYC
export interface BasicKYCData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

// Level 2: Intermediate KYC
export interface IntermediateKYCData {
  idDocumentType: IDDocumentType;
  idDocumentNumber: string;
  idDocumentFrontImage: string | File;
  idDocumentBackImage?: string | File;
  selfieImage: string | File;
  employmentStatus: EmploymentStatus;
  occupation: string;
  annualIncome: number;
}

// Level 3: Advanced KYC
export interface AdvancedKYCData {
  sourceOfFunds: SourceOfFunds;
  bankStatement: string | File;
  proofOfAddress: string | File;
  taxIdentificationNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  employmentLetter?: string | File;
}

// ============================================
// KYC Submission Request
// ============================================
export interface KYCSubmissionRequest {
  level: KYCLevel; // ✅ This is required and matches backend
  // Basic fields
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  // Intermediate fields
  idDocumentType?: string;
  idDocumentNumber?: string;
  idDocumentFrontImage?: string | File; // ✅ Allow File for form data
  idDocumentBackImage?: string | File;
  selfieImage?: string | File;
  employmentStatus?: string;
  occupation?: string;
  annualIncome?: number;
  // Advanced fields
  sourceOfFunds?: string;
  bankStatement?: string | File;
  proofOfAddress?: string | File;
  taxIdentificationNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  employmentLetter?: string | File;
}

// ============================================
// KYC Response from API
// ============================================
export interface KYCResponse {
  _id: string;
  userId: string | KYCUser;
  level: KYCLevel; // ✅ This matches backend
  status: KYCStatus;
  // Basic fields
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  // Intermediate fields
  idDocumentType?: string;
  idDocumentNumber?: string;
  idDocumentFrontImage?: string; // ✅ URL string from backend
  idDocumentBackImage?: string;
  selfieImage?: string;
  employmentStatus?: string;
  occupation?: string;
  annualIncome?: number;
  // Advanced fields
  sourceOfFunds?: string;
  bankStatement?: string;
  proofOfAddress?: string;
  employmentLetter?: string;
  taxIdentificationNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  // Admin fields
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ============================================
// KYC Status Response
// ============================================
export interface KYCStatusResponse {
  overall: KYCStatus;
  byLevel: {
    basic: KYCStatus;
    intermediate: KYCStatus;
    advanced: KYCStatus;
  };
  records: Array<{
    _id: string;
    level: KYCLevel; // ✅ This matches backend
    status: KYCStatus;
    reviewedAt?: string;
    reviewNotes?: string;
    rejectionReason?: string;
    createdAt: string;
  }>;
}

// ============================================
// Redux State Interfaces
// ============================================
export interface KYCState {
  loading: boolean;
  error: string | null;
  kycStatus: KYCStatusResponse | null;
  currentLevel: KYCLevel;
  submissions: KYCResponse[];
}

export interface AdminKYCState {
  submissions: KYCResponse[];
  selectedSubmission: KYCResponse | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    level: string;
    userType: string;
    search: string;
    page: number;
    limit: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

// ============================================
// Admin Action Types
// ============================================
export interface KYCApprovalRequest {
  notes?: string;
}

export interface KYCRejectionRequest {
  reason: string;
  notes?: string;
}

export interface KYCRequestInfoRequest {
  message: string;
}

// ============================================
// File Upload
// ============================================
export interface FileUploadResponse {
  url: string;
  fileName: string;
  fileType: string;
  size: number;
}
