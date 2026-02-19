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
