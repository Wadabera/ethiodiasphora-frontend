import type{
  RatesResponse,
  CompareResponse,
  ProviderBasic,
  ProviderDetail,
} from "../types/remittance.types";

// Mock data for /api/v1/remittance/rates
export const mockRatesResponse: RatesResponse = {
  toCurrency: "ETB",
  rates: {
    USD: [
      {
        provider: "WorldRemit",
        exchangeRate: 55.5,
        fee: 4.99,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-2 hours",
        lastUpdated: new Date().toISOString(),
      },
      {
        provider: "Western Union",
        exchangeRate: 55.25,
        fee: 8.0,
        feeType: "fixed",
        deliveryMethod: "cash_pickup",
        deliveryTime: "minutes",
        lastUpdated: new Date().toISOString(),
      },
      {
        provider: "MoneyGram",
        exchangeRate: 55.3,
        fee: 15.0,
        feeType: "percentage",
        deliveryMethod: "mobile_wallet",
        deliveryTime: "30 minutes",
        lastUpdated: new Date().toISOString(),
      },
      {
        provider: "Abay Bank S.C.",
        exchangeRate: 131.0083,
        fee: 0,
        feeType: "none",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-3 business days",
        lastUpdated: new Date().toISOString(),
      },
      {
        provider: "Awash Bank S.C.",
        exchangeRate: 131.0071,
        fee: 0,
        feeType: "none",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-3 business days",
        lastUpdated: new Date().toISOString(),
      },
      {
        provider: "Commercial Bank of Ethiopia",
        exchangeRate: 130.85,
        fee: 0,
        feeType: "none",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-3 business days",
        lastUpdated: new Date().toISOString(),
      },
    ],
    EUR: [
      {
        provider: "WorldRemit",
        exchangeRate: 60.25,
        fee: 3.99,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-2 hours",
        lastUpdated: new Date().toISOString(),
      },
      {
        provider: "Abay Bank S.C.",
        exchangeRate: 142.15,
        fee: 0,
        feeType: "none",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-3 business days",
        lastUpdated: new Date().toISOString(),
      },
    ],
  },
  lastUpdated: new Date().toISOString(),
};

// Mock data for /api/v1/remittance/compare?from=USD&amount=1000
export const mockCompareResponse: CompareResponse = {
  fromCurrency: "USD",
  toCurrency: "ETB",
  sendAmount: 1000,
  internationalProviders: [
    {
      type: "international_provider",
      provider: "WorldRemit",
      exchangeRate: 55.5,
      fee: 4.99,
      feeType: "fixed",
      amountReceived: (1000 - 4.99) * 55.5,
      deliveryMethod: "bank_transfer",
      deliveryTime: "1-2 hours",
      lastUpdated: new Date().toISOString(),
    },
    {
      type: "international_provider",
      provider: "Western Union",
      exchangeRate: 55.25,
      fee: 8.0,
      feeType: "fixed",
      amountReceived: (1000 - 8) * 55.25,
      deliveryMethod: "cash_pickup",
      deliveryTime: "minutes",
      lastUpdated: new Date().toISOString(),
    },
    {
      type: "international_provider",
      provider: "MoneyGram",
      exchangeRate: 55.3,
      fee: 15.0,
      feeType: "percentage",
      amountReceived: (1000 - 1000 * 0.15) * 55.3,
      deliveryMethod: "mobile_wallet",
      deliveryTime: "30 minutes",
      lastUpdated: new Date().toISOString(),
    },
  ],
  ethiopianBanks: [
    {
      type: "ethiopian_bank",
      provider: "Abay Bank S.C.",
      exchangeRate: 131.0083,
      fee: 0,
      feeType: "none",
      amountReceived: 1000 * 131.0083,
      deliveryMethod: "bank_transfer",
      deliveryTime: "1-3 business days",
      lastUpdated: new Date().toISOString(),
      logo: "/assets/banks/abay-bank.png",
      rateType: "buying_rate",
    },
    {
      type: "ethiopian_bank",
      provider: "Awash Bank S.C.",
      exchangeRate: 131.0071,
      fee: 0,
      feeType: "none",
      amountReceived: 1000 * 131.0071,
      deliveryMethod: "bank_transfer",
      deliveryTime: "1-3 business days",
      lastUpdated: new Date().toISOString(),
      logo: "/assets/banks/awash-bank.png",
      rateType: "buying_rate",
    },
    {
      type: "ethiopian_bank",
      provider: "Commercial Bank of Ethiopia",
      exchangeRate: 130.85,
      fee: 0,
      feeType: "none",
      amountReceived: 1000 * 130.85,
      deliveryMethod: "bank_transfer",
      deliveryTime: "1-3 business days",
      lastUpdated: new Date().toISOString(),
      logo: "/assets/banks/cbe.png",
      rateType: "buying_rate",
    },
  ],
  allOptions: [
    {
      type: "ethiopian_bank",
      provider: "Abay Bank S.C.",
      amountReceived: 1000 * 131.0083,
    },
    {
      type: "ethiopian_bank",
      provider: "Awash Bank S.C.",
      amountReceived: 1000 * 131.0071,
    },
    {
      type: "international_provider",
      provider: "WorldRemit",
      amountReceived: (1000 - 4.99) * 55.5,
    },
  ],
  bestOption: {
    type: "ethiopian_bank",
    provider: "Abay Bank S.C.",
    exchangeRate: 131.0083,
    amountReceived: 1000 * 131.0083,
  },
  marketInsights: {
    bestInternational: {
      provider: "WorldRemit",
      amountReceived: (1000 - 4.99) * 55.5,
    },
    bestBank: {
      provider: "Abay Bank S.C.",
      amountReceived: 1000 * 131.0083,
    },
    savings: 1000 * 131.0083 - (1000 - 4.99) * 55.5,
  },
  lastUpdated: new Date().toISOString(),
};

// Mock data for /api/v1/remittance/providers
export const mockProvidersResponse: ProviderBasic[] = [
  {
    provider: "WorldRemit",
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: 55.5,
    fee: 4.99,
    feeType: "fixed",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-2 hours",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "WorldRemit",
    fromCurrency: "EUR",
    toCurrency: "ETB",
    exchangeRate: 60.25,
    fee: 3.99,
    feeType: "fixed",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-2 hours",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "Western Union",
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: 55.25,
    fee: 8.0,
    feeType: "fixed",
    deliveryMethod: "cash_pickup",
    deliveryTime: "minutes",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "Abay Bank S.C.",
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: 131.0083,
    fee: 0,
    feeType: "none",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-3 business days",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "Abay Bank S.C.",
    fromCurrency: "EUR",
    toCurrency: "ETB",
    exchangeRate: 142.15,
    fee: 0,
    feeType: "none",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-3 business days",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "Awash Bank S.C.",
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: 131.0071,
    fee: 0,
    feeType: "none",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-3 business days",
    lastUpdated: new Date().toISOString(),
  },
];

// Mock data for /api/v1/remittance/providers/WorldRemit
export const mockProviderDetailsResponse: ProviderDetail[] = [
  {
    provider: "WorldRemit",
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: 55.5,
    fee: 4.99,
    feeType: "fixed",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-2 hours",
  },
  {
    provider: "WorldRemit",
    fromCurrency: "EUR",
    toCurrency: "ETB",
    exchangeRate: 60.25,
    fee: 3.99,
    feeType: "fixed",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-2 hours",
  },
  {
    provider: "WorldRemit",
    fromCurrency: "GBP",
    toCurrency: "ETB",
    exchangeRate: 70.15,
    fee: 4.99,
    feeType: "fixed",
    deliveryMethod: "bank_transfer",
    deliveryTime: "1-2 hours",
  },
];

// Helper function to get unique providers list
export const getUniqueProviders = () => {
  const providers = new Set();
  mockRatesResponse.rates.USD.forEach((rate) => providers.add(rate.provider));
  mockRatesResponse.rates.EUR.forEach((rate) => providers.add(rate.provider));
  return Array.from(providers);
};

// Helper to get provider type
export const getProviderType = (
  providerName: string,
): "international_provider" | "ethiopian_bank" => {
  const banks = [
    "Abay Bank S.C.",
    "Awash Bank S.C.",
    "Commercial Bank of Ethiopia",
  ];
  return banks.includes(providerName)
    ? "ethiopian_bank"
    : "international_provider";
};
