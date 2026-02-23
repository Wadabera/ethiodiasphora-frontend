// src/features/remittance/services/mockRemittanceData.ts
import type {
  RatesResponse,
  CompareResponse,
  ProviderBasic,
  ProviderDetail,
} from "../types/remittance.types";

// World currencies
export const worldCurrencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$", baseRate: 131.25 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€", baseRate: 142.18 },
  {
    code: "GBP",
    name: "British Pound",
    flag: "🇬🇧",
    symbol: "£",
    baseRate: 165.42,
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    flag: "🇨🇦",
    symbol: "C$",
    baseRate: 96.84,
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    flag: "🇦🇺",
    symbol: "A$",
    baseRate: 87.23,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    flag: "🇯🇵",
    symbol: "¥",
    baseRate: 0.89,
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    flag: "🇨🇳",
    symbol: "¥",
    baseRate: 18.15,
  },
  {
    code: "INR",
    name: "Indian Rupee",
    flag: "🇮🇳",
    symbol: "₹",
    baseRate: 1.58,
  },
  {
    code: "AED",
    name: "UAE Dirham",
    flag: "🇦🇪",
    symbol: "د.إ",
    baseRate: 35.72,
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    flag: "🇸🇦",
    symbol: "﷼",
    baseRate: 34.98,
  },
];

// Ethiopian Banks with detailed rates
export const ethiopianBanks = [
  {
    name: "Abay Bank S.C.",
    logo: "https://logo.clearbit.com/abaybank.com",
    rate: 131.15,
    cashBuying: 10268.0,
    cashSelling: 10473.36,
    transactionBuying: 10244.17,
    transactionSelling: 10449.05,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Addis International Bank",
    logo: "https://logo.clearbit.com/addisbank.com",
    rate: 130.88,
    cashBuying: 10246.61,
    cashSelling: 10451.54,
    transactionBuying: 10246.61,
    transactionSelling: 10451.54,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Ahadu Bank S.C.",
    logo: "https://logo.clearbit.com/ahadubank.com",
    rate: 130.75,
    cashBuying: 10196.32,
    cashSelling: 10400.25,
    transactionBuying: 10196.32,
    transactionSelling: 10400.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Amhara Bank S.C.",
    logo: "https://logo.clearbit.com/amharabank.com",
    rate: 130.95,
    cashBuying: 10278.61,
    cashSelling: 10484.18,
    transactionBuying: 10278.61,
    transactionSelling: 10484.18,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Awash Bank",
    logo: "https://logo.clearbit.com/awashbank.com",
    rate: 131.01,
    cashBuying: 10268.0,
    cashSelling: 10473.36,
    transactionBuying: 10244.17,
    transactionSelling: 10449.05,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Bank of Abyssinia",
    logo: "https://logo.clearbit.com/bankofabyssinia.com",
    rate: 130.95,
    cashBuying: 10246.61,
    cashSelling: 10451.54,
    transactionBuying: 10246.61,
    transactionSelling: 10451.54,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Berhan Bank",
    logo: "https://logo.clearbit.com/berhanbank.com",
    rate: 130.82,
    cashBuying: 10216.32,
    cashSelling: 10420.25,
    transactionBuying: 10216.32,
    transactionSelling: 10420.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Bunna Bank",
    logo: "https://logo.clearbit.com/bunnabank.com",
    rate: 130.79,
    cashBuying: 10206.32,
    cashSelling: 10410.25,
    transactionBuying: 10206.32,
    transactionSelling: 10410.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Commercial Bank of Ethiopia",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/Commercial_Bank_of_Ethiopia_logo.svg/1200px-Commercial_Bank_of_Ethiopia_logo.svg.png",
    rate: 130.85,
    cashBuying: 10226.32,
    cashSelling: 10430.25,
    transactionBuying: 10226.32,
    transactionSelling: 10430.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Cooperative Bank of Oromia",
    logo: "https://logo.clearbit.com/coopbankoromia.com.et",
    rate: 130.77,
    cashBuying: 10186.32,
    cashSelling: 10390.25,
    transactionBuying: 10186.32,
    transactionSelling: 10390.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Dashen Bank",
    logo: "https://logo.clearbit.com/dashenbank.com",
    rate: 131.15,
    cashBuying: 10276.61,
    cashSelling: 10481.54,
    transactionBuying: 10276.61,
    transactionSelling: 10481.54,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Enat Bank",
    logo: "https://logo.clearbit.com/enatbank.com",
    rate: 130.71,
    cashBuying: 10166.32,
    cashSelling: 10370.25,
    transactionBuying: 10166.32,
    transactionSelling: 10370.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Goh Betoch Bank",
    logo: "https://logo.clearbit.com/gohbank.com",
    rate: 130.68,
    cashBuying: 10156.32,
    cashSelling: 10360.25,
    transactionBuying: 10156.32,
    transactionSelling: 10360.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Hibret Bank",
    logo: "https://logo.clearbit.com/hibretbank.com.et",
    rate: 130.92,
    cashBuying: 10236.32,
    cashSelling: 10440.25,
    transactionBuying: 10236.32,
    transactionSelling: 10440.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Lion International Bank",
    logo: "https://logo.clearbit.com/lionbanket.com",
    rate: 130.73,
    cashBuying: 10176.32,
    cashSelling: 10380.25,
    transactionBuying: 10176.32,
    transactionSelling: 10380.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "NIB International Bank",
    logo: "https://logo.clearbit.com/nibbank.com",
    rate: 130.88,
    cashBuying: 10226.32,
    cashSelling: 10430.25,
    transactionBuying: 10226.32,
    transactionSelling: 10430.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Oromia Bank",
    logo: "https://logo.clearbit.com/oromiabank.com",
    rate: 130.89,
    cashBuying: 10236.32,
    cashSelling: 10440.25,
    transactionBuying: 10236.32,
    transactionSelling: 10440.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Sidama Bank",
    logo: "https://logo.clearbit.com/sidamabank.com",
    rate: 130.69,
    cashBuying: 10146.32,
    cashSelling: 10350.25,
    transactionBuying: 10146.32,
    transactionSelling: 10350.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Siingee Bank",
    logo: "https://logo.clearbit.com/siingeebank.com",
    rate: 130.66,
    cashBuying: 10136.32,
    cashSelling: 10340.25,
    transactionBuying: 10136.32,
    transactionSelling: 10340.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Tsehay Bank",
    logo: "https://logo.clearbit.com/tsehaybank.com.et",
    rate: 130.87,
    cashBuying: 10216.32,
    cashSelling: 10420.25,
    transactionBuying: 10216.32,
    transactionSelling: 10420.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Tsedey Bank",
    logo: "https://logo.clearbit.com/tsedeybank.com",
    rate: 130.81,
    cashBuying: 10206.32,
    cashSelling: 10410.25,
    transactionBuying: 10206.32,
    transactionSelling: 10410.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "United Bank",
    logo: "https://logo.clearbit.com/unitedbank.com.et",
    rate: 130.83,
    cashBuying: 10196.32,
    cashSelling: 10400.25,
    transactionBuying: 10196.32,
    transactionSelling: 10400.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Wegagen Bank",
    logo: "https://logo.clearbit.com/wegagen.com",
    rate: 130.78,
    cashBuying: 10186.32,
    cashSelling: 10390.25,
    transactionBuying: 10186.32,
    transactionSelling: 10390.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "ZamZam Bank",
    logo: "https://logo.clearbit.com/zamzambank.com",
    rate: 130.72,
    cashBuying: 10166.32,
    cashSelling: 10370.25,
    transactionBuying: 10166.32,
    transactionSelling: 10370.25,
    deliveryTime: "1-3 business days",
  },
  {
    name: "Zemen Bank",
    logo: "https://logo.clearbit.com/zemenbank.com",
    rate: 130.93,
    cashBuying: 10246.61,
    cashSelling: 10451.54,
    transactionBuying: 10246.61,
    transactionSelling: 10451.54,
    deliveryTime: "1-3 business days",
  },
];

// International Providers
export const internationalProviders = [
  {
    name: "WorldRemit",
    logo: "https://logo.clearbit.com/worldremit.com",
    rate: 55.5,
    fee: 4.99,
    feeType: "fixed" as const,
    deliveryTime: "1-2 hours",
    rating: 4.5,
  },
  {
    name: "Western Union",
    logo: "https://logo.clearbit.com/westernunion.com",
    rate: 55.25,
    fee: 8.0,
    feeType: "fixed" as const,
    deliveryTime: "minutes",
    rating: 4.3,
  },
  {
    name: "MoneyGram",
    logo: "https://logo.clearbit.com/moneygram.com",
    rate: 55.3,
    fee: 15.0,
    feeType: "percentage" as const,
    deliveryTime: "30 minutes",
    rating: 4.2,
  },
  {
    name: "Remitly",
    logo: "https://logo.clearbit.com/remitly.com",
    rate: 55.45,
    fee: 3.99,
    feeType: "fixed" as const,
    deliveryTime: "2-3 hours",
    rating: 4.6,
  },
  {
    name: "PayPal",
    logo: "https://logo.clearbit.com/paypal.com",
    rate: 54.95,
    fee: 5.99,
    feeType: "fixed" as const,
    deliveryTime: "1-2 days",
    rating: 4.4,
  },
  {
    name: "Wise",
    logo: "https://logo.clearbit.com/wise.com",
    rate: 55.6,
    fee: 4.5,
    feeType: "fixed" as const,
    deliveryTime: "1-2 hours",
    rating: 4.7,
  },
];

// Mock data for /api/v1/remittance/rates
export const mockRatesResponse: RatesResponse = {
  toCurrency: "ETB",
  rates: {
    USD: [
      ...internationalProviders.map((p) => ({
        provider: p.name,
        exchangeRate: p.rate,
        fee: p.fee,
        feeType: p.feeType,
        deliveryMethod: "bank_transfer",
        deliveryTime: p.deliveryTime,
        lastUpdated: new Date().toISOString(),
      })),
      ...ethiopianBanks.map((b) => ({
        provider: b.name,
        exchangeRate: b.rate,
        fee: 0,
        feeType: "none" as const,
        deliveryMethod: "bank_transfer",
        deliveryTime: b.deliveryTime,
        lastUpdated: new Date().toISOString(),
      })),
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
      ...ethiopianBanks.slice(0, 10).map((b) => ({
        provider: b.name,
        exchangeRate: b.rate * 1.08,
        fee: 0,
        feeType: "none" as const,
        deliveryMethod: "bank_transfer",
        deliveryTime: b.deliveryTime,
        lastUpdated: new Date().toISOString(),
      })),
    ],
  },
  lastUpdated: new Date().toISOString(),
};

// Mock data for /api/v1/remittance/providers
export const mockProvidersResponse: ProviderBasic[] = [
  ...internationalProviders.map((p) => ({
    provider: p.name,
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: p.rate,
    fee: p.fee,
    feeType: p.feeType,
    deliveryMethod: "bank_transfer",
    deliveryTime: p.deliveryTime,
    lastUpdated: new Date().toISOString(),
    logo: p.logo,
  })),
  ...ethiopianBanks.map((b) => ({
    provider: b.name,
    fromCurrency: "USD",
    toCurrency: "ETB",
    exchangeRate: b.rate,
    fee: 0,
    feeType: "none" as const,
    deliveryMethod: "bank_transfer",
    deliveryTime: b.deliveryTime,
    lastUpdated: new Date().toISOString(),
    logo: b.logo,
  })),
];

// Mock data for /api/v1/remittance/providers/:provider
export const mockProviderDetailsResponse: Record<string, ProviderDetail[]> = {
  WorldRemit: [
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
      logo: "https://logo.clearbit.com/worldremit.com",
      description: "Fast and reliable international money transfers",
      rating: 4.5,
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
      logo: "https://logo.clearbit.com/worldremit.com",
    },
  ],
  "Commercial Bank of Ethiopia": [
    {
      provider: "Commercial Bank of Ethiopia",
      fromCurrency: "USD",
      toCurrency: "ETB",
      exchangeRate: 130.85,
      fee: 0,
      feeType: "none",
      deliveryMethod: "bank_transfer",
      deliveryTime: "1-3 business days",
      lastUpdated: new Date().toISOString(),
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/Commercial_Bank_of_Ethiopia_logo.svg/1200px-Commercial_Bank_of_Ethiopia_logo.svg.png",
      description: "The largest commercial bank in Ethiopia",
      rating: 4.2,
    },
  ],
  "Awash Bank": [
    {
      provider: "Awash Bank",
      fromCurrency: "USD",
      toCurrency: "ETB",
      exchangeRate: 131.01,
      fee: 0,
      feeType: "none",
      deliveryMethod: "bank_transfer",
      deliveryTime: "1-3 business days",
      lastUpdated: new Date().toISOString(),
      logo: "https://logo.clearbit.com/awashbank.com",
    },
  ],
};

// Mock data for /api/v1/remittance/compare
export const mockCompareResponse = (
  fromCurrency: string = "USD",
  amount: number = 1000,
): CompareResponse => {
  const international = internationalProviders.map((p) => ({
    type: "international_provider" as const,
    provider: p.name,
    exchangeRate: p.rate,
    fee: p.fee,
    feeType: p.feeType,
    amountReceived:
      p.feeType === "fixed"
        ? (amount - p.fee) * p.rate
        : (amount - (amount * p.fee) / 100) * p.rate,
    deliveryMethod: "bank_transfer",
    deliveryTime: p.deliveryTime,
    lastUpdated: new Date().toISOString(),
    logo: p.logo,
  }));

  const banks = ethiopianBanks.map((b) => ({
    type: "ethiopian_bank" as const,
    provider: b.name,
    exchangeRate: b.rate,
    fee: 0,
    feeType: "none" as const,
    amountReceived: amount * b.rate,
    deliveryMethod: "bank_transfer",
    deliveryTime: b.deliveryTime,
    lastUpdated: new Date().toISOString(),
    logo: b.logo,
    cashBuying: b.cashBuying,
    cashSelling: b.cashSelling,
    transactionBuying: b.transactionBuying,
    transactionSelling: b.transactionSelling,
  }));

  const allOptions = [...international, ...banks];
  const sorted = [...allOptions].sort(
    (a, b) => b.amountReceived - a.amountReceived,
  );
  const bestOption = sorted[0];

  return {
    fromCurrency,
    toCurrency: "ETB",
    sendAmount: amount,
    internationalProviders: international,
    ethiopianBanks: banks,
    allOptions: allOptions.map((p) => ({
      type: p.type,
      provider: p.provider,
      amountReceived: p.amountReceived,
    })),
    bestOption: {
      type: bestOption.type,
      provider: bestOption.provider,
      exchangeRate: bestOption.exchangeRate,
      amountReceived: bestOption.amountReceived,
    },
    marketInsights: {
      bestInternational: {
        provider: international.sort(
          (a, b) => b.amountReceived - a.amountReceived,
        )[0].provider,
        amountReceived: Math.max(...international.map((i) => i.amountReceived)),
      },
      bestBank: {
        provider: banks.sort((a, b) => b.amountReceived - a.amountReceived)[0]
          .provider,
        amountReceived: Math.max(...banks.map((b) => b.amountReceived)),
      },
      savings:
        Math.max(...banks.map((b) => b.amountReceived)) -
        Math.max(...international.map((i) => i.amountReceived)),
    },
    lastUpdated: new Date().toISOString(),
  };
};

// Helper functions
export const getUniqueProviders = () => {
  const providers = new Set();
  mockRatesResponse.rates.USD.forEach((rate) => providers.add(rate.provider));
  return Array.from(providers);
};

export const getProviderType = (
  providerName: string,
): "international_provider" | "ethiopian_bank" => {
  const bankNames = ethiopianBanks.map((b) => b.name);
  return bankNames.includes(providerName)
    ? "ethiopian_bank"
    : "international_provider";
};
