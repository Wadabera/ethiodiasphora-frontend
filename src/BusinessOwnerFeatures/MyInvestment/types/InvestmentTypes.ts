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
  fundingGoal: number;
  currentFunding: number;
  fundingProgress: string;
  remainingAmount: number;
  isFullyFunded: boolean;
  totalInvestors: number;
  investorsDetails: InvestorDetail[];
  businessName?: string;
  description?: string;
  expectedReturn?: number;
  investmentPeriod?: number;
  minimumInvestment?: number;
  maxInvestment?: number;
  riskFactors?: string;
  sector?: string;
  location?: string;
  status?: string;
  createdAt?: string;
  businessOwnerId?: string;
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
  industry: string;
  sector: string;
  description: string;
  fundingGoal: number;
  expectedReturn: number;
  investmentPeriod: number;
  minimumInvestment: number;
  maxInvestment?: number;
  riskFactors: string;
  businessPlan: string;
  useOfFunds: string;
  location: string;
}

// No UpdateInvestmentRequest needed since you don't have update endpoint
// No Delete endpoint either
