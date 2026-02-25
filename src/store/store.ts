// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slice/authSlice";
import profileReducer from "../BusinessOwnerFeatures/profiles/slice/profileSlice";
import investmentReducer from "../BusinessOwnerFeatures/MyInvestment/slice/InvestmentSlice";
import adminInvestmentsReducer from "../AdminFeatures/InvestmentApproved/slice/AdminInvestmentSlice";
import adminCompanyReducer from "../AdminFeatures/RegisteredCompanyApproved/slice/AdminCompanySlice";
import investorIPOReducer from "../InvestorFearutes/IPOInvesting/slice/investorIPOSlice";
import publishedReducer from "../InvestorFearutes/Investment/slices/PublishedInvestmentSlice";
import kycReducer from "../features/kyc/slices/kycSlice";
// Create and export the store directly
import adminKycReducer from "../features/kyc/slices/adminKycSlice";
import businessIPOReducer from "../BusinessOwnerFeatures/IPOManagement/slice/businessIPOSlice"; 
import ipoReducer from "../features/ipo/slices/IpoSlice";
import adminIPOReducer from "../AdminFeatures/IPOManagement/slice/adminIPOSlice"; 
import companiesReducer from "../features/companies/slices/companySlice";
import banksReducer from "../features/banks/slices/bankSlice";
import remittanceReducer from "../features/remittance/slices/remittanceSlice";
import publicInvestmentsReducer from "../features/publicInvestment/slices/publicInvestmentSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    investment: investmentReducer,
    kyc: kycReducer,
    adminKyc: adminKycReducer,
    adminInvestments: adminInvestmentsReducer,
    adminCompany: adminCompanyReducer,
    published: publishedReducer,
    ipo: ipoReducer,
    businessIPO: businessIPOReducer,
    companies: companiesReducer,
    investorIPO: investorIPOReducer,
    adminIPO: adminIPOReducer,
    banks: banksReducer,
    remittance: remittanceReducer,
    publicInvestments: publicInvestmentsReducer,
  },
  // Remove apiMiddleware if you're not using it
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Type Definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
