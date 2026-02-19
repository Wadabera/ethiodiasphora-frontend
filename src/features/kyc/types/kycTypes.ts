// types/kycTypes.ts

export type KYCStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "requires_update";

export type KYCLevel = "basic" | "intermediate" | "advanced";

export type UserRole = "diaspora_investor" | "local_business" | "admin";

export type IDDocumentType =
  | "passport"
  | "national_id"  
  | "drivers_license"
  | "other";

export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "unemployed"
  | "student"
  | "retired"
  | "other";

export type SourceOfFunds =
  | "employment_salary"
  | "business_income"
  | "investments"
  | "inheritance"
  | "savings"
  | "other";

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

// Basic KYC Data (Level 1)
export interface BasicKYCData {
  fullName: string;
  dateOfBirth: string; // ISO format: "1990-01-15"
  nationality: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;

  // Business-specific fields (optional, used when userType="business")
  businessName?: string;
  businessRegistrationNumber?: string;
  businessType?: string;
}

// Intermediate KYC Data (Level 2)
export interface IntermediateKYCData {
  idDocumentType: IDDocumentType;
  idDocumentNumber: string;
  idDocumentFrontImage: string | File; // URL string or File object for upload
  idDocumentBackImage?: string | File; // Optional for some document types
  selfieImage: string | File;
  employmentStatus: EmploymentStatus;
  occupation: string;
  annualIncome: number;

  // Business-specific fields (optional, used when userType="business")
  businessRegistrationDocument?: string | File;
  businessTaxId?: string;
}

// Advanced KYC Data (Level 3)
export interface AdvancedKYCData {
  sourceOfFunds: SourceOfFunds;
  bankStatement: string | File;
  proofOfAddress: string | File;
  taxIdentificationNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;

  // Investor-specific fields
  employmentLetter?: string | File;

  // Business-specific fields
  businessFinancialStatement?: string | File;
  businessAnnualRevenue?: number;
}

// KYC Submission Request (what gets sent to API)
export interface KYCSubmissionRequest {
  level: KYCLevel;
  userType?: "investor" | "business";

  // Basic fields
  fullName?: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;

  // Business-specific basic fields
  businessName?: string;
  businessRegistrationNumber?: string;
  businessType?: string;

  // Intermediate fields
  idDocumentType?: string;
  idDocumentNumber?: string;
  idDocumentFrontImage?: string;
  idDocumentBackImage?: string;
  selfieImage?: string;
  employmentStatus?: string;
  occupation?: string;
  annualIncome?: number;

  // Business-specific intermediate fields
  businessRegistrationDocument?: string;
  businessTaxId?: string;

  // Advanced fields
  sourceOfFunds?: string;
  bankStatement?: string;
  proofOfAddress?: string;
  taxIdentificationNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;

  // Investor-specific advanced fields
  employmentLetter?: string;

  // Business-specific advanced fields
  businessFinancialStatement?: string;
  businessAnnualRevenue?: number;
}

// KYC Response from API (what we get back)
export interface KYCResponse {
  _id: string;
  userId: string | KYCUser;
  level: KYCLevel;
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
  idDocumentFrontImage?: string;
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

  // Admin review fields
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Business-specific fields
  businessName?: string;
  businessRegistrationNumber?: string;
  businessType?: string;
  businessRegistrationDocument?: string;
  businessTaxId?: string;
  businessFinancialStatement?: string;
  businessAnnualRevenue?: number;
}

// KYC Status Response
export interface KYCStatusResponse {
  overall: KYCStatus;
  byLevel: {
    basic: KYCStatus;
    intermediate: KYCStatus;
    advanced: KYCStatus;
  };
  records: Array<{
    _id: string;
    level: KYCLevel;
    status: KYCStatus;
    reviewedAt?: string;
    reviewNotes?: string;
    createdAt: string;
  }>;
}

// KYC Form Props
export interface KYCFormProps {
  onSubmit: (
    data: BasicKYCData | IntermediateKYCData | AdvancedKYCData,
  ) => Promise<void>;
  loading?: boolean;
  errors?: Record<string, string>;
  userType?: "investor" | "business";
}

// Form component specific interfaces
export interface KYCFormBasicProps extends Omit<KYCFormProps, "onSubmit"> {
  onSubmit: (data: BasicKYCData) => Promise<void>;
  initialData?: Partial<BasicKYCData>;
}

export interface KYCFormIntermediateProps extends Omit<
  KYCFormProps,
  "onSubmit"
> {
  onSubmit: (data: IntermediateKYCData) => Promise<void>;
  initialData?: Partial<IntermediateKYCData>;
}

export interface KYCFormAdvancedProps extends Omit<KYCFormProps, "onSubmit"> {
  onSubmit: (data: AdvancedKYCData) => Promise<void>;
  initialData?: Partial<AdvancedKYCData>;
}

// File upload types
export interface FileUploadResponse {
  url: string;
  location?: string;
  path?: string;
  fileName: string;
  fileType: string;
  size: number;
}

// KYC admin types
export interface KYCAdminSubmission {
  _id: string;
  userId: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    role: UserRole;
    phoneNumber?: string;
  };
  level: KYCLevel;
  status: KYCStatus;
  [key: string]: any; // Allow other fields
  createdAt: string;
}

export interface KYCAdminListResponse {
  submissions: KYCAdminSubmission[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// KYC approval request types
export interface KYCApprovalRequest {
  notes?: string;
  reason?: string;
  message?: string;
}

export interface KYCRejectionRequest extends KYCApprovalRequest {
  reason: string;
}

export interface KYCRequestInfoRequest {
  message: string;
}
