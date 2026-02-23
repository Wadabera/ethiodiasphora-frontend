// src/features/currency/types/currency.types.ts
export interface BankRate {
  bankId: string;
  bankName: string;
  bankLogo?: string;
  buyingRate: number;
  sellingRate: number;
  cashBuying: number;
  cashSelling: number;
  lastUpdate: string;
  change: number;
}

export interface Currency {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  icon?: string;
}

export interface CurrencyDetail {
  currency: Currency;
  averageRate: {
    buying: number;
    selling: number;
  };
  bestRate: {
    buying: { bank: string; rate: number };
    selling: { bank: string; rate: number };
  };
  bankRates: BankRate[];
  totalVolume: number;
  trend: "up" | "down" | "stable";
}

export interface CurrencyState {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  currencyDetails: CurrencyDetail | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  lastUpdated: string;
}
