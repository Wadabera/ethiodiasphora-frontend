// InvestorFeatures/IPOInvesting/types/investorIPO.types.ts

import {type IPO } from "../../../types/index";

export interface InvestorIPO extends IPO {
  isSubscribed?: boolean;
  mySubscription?: InvestorSubscription;
}

export interface InvestorSubscription {
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
  status: "pending" | "allotted" | "partial" | "rejected" | "cancelled";
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

export interface SubscribeRequest {
  ipoId: string;
  quantity: number;
  bidPrice?: number; // For optional bidding above offer price
}

export interface SubscriptionSummary {
  totalSubscriptions: number;
  totalInvested: number;
  pendingSubscriptions: number;
  allottedSubscriptions: number;
  totalRefund: number;
  totalValue?: number; // Current market value if listed
}

export interface BrowseFilters {
  status?: "announced" | "open" | "closed" | "listed";
  sector?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
  limit: number;
}

export interface BrowseResponse {
  data: InvestorIPO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubscriptionsResponse {
  data: InvestorSubscription[];
  summary: SubscriptionSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
