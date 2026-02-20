// features/remittance/types/remittance.types.ts
export type Currency = "USD" | "EUR" | "GBP" | "AED" | "CAD" | "SAR";
export type DeliveryMethod = "bank_transfer" | "cash_pickup" | "mobile_money";
export type FeeType = "fixed" | "percentage";

export interface RemittanceRate {
  provider: string;
  providerLogo?: string;
  exchangeRate: number;
  fee: number;
  feeType: FeeType;
  deliveryMethod: DeliveryMethod;
  deliveryTime: string;
  lastUpdated: string;
  minAmount?: number;
  maxAmount?: number;
  rating?: number;
  totalReviews?: number;
}

export interface RemittanceRatesResponse {
  toCurrency: "ETB";
  rates: {
    [key in Currency]?: RemittanceRate[];
  };
  lastUpdated: string;
}

export interface RemittanceProvider {
  provider: string;
  fromCurrency: Currency;
  toCurrency: "ETB";
  exchangeRate: number;
  fee: number;
  feeType: FeeType;
  deliveryMethod: DeliveryMethod;
  deliveryTime: string;
  minAmount?: number;
  maxAmount?: number;
  logo?: string;
}

export interface RemittanceCalculation {
  sendAmount: number;
  receiveAmount: number;
  fee: number;
  exchangeRate: number;
  provider: string;
  deliveryMethod: DeliveryMethod;
  deliveryTime: string;
}
