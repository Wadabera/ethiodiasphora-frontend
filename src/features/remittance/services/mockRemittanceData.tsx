// features/remittance/services/mockRemittanceData.ts
import type{
  RemittanceRatesResponse,
  RemittanceProvider,
  Currency,
} from "../types/remittance.types";

// Provider logos (using emoji as placeholders - replace with actual image URLs)
const logos = {
  WorldRemit: "https://logo.clearbit.com/worldremit.com",
  WesternUnion: "https://logo.clearbit.com/westernunion.com",
  MoneyGram: "https://logo.clearbit.com/moneygram.com",
  Dahabshiil: "https://logo.clearbit.com/dahabshiil.com",
  TransferWise: "https://logo.clearbit.com/transferwise.com",
  PayPal: "https://logo.clearbit.com/paypal.com",
  Ria: "https://logo.clearbit.com/riafinancial.com",
};

// Mock Remittance Rates - matches your API structure
export const mockRates: RemittanceRatesResponse = {
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
        logo: logos.WorldRemit,
        rating: 4.5,
        minAmount: 50,
        maxAmount: 5000,
      },
      {
        provider: "Western Union",
        exchangeRate: 55.25,
        fee: 8.0,
        feeType: "fixed",
        deliveryMethod: "cash_pickup",
        deliveryTime: "10 minutes",
        lastUpdated: new Date().toISOString(),
        logo: logos.WesternUnion,
        rating: 4.3,
        minAmount: 50,
        maxAmount: 3000,
      },
      {
        provider: "MoneyGram",
        exchangeRate: 55.4,
        fee: 5.99,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "30 minutes",
        lastUpdated: new Date().toISOString(),
        logo: logos.MoneyGram,
        rating: 4.2,
        minAmount: 50,
        maxAmount: 4000,
      },
      {
        provider: "Dahabshiil",
        exchangeRate: 55.35,
        fee: 6.5,
        feeType: "fixed",
        deliveryMethod: "cash_pickup",
        deliveryTime: "2 hours",
        lastUpdated: new Date().toISOString(),
        logo: logos.Dahabshiil,
        rating: 4.4,
        minAmount: 100,
        maxAmount: 10000,
      },
      {
        provider: "TransferWise",
        exchangeRate: 55.6,
        fee: 3.5,
        feeType: "percentage",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1 day",
        lastUpdated: new Date().toISOString(),
        logo: logos.TransferWise,
        rating: 4.7,
        minAmount: 100,
        maxAmount: 15000,
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
        logo: logos.WorldRemit,
        rating: 4.5,
        minAmount: 50,
        maxAmount: 5000,
      },
      {
        provider: "Western Union",
        exchangeRate: 60.1,
        fee: 7.0,
        feeType: "fixed",
        deliveryMethod: "cash_pickup",
        deliveryTime: "10 minutes",
        lastUpdated: new Date().toISOString(),
        logo: logos.WesternUnion,
        rating: 4.3,
        minAmount: 50,
        maxAmount: 3000,
      },
      {
        provider: "TransferWise",
        exchangeRate: 60.4,
        fee: 2.99,
        feeType: "percentage",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1 day",
        lastUpdated: new Date().toISOString(),
        logo: logos.TransferWise,
        rating: 4.7,
        minAmount: 100,
        maxAmount: 15000,
      },
    ],
    GBP: [
      {
        provider: "WorldRemit",
        exchangeRate: 70.5,
        fee: 4.99,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-2 hours",
        lastUpdated: new Date().toISOString(),
        logo: logos.WorldRemit,
        rating: 4.5,
        minAmount: 50,
        maxAmount: 5000,
      },
      {
        provider: "TransferWise",
        exchangeRate: 70.8,
        fee: 3.5,
        feeType: "percentage",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1 day",
        lastUpdated: new Date().toISOString(),
        logo: logos.TransferWise,
        rating: 4.7,
        minAmount: 100,
        maxAmount: 15000,
      },
    ],
    AED: [
      {
        provider: "WorldRemit",
        exchangeRate: 15.1,
        fee: 5.0,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-2 hours",
        lastUpdated: new Date().toISOString(),
        logo: logos.WorldRemit,
        rating: 4.5,
        minAmount: 200,
        maxAmount: 20000,
      },
      {
        provider: "Western Union",
        exchangeRate: 15.05,
        fee: 7.0,
        feeType: "fixed",
        deliveryMethod: "cash_pickup",
        deliveryTime: "10 minutes",
        lastUpdated: new Date().toISOString(),
        logo: logos.WesternUnion,
        rating: 4.3,
        minAmount: 200,
        maxAmount: 15000,
      },
      {
        provider: "MoneyGram",
        exchangeRate: 15.08,
        fee: 6.0,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "30 minutes",
        lastUpdated: new Date().toISOString(),
        logo: logos.MoneyGram,
        rating: 4.2,
        minAmount: 200,
        maxAmount: 12000,
      },
    ],
    CAD: [
      {
        provider: "WorldRemit",
        exchangeRate: 41.2,
        fee: 4.99,
        feeType: "fixed",
        deliveryMethod: "bank_transfer",
        deliveryTime: "1-2 hours",
        lastUpdated: new Date().toISOString(),
        logo: logos.WorldRemit,
        rating: 4.5,
        minAmount: 50,
        maxAmount: 5000,
      },
    ],
    SAR: [
      {
        provider: "Western Union",
        exchangeRate: 14.75,
        fee: 6.0,
        feeType: "fixed",
        deliveryMethod: "cash_pickup",
        deliveryTime: "10 minutes",
        lastUpdated: new Date().toISOString(),
        logo: logos.WesternUnion,
        rating: 4.3,
        minAmount: 100,
        maxAmount: 10000,
      },
    ],
  },
  lastUpdated: new Date().toISOString(),
};

// Transform rates to providers format for easier display
export const transformRatesToProviders = (): RemittanceProvider[] => {
  const providers: RemittanceProvider[] = [];

  Object.entries(mockRates.rates).forEach(([currency, rates]) => {
    rates.forEach((rate) => {
      providers.push({
        provider: rate.provider,
        fromCurrency: currency as Currency,
        toCurrency: "ETB",
        exchangeRate: rate.exchangeRate,
        fee: rate.fee,
        feeType: rate.feeType,
        deliveryMethod: rate.deliveryMethod,
        deliveryTime: rate.deliveryTime,
        logo: rate.logo,
        rating: rate.rating,
        minAmount: rate.minAmount,
        maxAmount: rate.maxAmount,
      });
    });
  });

  return providers;
};

// Mock providers list
export const mockProviders: RemittanceProvider[] = transformRatesToProviders();

// Helper function to calculate receive amount
export const calculateReceiveAmount = (
  sendAmount: number,
  exchangeRate: number,
  fee: number,
  feeType: "fixed" | "percentage",
) => {
  const calculatedFee = feeType === "fixed" ? fee : (sendAmount * fee) / 100;
  const amountAfterFee = sendAmount - calculatedFee;
  const receiveAmount = amountAfterFee * exchangeRate;

  return {
    sendAmount,
    receiveAmount: Math.round(receiveAmount * 100) / 100,
    fee: calculatedFee,
    exchangeRate,
  };
};
