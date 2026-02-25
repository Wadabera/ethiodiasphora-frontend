// src/features/publicInvestment/types/publicInvestment.types.ts
export interface PublicInvestment {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  businessName: string;
  businessOwnerId?: {
    _id: string;
    email: string;
    fullName?: string;
  };
  sector: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;
  status: string;
  isVerified: boolean;
  investments?: Array<{
    investorId: string;
    amount: number;
    investmentDate: string;
    status: string;
  }>;
  coverImage?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  riskFactors?: string;
  useOfFunds?: string;
  businessPlan?: string;
  featured?: boolean; // Optional flag for featured investments
}

export interface PublicInvestmentFilters {
  sector?: string;
  minAmount?: number;
  maxAmount?: number;
  minROI?: number;
  location?: string;
  sortBy?: "newest" | "popular" | "roi" | "amount" | "oldest";
  search?: string;
}

export interface PublicInvestmentState {
  list: PublicInvestment[];
  featured: PublicInvestment[];
  selectedInvestment: PublicInvestment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: PublicInvestmentFilters;
}
