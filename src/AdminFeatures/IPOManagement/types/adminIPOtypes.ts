import type {
  IPO,
  IPOStatus,
  IPOFilters,
  PaginatedResponse,
} from "../../../types";

export interface AdminIPO extends IPO {
  // Admin-specific fields
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

  // Business owner info
  businessOwner: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
}

export interface AdminIPOStats {
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
  totalApplications: number;
  averageSubscriptionRatio: number;
  bySector: Array<{
    sector: string;
    count: number;
    totalValue: number;
  }>;
}

export interface ApproveIPORequest {
  ipoId: string;
  notes: string;
  approved: true;
}

export interface RejectIPORequest {
  ipoId: string;
  reason: string;
  notes?: string;
}

export interface OpenIPORequest {
  ipoId: string;
  openDate?: string;
}

export interface CloseIPORequest {
  ipoId: string;
  closeDate?: string;
}

export interface AllotmentRequest {
  ipoId: string;
  method: "proportional" | "lottery" | "priority";
  notes?: string;
}

export interface AllotmentResponse {
  message: string;
  ipo: AdminIPO;
  summary: {
    totalSubscriptions: number;
    totalSharesRequested: number;
    totalSharesAllotted: number;
    allotmentRatio: number;
    totalRefundAmount: number;
    notificationsSent: number;
  };
}

export interface ListStockRequest {
  ipoId: string;
  listingPrice: number;
  exchange: string;
  listingDate?: string;
}

export interface AdminIPOResponse extends PaginatedResponse<AdminIPO> {}

export type { IPOStatus, IPOFilters };
