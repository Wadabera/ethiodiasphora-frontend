// features/banks/types/bank.types.ts
export interface ExchangeRate {
  currency: "USD" | "EUR" | "GBP" | "ETB";
  buyingRate: number;
  sellingRate: number;
  cashBuyingRate: number;
  cashSellingRate: number;
  lastUpdated: string;
}

export interface Bank {
  _id: string;
  name: string;
  code: string;
  logo?: string;
  website?: string;
  description?: string;
  isGovernment: boolean;
  exchangeRates: ExchangeRate[];
  contactInfo?: {
    address: string;
    phone: string;
    email: string;
  };
}

export interface CurrencyRate {
  averageBuying: number;
  averageSelling: number;
  bestBuyingRate: number;
  worstBuyingRate: number;
  rateSpread: number;
  totalBanks: number;
}

export interface ExchangeRatesResponse {
  baseCurrency: "ETB";
  rates: {
    [key: string]: CurrencyRate;
  };
  lastUpdated: string;
}

export interface BankSearchParams {
  query: string;
}
