// features/ipo/types/ipo.types.ts
export interface IPO {
  _id: string;
  companyName: string;
  companyId?: string;
  businessOwnerId?: string;
  createdBy?: string;

  // IPO Details
  symbol: string;
  totalShares: number;
  pricePerShare?: number;
  offerPrice?: number;
  lotSize?: number;
  minimumLot?: number;
  maximumLot?: number;
  minimumShares?: number;
  maximumShares?: number;
  faceValue?: number;

  // Financials
  totalValue?: number;
  issueSize?: number;
  raisedAmount?: number;

  // Dates
  openingDate?: string;
  closingDate?: string;
  startDate?: string;
  endDate?: string;
  listingDate?: string;

  // Status
  status: "pending" | "pending_approval" | "approved" | "announced" | "open" | "closed" | "allotted" | "listed" | "rejected";

  // Documents
  prospectus?: string;
  prospectusUrl?: string;
  financialReports?: string[];

  // Statistics
  subscriptionCount?: number;
  totalApplications?: number;
  totalSubscribed?: number;
  totalSubscribedShares?: number;
  oversubscriptionRate?: number;
  subscriptionRatio?: number;
  allotmentRatio?: string | number;

  sector?: string;
  industry?: string;
  description?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface IPOSubscription {
  _id: string;
  ipoId: string;
  userId?: string;
  investorId?: string;
  investorName?: string;
  symbol?: string;
  companyName?: string;

  // Subscription Details
  quantity?: number;
  lots?: number;
  pricePerShare?: number;
  totalAmount?: number;
  requestedShares?: number;
  requestedAmount?: number;

  // Allotment Results
  allottedShares?: number;
  allottedAmount?: number;
  refundAmount?: number;

  status: "pending" | "allotted" | "refunded" | "approved" | "rejected";
  applicationNumber?: string;
  subscriptionDate?: string;
  createdAt?: string;
}

export interface IPOCreateDTO {
  companyName: string;
  symbol: string;
  totalShares: number;
  pricePerShare?: number;
  offerPrice?: number;
  minimumShares?: number;
  maximumShares?: number;
  minimumLot?: number;
  maximumLot?: number;
  lotSize?: number;
  openingDate?: string;
  closingDate?: string;
  startDate?: string;
  endDate?: string;
  prospectus?: string;
  prospectusUrl?: string;
}
