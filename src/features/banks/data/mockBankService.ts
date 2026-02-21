// src/features/banks/services/mockBankService.ts
import type{
  Bank,
  ExchangeRate,
  ExchangeRatesResponse,
  CurrencyRate,
} from "../types/bank.types";
import CbeImageLogo from "../assets/cbelogo.jpeg"
import oromialogo from "../assets/oromialogo.jpeg";
import awashlogo from "../assets/awashlogo.jpeg";
import dashenlogo from "../assets/dashenlogo.png";
import abyssinialogo from "../assets/abyssinialogo.jpeg";
import coprativelogo from "../assets/coperativelogo.png";
import unitedlogo from "../assets/placeholderlogo.jpeg";
import placeholderlogo from "../assets/placeholderlogo.jpeg";
import developmentlogo from "../assets/developmentallogo.jpeg";
// Helper function to generate random rates with slight variations
const generateRates = (
  baseRate: number,
  currencyCode: string,
  currencyName: string,
  flag: string,
  bankId: string,
): ExchangeRate => {
  const bankVariation =
    {
      cbe: 0,
      db: -0.1,
      awash: 0.15,
      dashen: 0.2,
      abyssinia: -0.05,
      wegagen: 0.1,
      united: -0.15,
      nib: 0.05,
      coop: 0.12,
      berhan: -0.08,
      addis: 0.18,
      buna: -0.12,
      hibret: 0.08,
      sidama: 0.22,
      siingee: -0.18,
      siket: 0.25,
      tsedey: -0.2,
      tsehay: 0.28,
      zamzam: -0.22,
      goh: 0.3,
      shabelle: -0.25,
      amhara: 0.16,
      oromia: -0.14,
      southern: 0.2,
      gambela: -0.16,
      afar: 0.24,
      benshangul: -0.2,
    }[bankId] || 0;

  const variation = Math.random() * 0.8 - 0.4 + bankVariation;
  const buyingRate = Number((baseRate + variation).toFixed(4));
  const sellingRate = Number((baseRate + 2.8 + variation).toFixed(4));
  const change = Number((Math.random() * 0.8 - 0.4).toFixed(2));

  return {
    currency: currencyCode,
    currencyCode,
    currencyName,
    flag,
    buyingRate,
    sellingRate,
    cashBuying: Number((buyingRate - 0.25).toFixed(4)),
    cashSelling: Number((sellingRate + 0.35).toFixed(4)),
    cashBuyingRate: Number((buyingRate - 0.25).toFixed(4)),
    cashSellingRate: Number((sellingRate + 0.35).toFixed(4)),
    transactionBuying: buyingRate,
    transactionSelling: sellingRate,
    lastUpdate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    change,
    spread: Number((sellingRate - buyingRate).toFixed(4)),
  };
};

// Base rates for major currencies (as of Feb 2026)
const baseRates = {
  USD: 152.3456,
  EUR: 164.789,
  GBP: 193.4567,
  JPY: 1.0345,
  CNY: 21.5678,
  AED: 41.4567,
  SAR: 40.6789,
  CAD: 113.2345,
  AUD: 103.4567,
  INR: 1.8456,
  KES: 1.1234,
  SGD: 113.789,
  CHF: 169.3456,
  SEK: 14.5678,
  NOK: 14.2345,
  DKK: 22.1234,
  ZAR: 8.4567,
  TRY: 5.6789,
  RUB: 1.789,
  BRL: 29.4567,
};

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷" },
  { code: "RUB", name: "Russian Ruble", flag: "🇷🇺" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷" },
];

// Mock Bank Data
export const mockBanks: Bank[] = [
  // Government Banks
  {
    _id: "cbe-001",
    id: "cbe-001",
    name: "Commercial Bank of Ethiopia",
    shortName: "CBE",
    code: "CBE",
    logo: CbeImageLogo,
    website: "https://combanketh.et",
    description: "The largest commercial bank in Ethiopia, established in 1942",
    category: "government",
    isGovernment: true,
    established: 1942,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Unity Square, Churchill Avenue, Addis Ababa",
      phone: "+251-11-551-1122",
      email: "info@combanketh.et",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "cbe",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "dbe-002",
    id: "dbe-002",
    name: "Development Bank of Ethiopia",
    shortName: "DBE",
    code: "DBE",
    logo: developmentlogo,
    description: "Promotes national development through financial support",
    category: "government",
    isGovernment: true,
    established: 1909,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Lideta, Addis Ababa",
      phone: "+251-11-551-2288",
      email: "contact@dbe.com.et",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "db",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },

  // Private Banks
  {
    _id: "awash-003",
    id: "awash-003",
    name: "Awash Bank S.C",
    shortName: "Awash",
    code: "AWASH",
    logo: awashlogo,
    description: "One of the largest private banks in Ethiopia",
    category: "private",
    isGovernment: false,
    established: 1994,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Bole Road, Addis Ababa",
      phone: "+251-11-554-1234",
      email: "info@awashbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "awash",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "dashen-004",
    id: "dashen-004",
    name: "Dashen Bank S.C",
    shortName: "Dashen",
    code: "DASHEN",
    logo: dashenlogo,
    description: "Leading private bank with innovative banking solutions",
    category: "private",
    isGovernment: false,
    established: 1995,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Bole, Addis Ababa",
      phone: "+251-11-552-6789",
      email: "info@dashenbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "dashen",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "abyssinia-005",
    id: "abyssinia-005",
    name: "Abyssinia Bank S.C",
    shortName: "Abyssinia",
    code: "ABY",
    logo: abyssinialogo,
    description: "Customer-focused banking services since 1996",
    category: "private",
    isGovernment: false,
    established: 1996,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Mexico Square, Addis Ababa",
      phone: "+251-11-553-4567",
      email: "info@abyssinia-bank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "abyssinia",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "wegagen-006",
    id: "wegagen-006",
    name: "Wegagen Bank S.C",
    shortName: "Wegagen",
    code: "WEGA",
    logo: placeholderlogo,
    description: "Reliable banking partner since 1997",
    category: "private",
    isGovernment: false,
    established: 1997,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Bambis, Addis Ababa",
      phone: "+251-11-554-8901",
      email: "info@wegagen.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "wegagen",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "united-007",
    id: "united-007",
    name: "United Bank S.C",
    shortName: "United",
    code: "UB",
    logo: unitedlogo,
    description: "Committed to excellence in banking",
    category: "private",
    isGovernment: false,
    established: 1998,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Merkato, Addis Ababa",
      phone: "+251-11-555-2345",
      email: "info@unitedbank.com.et",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "united",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "nib-008",
    id: "nib-008",
    name: "NIB International Bank S.C",
    shortName: "NIB",
    code: "NIB",
    logo: placeholderlogo,
    description: "International standard banking services",
    category: "private",
    isGovernment: false,
    established: 1999,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Kazanchis, Addis Ababa",
      phone: "+251-11-556-7890",
      email: "info@nibbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "nib",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "coop-009",
    id: "coop-009",
    name: "Cooperative Bank of Oromia",
    shortName: "Coop Bank",
    code: "CBO",
    logo: coprativelogo,  
    description: "Serving the Oromia region and beyond",
    category: "private",
    isGovernment: false,
    established: 2004,
    headquarters: "Adama, Ethiopia",
    contactInfo: {
      address: "Adama, Oromia",
      phone: "+251-22-661-1234",
      email: "info@coopbankoromia.com.et",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "coop",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "berhan-010",
    id: "berhan-010",
    name: "Berhan Bank S.C",
    shortName: "Berhan",
    code: "BERHAN",
    logo: placeholderlogo,
    website: "https://berhanbank.com",
    description: "Bright future with Berhan Bank",
    category: "private",
    isGovernment: false,
    established: 2009,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Bole, Addis Ababa",
      phone: "+251-11-557-3456",
      email: "info@berhanbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "berhan",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "addis-011",
    id: "addis-011",
    name: "Addis International Bank S.C",
    shortName: "Addis Bank",
    code: "AIB",
    logo: placeholderlogo,
    website: "https://addisbank.com",
    description: "Your trusted banking partner",
    category: "private",
    isGovernment: false,
    established: 2011,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Kera, Addis Ababa",
      phone: "+251-11-558-9012",
      email: "info@addisbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "addis",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "buna-012",
    id: "buna-012",
    name: "Buna International Bank S.C",
    shortName: "Buna",
    code: "BUNA",
    logo: placeholderlogo,
    website: "https://bunabank.com",
    description: "Fresh approach to banking",
    category: "private",
    isGovernment: false,
    established: 2013,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Sarbet, Addis Ababa",
      phone: "+251-11-559-5678",
      email: "info@bunabank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "buna",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "hibret-013",
    id: "hibret-013",
    name: "Hibret Bank S.C",
    shortName: "Hibret",
    code: "HIBRET",
    logo:   placeholderlogo,
    website: "https://hibretbank.com.et",
    description: "Partnership for growth",
    category: "private",
    isGovernment: false,
    established: 1998,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Mexico, Addis Ababa",
      phone: "+251-11-550-7890",
      email: "info@hibretbank.com.et",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "hibret",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "sidama-014",
    id: "sidama-014",
    name: "Sidama Bank S.C",
    shortName: "Sidama",
    code: "SIDAMA",
    logo:   placeholderlogo,
    website: "https://sidamabank.com",
    description: "Banking for the Sidama region",
    category: "private",
    isGovernment: false,
    established: 2021,
    headquarters: "Hawassa, Ethiopia",
    contactInfo: {
      address: "Hawassa, Sidama",
      phone: "+251-46-212-3456",
      email: "info@sidamabank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "sidama",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "siingee-015",
    id: "siingee-015",
    name: "Siingee Bank S.C",
    shortName: "Siingee",
    code: "SIINGEE",
    logo:   placeholderlogo,
    website: "https://siingeebank.com",
    description: "Modern banking solutions",
    category: "private",
    isGovernment: false,
    established: 2021,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "CMC, Addis Ababa",
      phone: "+251-11-560-1234",
      email: "info@siingeebank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "siingee",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "siket-016",
    id: "siket-016",
    name: "Siket Bank S.C",
    shortName: "Siket",
    code: "SIKET",
    logo:placeholderlogo,
    website: "https://siketbank.com",
    description: "Your financial partner",
    category: "private",
    isGovernment: false,
    established: 2021,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Piassa, Addis Ababa",
      phone: "+251-11-561-5678",
      email: "info@siketbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "siket",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "tsedey-017",
    id: "tsedey-017",
    name: "Tsedey Bank S.C",
    shortName: "Tsedey",
    code: "TSEDEY",
    logo: placeholderlogo,
    website: "https://tsedeybank.com",
    description: "Bright future banking",
    category: "private",
    isGovernment: false,
    established: 2021,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Gotera, Addis Ababa",
      phone: "+251-11-562-9012",
      email: "info@tsedeybank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "tsedey",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "tsehay-018",
    id: "tsehay-018",
    name: "Tsehay Bank S.C",
    shortName: "Tsehay",
    code: "TSEHAY",
    logo: placeholderlogo,
    website: "https://tsehaybank.com",
    description: "Sunshine in banking",
    category: "private",
    isGovernment: false,
    established: 2021,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Kality, Addis Ababa",
      phone: "+251-11-563-3456",
      email: "info@tsehaybank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "tsehay",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "zamzam-019",
    id: "zamzam-019",
    name: "ZamZam Bank S.C",
    shortName: "ZamZam",
    code: "ZAMZAM",
    logo: placeholderlogo,
    website: "https://zamzambank.com",
    description: "Ethiopia's first interest-free bank",
    category: "private",
    isGovernment: false,
    established: 2021,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Bole, Addis Ababa",
      phone: "+251-11-564-7890",
      email: "info@zamzambank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "zamzam",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "goh-020",
    id: "goh-020",
    name: "Goh Betoch Bank S.C",
    shortName: "Goh",
    code: "GOH",
    logo: placeholderlogo,
    website: "https://gohbank.com",
    description: "Your housing finance partner",
    category: "private",
    isGovernment: false,
    established: 2022,
    headquarters: "Addis Ababa, Ethiopia",
    contactInfo: {
      address: "Megenagna, Addis Ababa",
      phone: "+251-11-565-1234",
      email: "info@gohbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "goh",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "shabelle-021",
    id: "shabelle-021",
    name: "Shabelle Bank S.C",
    shortName: "Shabelle",
    code: "SHABELLE",
    logo: placeholderlogo,
    website: "https://shabellebank.com",
    description: "Banking for the Somali region",
    category: "private",
    isGovernment: false,
    established: 2022,
    headquarters: "Jigjiga, Ethiopia",
    contactInfo: {
      address: "Jigjiga, Somali",
      phone: "+251-25-212-3456",
      email: "info@shabellebank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "shabelle",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "amhara-022",
    id: "amhara-022",
    name: "Amhara Bank S.C",
    shortName: "Amhara",
    code: "AMHARA",
    logo:   placeholderlogo,
    website: "https://amharabank.com",
    description: "Serving the Amhara region",
    category: "private",
    isGovernment: false,
    established: 2022,
    headquarters: "Bahir Dar, Ethiopia",
    contactInfo: {
      address: "Bahir Dar, Amhara",
      phone: "+251-58-220-1234",
      email: "info@amharabank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "amhara",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "oromia-023",
    id: "oromia-023",
    name: "Oromia Bank S.C",
    shortName: "Oromia",
    code: "OROMIA",
    logo: oromialogo,
    website: "https://oromiabank.com",
    description: "Banking for Oromia",
    category: "private",
    isGovernment: false,
    established: 2022,
    headquarters: "Adama, Ethiopia",
    contactInfo: {
      address: "Adama, Oromia",
      phone: "+251-22-221-5678",
      email: "info@oromiabank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "oromia",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "southern-024",
    id: "southern-024",
    name: "Southern Bank S.C",
    shortName: "Southern",
    code: "SOUTH",
    logo: placeholderlogo,
    website: "https://southernbank.com",
    description: "Banking for the Southern region",
    category: "private",
    isGovernment: false,
    established: 2022,
    headquarters: "Hawassa, Ethiopia",
    contactInfo: {
      address: "Hawassa, SNNPR",
      phone: "+251-46-221-9012",
      email: "info@southernbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "southern",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "gambela-025",
    id: "gambela-025",
    name: "Gambela Bank S.C",
    shortName: "Gambela",
    code: "GAMBELA",
    logo: placeholderlogo,
      
    description: "Serving the Gambela region",
    category: "private",
    isGovernment: false,
    established: 2023,
    headquarters: "Gambela, Ethiopia",
    contactInfo: {
      address: "Gambela Town",
      phone: "+251-47-551-3456",
      email: "info@gambelabank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "gambela",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "afar-026",
    id: "afar-026",
    name: "Afar Bank S.C",
    shortName: "Afar",
    code: "AFAR",
    logo: placeholderlogo,
    website: "https://afarbank.com",
    description: "Banking for the Afar region",
    category: "private",
    isGovernment: false,
    established: 2023,
    headquarters: "Semera, Ethiopia",
    contactInfo: {
      address: "Semera, Afar",
      phone: "+251-33-661-7890",
      email: "info@afarbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "afar",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
  {
    _id: "benshangul-027",
    id: "benshangul-027",
    name: "Benshangul Bank S.C",
    shortName: "Benshangul",
    code: "BENSHA",
    logo: placeholderlogo,
    website: "https://benshangularbank.com",
    description: "Serving the Benshangul-Gumuz region",
    category: "private",
    isGovernment: false,
    established: 2023,
    headquarters: "Assosa, Ethiopia",
    contactInfo: {
      address: "Assosa, Benshangul-Gumuz",
      phone: "+251-57-771-2345",
      email: "info@benshangularbank.com",
    },
    exchangeRates: currencies.map((c) =>
      generateRates(
        baseRates[c.code as keyof typeof baseRates],
        c.code,
        c.name,
        c.flag,
        "benshangul",
      ),
    ),
    rates: [],
    lastUpdated: new Date().toISOString(),
  },
];

// Populate rates array for each bank
mockBanks.forEach((bank) => {
  bank.rates = bank.exchangeRates.map((rate) => ({
    code: rate.currencyCode,
    name: rate.currencyName,
    flag: rate.flag,
    cashBuying: rate.cashBuying,
    cashSelling: rate.cashSelling,
    transactionBuying: rate.transactionBuying,
    transactionSelling: rate.transactionSelling,
    lastUpdate: rate.lastUpdate,
    change: rate.change,
  }));
});

// Generate market rates (aggregate data)
export const generateMarketRates = (): ExchangeRatesResponse => {
  const rates: { [key: string]: CurrencyRate } = {};

  currencies.forEach((currency) => {
    const bankRates = mockBanks
      .map((bank) =>
        bank.exchangeRates.find((r) => r.currencyCode === currency.code),
      )
      .filter((r) => r !== undefined) as ExchangeRate[];

    if (bankRates.length > 0) {
      const buyingRates = bankRates.map((r) => r.buyingRate);
      const sellingRates = bankRates.map((r) => r.sellingRate);

      const bestBuyingRate = Math.max(...buyingRates);
      const bestSellingRate = Math.min(...sellingRates);
      const worstBuyingRate = Math.min(...buyingRates);
      const worstSellingRate = Math.max(...sellingRates);

      const bestBuyingBank = mockBanks.find(
        (b) =>
          b.exchangeRates.find((r) => r.currencyCode === currency.code)
            ?.buyingRate === bestBuyingRate,
      )?.name;

      const bestSellingBank = mockBanks.find(
        (b) =>
          b.exchangeRates.find((r) => r.currencyCode === currency.code)
            ?.sellingRate === bestSellingRate,
      )?.name;

      rates[currency.code] = {
        currencyCode: currency.code,
        currencyName: currency.name,
        flag: currency.flag,
        averageBuying: Number(
          (buyingRates.reduce((a, b) => a + b, 0) / buyingRates.length).toFixed(
            4,
          ),
        ),
        averageSelling: Number(
          (
            sellingRates.reduce((a, b) => a + b, 0) / sellingRates.length
          ).toFixed(4),
        ),
        bestBuyingRate,
        bestSellingRate,
        bestBuyingBank,
        bestSellingBank,
        worstBuyingRate,
        worstSellingRate,
        rateSpread: Number((bestBuyingRate - worstBuyingRate).toFixed(4)),
        totalBanks: bankRates.length,
        lastUpdated: new Date().toISOString(),
        change: Number((Math.random() * 0.6 - 0.3).toFixed(2)),
      };
    }
  });

  return {
    baseCurrency: "ETB",
    rates,
    lastUpdated: new Date().toISOString(),
    totalBanks: mockBanks.length,
  };
};

// Mock Service
export const mockBankService = {
  // Get all banks
  getAllBanks: async (): Promise<Bank[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockBanks;
  },

  // Get bank by ID
  getBankById: async (id: string): Promise<Bank> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const bank = mockBanks.find((b) => b.id === id || b._id === id);
    if (!bank) {
      throw new Error("Bank not found");
    }
    return bank;
  },

  // Search banks
  searchBanks: async (params: {
    query: string;
    category?: string;
  }): Promise<Bank[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    let filtered = [...mockBanks];

    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(
        (bank) =>
          bank.name.toLowerCase().includes(query) ||
          bank.shortName.toLowerCase().includes(query) ||
          bank.code.toLowerCase().includes(query),
      );
    }

    if (params.category && params.category !== "all") {
      filtered = filtered.filter((bank) =>
        params.category === "government"
          ? bank.isGovernment
          : !bank.isGovernment,
      );
    }

    return filtered;
  },

  // Get banks by category
  getBanksByCategory: async (
    category: "government" | "private",
  ): Promise<Bank[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockBanks.filter((bank) =>
      category === "government" ? bank.isGovernment : !bank.isGovernment,
    );
  },

  // Get exchange rates for a specific bank
  getBankRates: async (bankId: string): Promise<ExchangeRate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const bank = mockBanks.find((b) => b.id === bankId || b._id === bankId);
    return bank?.exchangeRates || [];
  },

  // Get all market rates (aggregated)
  getMarketRates: async (): Promise<ExchangeRatesResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return generateMarketRates();
  },

  // Get rates for specific currencies
  getRatesForCurrencies: async (
    currencies: string[],
  ): Promise<ExchangeRatesResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const fullRates = generateMarketRates();
    const filteredRates: { [key: string]: CurrencyRate } = {};

    currencies.forEach((code) => {
      if (fullRates.rates[code]) {
        filteredRates[code] = fullRates.rates[code];
      }
    });

    return {
      ...fullRates,
      rates: filteredRates,
    };
  },

  // Get best rates across all banks
  getBestRates: async (): Promise<{
    [key: string]: { bank: string; rate: number };
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const bestRates: { [key: string]: { bank: string; rate: number } } = {};

    currencies.forEach((currency) => {
      let bestRate = 0;
      let bestBank = "";

      mockBanks.forEach((bank) => {
        const rate = bank.exchangeRates.find(
          (r) => r.currencyCode === currency.code,
        );
        if (rate && rate.buyingRate > bestRate) {
          bestRate = rate.buyingRate;
          bestBank = bank.name;
        }
      });

      if (bestBank) {
        bestRates[currency.code] = {
          bank: bestBank,
          rate: bestRate,
        };
      }
    });

    return bestRates;
  },

  // Get bank statistics
  getBankStatistics: async (): Promise<{
    totalBanks: number;
    governmentBanks: number;
    privateBanks: number;
    totalCurrencies: number;
    lastUpdate: string;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalBanks: mockBanks.length,
      governmentBanks: mockBanks.filter((b) => b.isGovernment).length,
      privateBanks: mockBanks.filter((b) => !b.isGovernment).length,
      totalCurrencies: currencies.length,
      lastUpdate: new Date().toISOString(),
    };
  },

  // Get currency list
  getCurrencies: async (): Promise<typeof currencies> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return currencies;
  },
};

// Export currencies list for use in components
export const currenciesList = currencies;
