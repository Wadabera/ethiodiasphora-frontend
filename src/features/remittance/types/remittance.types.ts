// ==================== RATES ENDPOINT (/api/v1/remittance/rates) ====================

export interface RateEntry {
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
    USD: RateEntry[];
    EUR: RateEntry[];
    GBP?: RateEntry[];
  };
  lastUpdated: string;
}

// ==================== COMPARE ENDPOINT (/api/v1/remittance/compare) ====================

export interface CompareProvider {
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
  rateType?: "buying_rate" | "selling_rate";
}

export interface CompareResponse {
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  internationalProviders: CompareProvider[];
  ethiopianBanks: CompareProvider[];
  allOptions: {
    type: string;
    provider: string;
    amountReceived: number;
  }[];
  bestOption: {
    type: string;
    provider: string;
    exchangeRate: number;
    amountReceived: number;
  };
  marketInsights: {
    bestInternational: {
      provider: string;
      amountReceived: number;
    };
    bestBank: {
      provider: string;
      amountReceived: number;
    };
    savings: number;
  };
  lastUpdated: string;
}

// ==================== PROVIDERS ENDPOINT (/api/v1/remittance/providers) ====================

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
}

// ==================== PROVIDER DETAILS ENDPOINT (/api/v1/remittance/providers/:provider) ====================

export interface ProviderDetail {
  provider: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  fee: number;
  feeType: "fixed" | "percentage" | "none";
  deliveryMethod: string;
  deliveryTime: string;
  lastUpdated?: string;
}

// ==================== UI TYPES ====================

export interface CalculatorInput {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  deliveryMethod: string;
}

export interface RemittanceFilters {
  type?: "international_provider" | "ethiopian_bank" | "all";
  provider?: string[];
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
  rating?: number;
  isBest?: boolean;
}
