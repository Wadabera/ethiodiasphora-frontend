// src/features/remittance/types/remittance.types.ts
export interface ExchangeRate {
  provider: string;
  exchangeRate: number;
  fee: number;
  feeType: "fixed" | "percentage" | "none";
  deliveryMethod: string;
  deliveryTime: string;
  lastUpdated: string;
}

export interface RatesResponse {
  toCurrency: string;
  rates: {
    [key: string]: ExchangeRate[];
  };
  lastUpdated: string;
}

export interface ProviderRate {
  type: "international_provider" | "ethiopian_bank";
  provider: string;
  exchangeRate: number;
  fee: number;
  feeType: "fixed" | "percentage" | "none";
  amountReceived: number;
  deliveryMethod: string;
  deliveryTime: string;
  lastUpdated: string;
  logo?: string;
  rateType?: "buying_rate" | "selling_rate" | "transaction_rate";
  // Bank specific rates
  cashBuying?: number;
  cashSelling?: number;
  transactionBuying?: number;
  transactionSelling?: number;
}

export interface CompareResponse {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  internationalProviders: ProviderRate[];
  ethiopianBanks: ProviderRate[];
  allOptions: Array<{
    type: string;
    provider: string;
    amountReceived: number;
  }>;
  bestOption: {
    type: string;
    provider: string;
    exchangeRate: number;
    amountReceived: number;
  };
  marketInsights: {
    bestInternational: { provider: string; amountReceived: number };
    bestBank: { provider: string; amountReceived: number };
    savings: number;
  };
  lastUpdated: string;
}

export interface ProviderBasic {
  provider: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  fee: number;
  feeType: "fixed" | "percentage" | "none";
  deliveryMethod: string;
  deliveryTime: string;
  lastUpdated: string;
  logo?: string;
}

export interface ProviderDetail extends ProviderBasic {
  // Additional provider details
  description?: string;
  rating?: number;
  totalTransfers?: number;
}

export interface CalculatorInput {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  deliveryMethod: string;
}

export interface RemittanceFilters {
  type: "all" | "international" | "banks";
  provider?: string;
  minRate?: number;
  maxFee?: number;
}

export interface DisplayProvider {
  id: string;
  name: string;
  type: "international_provider" | "ethiopian_bank";
  logo?: string;
  exchangeRate: number;
  fee: number;
  feeType: "fixed" | "percentage" | "none";
  amountReceived: number;
  deliveryMethod: string;
  deliveryTime: string;
  rating: number;
  isBest: boolean;
  // Bank specific fields
  cashBuying?: number;
  cashSelling?: number;
  transactionBuying?: number;
  transactionSelling?: number;
  cashBuyingETB?: number;
  cashSellingETB?: number;
  transactionBuyingETB?: number;
  transactionSellingETB?: number;
}

export interface RemittanceProvider {
  provider: string;
  name?: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  fee: number;
  feeType: "fixed" | "percentage" | "none";
  deliveryMethod: string;
  deliveryTime: string;
  lastUpdated: string;
  logo?: string;
}

export interface RemittanceState {
  ratesData: RatesResponse | null;
  compareData: CompareResponse | null;
  providersList: ProviderBasic[];
  providerDetails: ProviderDetail[] | null;
  loading: boolean;
  error: string | null;
  selectedProvider: RemittanceProvider | null;
  displayProviders: DisplayProvider[];
  calculatorInput: CalculatorInput;
  filters: RemittanceFilters;
  viewMode: "card" | "table";
}
