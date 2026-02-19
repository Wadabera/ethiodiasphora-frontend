// features/ipo/types/ipo.types.ts
export interface IPO {
  _id: string;
  companyName: string;
  companyId: string;
  businessOwnerId: string;

  // IPO Details
  symbol: string;
  totalShares: number;
  pricePerShare: number;
  minimumShares: number;
  maximumShares?: number;

  // Financials
  totalValue: number;
  raisedAmount: number;

  // Dates
  openingDate: string;
  closingDate: string;
  listingDate?: string;

  // Status
  status: "pending" | "approved" | "open" | "closed" | "allotted" | "listed";

  // Documents
  prospectus: string;
  financialReports: string[];

  // Statistics
  subscriptionCount: number;
  totalSubscribedShares: number;
  oversubscriptionRate: number;
  allotmentRatio?: number;

  createdAt: string;
  updatedAt: string;
}

export interface IPOSubscription {
  _id: string;
  ipoId: string;
  investorId: string;
  investorName: string;

  // Subscription Details
  requestedShares: number;
  requestedAmount: number;

  // Allotment Results
  allottedShares: number;
  allottedAmount: number;
  refundAmount: number;

  status: "pending" | "allotted" | "refunded";
  subscriptionDate: string;
}

export interface IPOCreateDTO {
  companyName: string;
  symbol: string;
  totalShares: number;
  pricePerShare: number;
  minimumShares: number;
  maximumShares?: number;
  openingDate: string;
  closingDate: string;
  prospectus: string;
}
