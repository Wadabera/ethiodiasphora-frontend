// ---------- Types ----------
export interface Investment {
  _id: string;
  title: string;
  description: string;
  businessName: string;
  sector: string;
  fundingGoal: number;
  currentFunding: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;
  status: string;
  riskFactors: string;
  useOfFunds: string;
  businessPlan: string;
  isVerified: boolean;
  fundingProgress: number;
  remainingAmount: number;
  businessOwnerId?: {
    _id: string;
    email: string;
  };
  investments?: Array<{
    investorId: string;
    amount: number;
    investmentDate: string;
    status: string;
  }>;
  createdAt?: string;
  updatedAt?: string;

  // For tracking user investment
  hasUserInvested?: boolean;
  userInvestmentAmount?: number;
  userInvestmentDate?: string;
}

// Portfolio Investment Type (matches your API response)
export interface PortfolioInvestment {
  investmentId: string;
  title: string;
  businessName: string;
  businessOwnerName: string;
  businessOwnerEmail: string;
  sector: string;
  location: string;
  myInvestmentAmount: number;
  investmentDate: string;
  expectedReturn: number;
  investmentPeriod: number;
  fundingGoal: number;
  currentFunding: number;
  fundingProgress: string;
  remainingAmount: number;
  totalInvestors: number;
  investmentStatus: string;
  isFullyFunded: boolean;
}
// BusinessOwnerFeatures/MyInvestment/types/InvestmentTypes.ts

export interface InvestorDetail {
  investorName: string;
  investorEmail: string;
  investorPhone?: string;
  amount: number;
  investmentDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface Investment {
  _id: string;
  title: string;
  description: string;
  businessName: string;
  sector: string;
  industry: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;

  images?: string[];

  viewCount?: number;
  interestedInvestors?: number;
  isActive: boolean;
  isVerified: boolean;
  documentsVerified?: boolean;
  documents?: any[];

    investorId: {
      _id: string;
      email: string;
      fullName: string;
      phoneNumber: string;
    };
    amount: number;
    investmentDate: string;
    status: string;
 
}
export interface PortfolioSummary {
  totalOpportunities: number;
  draftOpportunities: number;
  approvedOpportunities: number;
  fundedOpportunities: number;
  totalFundingGoal: number;
  totalRaised: number;
  totalInvestors: number;
  averageFundingProgress: string;
}

export interface CreateInvestmentRequest {
  title: string;
  businessName: string;
  sector: string;
  location: string;
  fundingGoal: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;
  description: string;
  riskFactors?: string;
  useOfFunds?: string;
  businessPlan?: string;
  industry?: string;
}

export interface UpdateInvestmentRequest extends Partial<CreateInvestmentRequest> {
  status?: string;
}