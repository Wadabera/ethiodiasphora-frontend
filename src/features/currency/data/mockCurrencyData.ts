// src/features/currency/data/mockCurrencyData.ts
import type { Currency, CurrencyDetail } from '../types/currency.types';

// Currency list
export const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
  { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
];

// Ethiopian banks
const ethiopianBanks = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia' },
  { id: 'awash', name: 'Awash Bank' },
  { id: 'dashen', name: 'Dashen Bank' },
  { id: 'abyssinia', name: 'Bank of Abyssinia' },
  { id: 'nib', name: 'NIB International Bank' },
  { id: 'hibret', name: 'Hibret Bank' },
  { id: 'wegagen', name: 'Wegagen Bank' },
  { id: 'united', name: 'United Bank' },
  { id: 'coop', name: 'Cooperative Bank of Oromia' },
  { id: 'oromia', name: 'Oromia Bank' },
];

// Generate random rates for each currency
const generateBankRates = (baseRate: number) => {
  return ethiopianBanks.map(bank => {
    const variation = (Math.random() * 2) - 1;
    const buyingRate = Number((baseRate + variation).toFixed(4));
    const sellingRate = Number((baseRate + 2.5 + variation).toFixed(4));
    const change = Number((Math.random() * 1 - 0.5).toFixed(2));
    
    return {
      bankId: bank.id,
      bankName: bank.name,
      buyingRate,
      sellingRate,
      cashBuying: Number((buyingRate - 0.15).toFixed(4)),
      cashSelling: Number((sellingRate + 0.15).toFixed(4)),
      lastUpdate: new Date().toISOString(),
      change,
    };
  });
};

// Base rates for currencies (as of Feb 2026)
const baseRates = {
  USD: 152.3456,
  EUR: 164.7890,
  GBP: 193.4567,
  JPY: 1.0345,
  CNY: 21.5678,
  AED: 41.4567,
  SAR: 40.6789,
  CAD: 113.2345,
  AUD: 103.4567,
  INR: 1.8456,
  KES: 1.1234,
  CHF: 169.3456,
  SEK: 14.5678,
  NOK: 14.2345,
  DKK: 22.1234,
};

// Generate currency details
export const currencyDetails: CurrencyDetail[] = currencies.map(currency => {
  const bankRates = generateBankRates(baseRates[currency.code as keyof typeof baseRates] || 100);
  const buyingRates = bankRates.map(r => r.buyingRate);
  const sellingRates = bankRates.map(r => r.sellingRate);
  
  const avgBuying = buyingRates.reduce((a, b) => a + b, 0) / buyingRates.length;
  const avgSelling = sellingRates.reduce((a, b) => a + b, 0) / sellingRates.length;
  
  const bestBuyingRate = Math.max(...buyingRates);
  const bestSellingRate = Math.min(...sellingRates);
  
  const bestBuyingBank = bankRates.find(r => r.buyingRate === bestBuyingRate)?.bankName || '';
  const bestSellingBank = bankRates.find(r => r.sellingRate === bestSellingRate)?.bankName || '';
  
  const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable';
  
  return {
    currency,
    averageRate: {
      buying: Number(avgBuying.toFixed(4)),
      selling: Number(avgSelling.toFixed(4)),
    },
    bestRate: {
      buying: { bank: bestBuyingBank, rate: bestBuyingRate },
      selling: { bank: bestSellingBank, rate: bestSellingRate },
    },
    bankRates: bankRates.sort((a, b) => b.buyingRate - a.buyingRate),
    totalVolume: Math.floor(Math.random() * 10000000) + 1000000,
    trend,
  };
});

// Create a map for easy lookup
export const currencyDetailsMap = currencyDetails.reduce((acc, detail) => {
  acc[detail.currency.code] = detail;
  return acc;
}, {} as Record<string, CurrencyDetail>);

// Mock service
export const mockCurrencyService = {
  getAllCurrencies: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return currencies;
  },
  
  getCurrencyByCode: async (code: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return currencyDetailsMap[code] || null;
  },
  
  searchCurrencies: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return currencies.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  getBestRates: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const bestRates: Record<string, any> = {};
    Object.entries(currencyDetailsMap).forEach(([code, detail]) => {
      bestRates[code] = {
        bestBuying: detail.bestRate.buying,
        bestSelling: detail.bestRate.selling,
        averageBuying: detail.averageRate.buying,
      };
    });
    return bestRates;
  }
};