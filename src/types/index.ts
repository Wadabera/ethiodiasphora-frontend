// src/types/index.ts
// ============ types/index.ts ============
export interface User {
  _id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role?: 'local_business' | 'diaspora_investor' | 'admin' | 'user'; 
  phoneNumber?: string;  // Add this too if needed
  isVerified?: boolean;  // Add this
  createdAt?: string;    // Add this
}

// ✅ Also add these related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;  // Now User includes role! 🎯
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

export interface Investor {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface InvestmentTransaction {
  investorId: Investor | string;
  amount: number;
  investmentDate: string;
  status: "pending" | "confirmed" | "rejected";
  _id: string;
}

export type InvestmentRiskLevel = "low" | "medium" | "high";

export type InvestmentStatus =
  | "draft"
  | "pending"
  | "published"
  | "active"
  | "completed"
  | "rejected";

export interface CreateInvestmentRequest {
  title: string;
  businessName: string;
  sector: string;
  industry: string;
  description: string;
  fundingGoal: number;
  expectedReturn: number;
  investmentPeriod: number;
  location: string;
  minimumInvestment: number;
  maxInvestment?: number;
  riskLevel: InvestmentRiskLevel;
  businessPlan: string;
  useOfFunds: string;
  riskFactors?: string;
}
export interface AdminInvestmentState {
  investments: Investment[];
  filteredInvestments: Investment[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  filters: {
    status: string;
    search: string;
  };
}

// Updated Investment interface based on your response
export interface Investment {
  _id: string;
  title: string;
  description: string;
  businessOwnerId: {
    _id: string;
    email: string;
    phoneNumber: string;
  };
  businessName: string;
  sector: string;
  industry: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;
  status: "draft" | "pending" | "approved" | "rejected" | "published";
  images: string[];
  businessPlan: string;
  riskLevels: string;
  riskFactors: string;
  useOfFunds: string;
  viewCount: number;
  interestedInvestors: number;
  isActive: boolean;
  isVerified: boolean;
  documentsVerified: boolean;
  documents: string[];
  investments: InvestmentTransaction[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  verificationDate?: string;
  previousStatus?: string;
  verificationNotes?: string;
  verifiedBy?: string;
  maxInvestment?: number; // Optional based on your request
}
export interface AdminActionPayload {
  id: string;
  notes?: string;
  reason?: string;
}
export interface PortfolioResponse {
  investments: Investment[];
}
// System-wide IPO status definitions
export type IPOStatus = 
  | 'pending_approval'  // Business owner submitted, awaiting admin review
  | 'announced'         // Admin approved, visible to investors but not open
  | 'open'              // Open for subscription during defined period
  | 'closed'            // Subscription period ended, awaiting allotment
  | 'allotted'          // Shares allocated to investors
  | 'listed'            // Trading on exchange
  | 'rejected';         // Admin rejected the application

export type SubscriptionStatus =
  | 'pending'           // Application submitted, awaiting allotment
  | 'allotted'          // Shares allocated
  | 'partial'           // Partially allotted (oversubscribed)
  | 'rejected'          // Not allotted
  | 'cancelled';        // Investor cancelled

export interface IPO {
  _id: string;
  companyId: string;
  companyName: string;
  symbol: string;
  status: IPOStatus;
  
  // Pricing & Shares
  offerPrice: number;
  faceValue: number;
  totalShares: number;
  issueSize: number; // totalShares * offerPrice
  
  // Lot Configuration
  lotSize: number; // shares per lot
  minimumLot: number;
  maximumLot: number;
  
  // Timeline
  startDate: string;
  endDate: string;
  
  // Documents
  prospectusUrl: string;
  description: string;
  
  // Classification
  sector: string;
  industry: string;
  ipoType: 'fresh_issue' | 'offer_for_sale';
  
  // Statistics
  totalSubscribed: number;
  totalApplications: number;
  subscriptionRatio: number;
  
  // Audit
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  
  // Admin fields (populated during review)
  reviewedBy?: string;
  reviewedAt?: string;
  approvalNotes?: string;
  rejectionReason?: string;
  openedAt?: string;
  closedAt?: string;
  allottedAt?: string;
  listedAt?: string;
  listingPrice?: number;
  exchange?: string;
}

export interface IPOSubscription {
  _id: string;
  ipoId: string;
  userId: string;
  symbol: string;
  companyName: string;
  
  // Subscription details
  quantity: number; // shares requested
  lots: number; // quantity / lotSize
  pricePerShare: number;
  totalAmount: number;
  
  // Status
  status: SubscriptionStatus;
  applicationNumber: string;
  
  // Allotment results
  allottedShares?: number;
  allottedAmount?: number;
  refundAmount?: number;
  allotmentDate?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface IPOFilters {
  status?: IPOStatus;
  sector?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IPOStats {
  totalIPOs: number;
  byStatus: Record<IPOStatus, number>;
  totalSubscribed: number;
  totalRaised: number;
  averageSubscriptionRatio: number;
}