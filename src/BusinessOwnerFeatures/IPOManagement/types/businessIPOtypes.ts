import type{ IPO, IPOFilters,  } from "../../../types";
export type IPOStatus =
  | "pending_approval" // Business owner submitted, awaiting admin review
  | "announced" // Admin approved, visible to investors but not open
  | "open" // Open for subscription during defined period
  | "closed" // Subscription period ended, awaiting allotment
  | "allotted" // Shares allocated to investors
  | "listed" // Trading on exchange
  | "rejected";    
export interface CreateIPORequest {
  symbol: string;
  offerPrice: number;
  startDate: string;
  endDate: string;
  prospectusUrl: string;
  totalShares: number;
  minimumLot: number;
  maximumLot: number;
  faceValue: number;
  lotSize: number;
  issueSize: number;
  description: string;
  sector?: string;
  industry?: string;
  status?: IPOStatus;
  ipoType?: "fresh_issue" | "offer_for_sale";
}

export interface BusinessIPOStats {
  totalIPOs: number;
  pendingApproval: number;
  announced: number;
  open: number;
  closed: number;
  allotted: number;
  listed: number;
  rejected: number;
  totalSubscribed: number;
  totalRaised: number;
}

export interface BusinessIPOResponse {
  data: IPO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export type BusinessIPOAPIResponse = IPO[];
export type { IPO, IPOFilters };
