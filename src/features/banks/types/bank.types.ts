// src/features/banks/types/bank.types.ts

// Main Bank Interface (Combined)
export interface Bank {
  _id: string; // MongoDB ID
  id: string; // Alias for _id (for compatibility)
  name: string; // Full bank name
  shortName: string; // Short name/code
  code: string; // Bank code
  logo?: string; // Logo URL
  website?: string; // Website URL
  description?: string; // Bank description
  category: "private" | "government"; // Bank type
  isGovernment: boolean; // Boolean version of category
  established: number; // Year established
  headquarters: string; // Headquarters location
  contactInfo?: {
    // Contact information
    address: string;
    phone: string;
    email: string;
  };
  exchangeRates: ExchangeRate[]; // Exchange rates
  rates: CurrencyRate[]; // Alias for exchangeRates (for compatibility)
  lastUpdated?: string; // Last update timestamp
}

// Exchange Rate for a specific bank
export interface ExchangeRate {
  currency: "USD" | "EUR" | "GBP" | "ETB" | string; // Support more currencies
  currencyCode: string; // Currency code (USD, EUR, etc.)
  currencyName: string; // Full currency name
  flag?: string; // Country flag emoji

  // Rate types
  buyingRate: number; // General buying rate
  sellingRate: number; // General selling rate
  cashBuying: number; // Cash buying rate
  cashSelling: number; // Cash selling rate
  transactionBuying: number; // Transaction buying rate
  transactionSelling: number; // Transaction selling rate

  // For backward compatibility
  cashBuyingRate?: number; // Alias for cashBuying
  cashSellingRate?: number; // Alias for cashSelling

  // Metadata
  lastUpdate: string; // Last update time
  lastUpdated?: string; // Alias for lastUpdate
  change: number; // Percentage change
  spread?: number; // Rate spread
}

// Aggregate Currency Rate (across all banks)
export interface CurrencyRate {
  currencyCode: string; // USD, EUR, etc.
  currencyName: string; // Full currency name
  flag?: string; // Country flag emoji

  // Averages
  averageBuying: number; // Average buying rate across banks
  averageSelling: number; // Average selling rate across banks

  // Best rates
  bestBuyingRate: number; // Best buying rate available
  bestSellingRate: number; // Best selling rate available
  bestBuyingBank?: string; // Bank with best buying rate
  bestSellingBank?: string; // Bank with best selling rate

  // Worst rates
  worstBuyingRate: number; // Worst buying rate
  worstSellingRate: number; // Worst selling rate

  // Statistics
  rateSpread: number; // Difference between best and worst
  totalBanks: number; // Number of banks offering this currency
  lastUpdated: string; // Last update time
  change: number; // Average percentage change
}

// API Response Types
export interface ExchangeRatesResponse {
  baseCurrency: "ETB"; // Base currency (always ETB)
  rates: {
    [key: string]: CurrencyRate; // Currency code -> rate data
  };
  lastUpdated: string; // Response timestamp
  totalBanks: number; // Total banks in system
}

export interface BankResponse {
  bank: Bank;
  rates: ExchangeRate[];
  lastUpdated: string;
}

export interface BanksListResponse {
  banks: Bank[];
  total: number;
  page?: number;
  limit?: number;
}

// Request/Params Types
export interface BankSearchParams {
  query: string; // Search query
  category?: "private" | "government" | "all"; // Filter by category
  limit?: number; // Pagination limit
  page?: number; // Pagination page
}

export interface CurrencyRatesParams {
  currencies?: string[]; // Filter by currencies
  sortBy?: "rate" | "bank" | "change"; // Sort field
  sortOrder?: "asc" | "desc"; // Sort order
}

// State Types
export interface BankState {
  // Data
  banks: Bank[]; // All banks
  selectedBank: Bank | null; // Currently selected bank
  bankDetails: Bank | null; // Detailed bank view
  exchangeRates: ExchangeRate[]; // Current bank's rates
  marketRates: ExchangeRatesResponse | null; // Market-wide rates

  // UI State
  loading: boolean; // Loading state
  error: string | null; // Error message
  searchQuery: string; // Current search
  selectedCurrency: string | null; // Selected currency filter
  categoryFilter: "private" | "government" | "all"; // Category filter

  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// Filter Types
export interface BankFilters {
  category?: "private" | "government" | "all";
  search?: string;
  hasRates?: boolean;
  currencies?: string[];
}

export interface RateFilters {
  currencies?: string[];
  minRate?: number;
  maxRate?: number;
  banks?: string[];
  rateType?: "buying" | "selling" | "cash" | "transaction";
}

// Chart/Visualization Types
export interface RateHistoryPoint {
  timestamp: string;
  buyingRate: number;
  sellingRate: number;
  bankId?: string;
  bankName?: string;
}

export interface RateHistoryResponse {
  currency: string;
  bankId?: string;
  history: RateHistoryPoint[];
  period: "day" | "week" | "month" | "year";
}

// Helper functions to convert between types
export const convertToBank = (data: any): Bank => {
  return {
    _id: data._id || data.id || "",
    id: data.id || data._id || "",
    name: data.name || "",
    shortName: data.shortName || data.code || "",
    code: data.code || data.shortName || "",
    logo: data.logo,
    website: data.website,
    description: data.description,
    category: data.isGovernment ? "government" : data.category || "private",
    isGovernment: data.isGovernment || data.category === "government",
    established: data.established || new Date().getFullYear(),
    headquarters: data.headquarters || "",
    contactInfo: data.contactInfo,
    exchangeRates: (data.exchangeRates || data.rates || []).map(
      convertToExchangeRate,
    ),
    rates: (data.rates || data.exchangeRates || []).map(convertToCurrencyRate),
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
};

export const convertToExchangeRate = (data: any): ExchangeRate => {
  return {
    currency: data.currency || data.currencyCode || "",
    currencyCode: data.currencyCode || data.currency || "",
    currencyName: data.currencyName || data.currency || "",
    flag: data.flag,

    buyingRate: data.buyingRate || data.cashBuying || 0,
    sellingRate: data.sellingRate || data.cashSelling || 0,
    cashBuying: data.cashBuying || data.cashBuyingRate || data.buyingRate || 0,
    cashSelling:
      data.cashSelling || data.cashSellingRate || data.sellingRate || 0,
    transactionBuying: data.transactionBuying || data.buyingRate || 0,
    transactionSelling: data.transactionSelling || data.sellingRate || 0,

    cashBuyingRate: data.cashBuyingRate || data.cashBuying || 0,
    cashSellingRate: data.cashSellingRate || data.cashSelling || 0,

    lastUpdate: data.lastUpdate || data.lastUpdated || new Date().toISOString(),
    lastUpdated:
      data.lastUpdated || data.lastUpdate || new Date().toISOString(),
    change: data.change || 0,
    spread: data.spread || 0,
  };
};

export const convertToCurrencyRate = (data: any): CurrencyRate => {
  return {
    currencyCode: data.currencyCode || data.currency || "",
    currencyName: data.currencyName || "",
    flag: data.flag,

    averageBuying: data.averageBuying || 0,
    averageSelling: data.averageSelling || 0,

    bestBuyingRate: data.bestBuyingRate || 0,
    bestSellingRate: data.bestSellingRate || 0,
    bestBuyingBank: data.bestBuyingBank,
    bestSellingBank: data.bestSellingBank,

    worstBuyingRate: data.worstBuyingRate || 0,
    worstSellingRate: data.worstSellingRate || 0,

    rateSpread: data.rateSpread || 0,
    totalBanks: data.totalBanks || 0,
    lastUpdated: data.lastUpdated || new Date().toISOString(),
    change: data.change || 0,
  };
};
