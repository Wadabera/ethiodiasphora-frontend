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
  businessName: string;
  sector: string;
  location: string;
  fundingGoal: number;
  currentFunding: number;
  fundingProgress: string;
  remainingAmount: number;
  minimumInvestment: number;
  expectedReturn: number;
  investmentPeriod: number;
  status:
    | "draft"
    | "pending"
    | "published"
    | "active"
    | "completed"
    | "rejected";
  isFullyFunded: boolean;
  totalInvestors: number;
  investorsDetails?: InvestorDetail[];
  description?: string;
  riskFactors?: string;
  useOfFunds?: string;
  businessPlan?: string;
  isVerified?: boolean;
  businessOwnerId?: string | { _id: string; email: string };
  investments?: Array<{
    investorId: string | { _id: string; email: string };
    amount: number;
    investmentDate: string;
    status: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
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
}

export interface UpdateInvestmentRequest extends Partial<CreateInvestmentRequest> {
  status?: string;
}
