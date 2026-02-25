// AppRouter.tsx - FULLY FIXED
import LandingPages from "@/pages/LandingPages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPages from "@/features/auth/pages/LoginPages";
import RegisterPages from "@/features/auth/pages/RegisterPages";

// ========== ADMIN FEATURES ==========
import AdminMainDashboardPage from "@/AdminFeatures/Dashboard/pages/AdminMainDashboardPage";
import AdminDashboardHome from "@/AdminFeatures/Dashboard/pages/AdminDashboardHome";
import InvestementApprovementPage from "@/AdminFeatures/InvestmentApproved/pages/InvestementApprovementPage";
// import AdminIPOPendingPage from "@/AdminFeatures/IPOManagement/pages/AdminIPOPendingPage";

// ========== BUSINESS OWNER FEATURES ==========
import BusinessMainDashboardPage from "@/BusinessOwnerFeatures/Dashboard/pages/BusinessMainDashboardPage";
import BusinessDashboardHome from "@/BusinessOwnerFeatures/Dashboard/pages/BussinessDashboardHome";
import Notifactionpage from "@/BusinessOwnerFeatures/Notification/pages/Notifactionpage";

import MarkettingPage from "@/BusinessOwnerFeatures/markets/pages/MarkettingPage";
import BusinessKycPage from "../features/kyc/pages/BusinessKycPage";
// import PortfolioPage from "@/BusinessOwnerFeatures/portfolio/pages/PortfolioPage";
import BusinessManProPage from "@/BusinessOwnerFeatures/profiles/pages/BusinessManProPage";
import MyportifolioPage from "@/BusinessOwnerFeatures/MyInvestment/pages/MyInvestmentPortfolioPage";
import CompanyProfilePage from "../features/companies/pages/CompanyProfilePage";
// ========== INVESTOR FEATURES ==========
import NewInvestmentPage from "@/InvestorFearutes/Investment/pages/NewInvestmentPage";
import StockPage from "@/InvestorFearutes/Stocks/pages/StockPage";
import MarketPage from "@/InvestorFearutes/Markets/pages/MarketPage";
import RemittancePage from "@/InvestorFearutes/Remittance/pages/RemittancePage";
import ProfilePage from "@/InvestorFearutes/Profiles/pages/ProfilePage";
import PortifolioPage from "../InvestorFearutes/Investment/pages/PortfolioPage";
import DashboardHome from "@/InvestorFearutes/dashboard/pages/DashboardHome";
import MainDashboardPage from "@/InvestorFearutes/dashboard/pages/MainDashboardPage";
import InvestmentDetailsPage from "@/InvestorFearutes/Investment/components/InvestmentDetailsPage";       

// ========== ADMIN ADDITIONAL ==========
// import LegalityApprovePage from "@/AdminFeatures/IpoApproved/pages/LegalityApprovePage";
import KycApprovementPage from "@/AdminFeatures/kycApproved/pages/KycApprovementPage";
import AdminProfilePage from "@/AdminFeatures/profiles/pages/AdminProfilePage";
import AdminKycPage from "@/features/kyc/pages/AdminKycPage";

// ========== SHARED ==========
import DashboardRedirect from "@/features/auth/components/DashboardRedirect";
import ProtectedRoute from "./ProtectedRoute";
import InvestorKycPage from "@/features/kyc/pages/InvestorKycPage";
import IpoBrowsePage from "@/features/ipo/pages/IpoBrowsePage";
import CompanyRegisterPage from "@/features/companies/pages/CompanyRegisterPage";
import AdminCompanyPage from "@/AdminFeatures/RegisteredCompanyApproved/pages/AdminCompanyPage";
import { CreateIPOPage } from "@/BusinessOwnerFeatures/IPOManagement/pages/CreateIPOPage";
import MyIPOsPage from "@/BusinessOwnerFeatures/IPOManagement/pages/MyIPOsPage";
import { BrowseIPOsPage } from "@/InvestorFearutes/IPOInvesting/pages/BrowseIPOsPage";
import { MySubscriptionsPage } from "@/InvestorFearutes/IPOInvesting/pages/MySubscriptionsPage";
import { AdminIPOAllPage } from "@/AdminFeatures/IPOManagement/pages/AdminIPOAllPage";
import MyInvestmentPortfolioPage from "@/BusinessOwnerFeatures/MyInvestment/pages/MyInvestmentPortfolioPage";
import CreateIvestmentPage from "@/BusinessOwnerFeatures/MyInvestment/pages/CreateIvestmentPage"
import MarketExchangePage from "@/pages/MarketExchangePage";
import RemittanceLandingPage from "@/pages/RemittanceLandingPage";
import CurrencyPageWrapper from "@/pages/CurrencyPageWrapper";
import InvestPage from "@/pages/InvestPage";
// import InvestPage from "@/pages/InvestPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<LandingPages />} />
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />

        <Route path="/market-exchange" element={<MarketExchangePage />} />
        <Route path="/currency" element={<CurrencyPageWrapper />} />
        <Route path="/send-money" element={<RemittanceLandingPage />} />
        <Route path="/Invest-now" element={<InvestPage />} />
      
        {/* ===== DASHBOARD REDIRECT ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMainDashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          {/* <Route path="ipoApproved" element={<LegalityApprovePage />} /> */}
          <Route
            path="investmetmentApprove"
            element={<InvestementApprovementPage />}
          />
          <Route path="companyApprove" element={<AdminCompanyPage />} />
          <Route path="all" element={<AdminIPOAllPage />} />
          {/* <Route path="ipo/pending" element={<AdminIPOPendingPage />} /> */}
          <Route path="kycApproved" element={<KycApprovementPage />} />
          <Route path="kyc" element={<AdminKycPage />} />
          <Route path="profiles" element={<AdminProfilePage />} />
        </Route>

        {/* ===== BUSINESS OWNER ROUTES ===== */}
        <Route
          path="/business"
          element={
            <ProtectedRoute allowedRoles={["local_business"]}>
              <BusinessMainDashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<BusinessDashboardHome />} />

          <Route path="investments/create" element={<CreateIvestmentPage />} />
          <Route
            path="manageInvestment"
            element={<MyInvestmentPortfolioPage />}
          />
          <Route path="company/create" element={<CompanyRegisterPage />} />
          <Route path="company/profile" element={<CompanyProfilePage />} />
          <Route path="kyc" element={<BusinessKycPage />} />
          <Route path="market" element={<MarkettingPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="portfolio" element={<MyportifolioPage />} />
          <Route path="ipo/create" element={<CreateIPOPage />} />
          <Route path="my-ipos" element={<MyIPOsPage />} />
          <Route path="remittance" element={<RemittancePage />} />
          <Route path="profile" element={<BusinessManProPage />} />
          <Route path="notification" element={<Notifactionpage />} />
        </Route>

        {/* ===== INVESTOR ROUTES ===== */}
        <Route
          path="/investor"
          element={
            <ProtectedRoute allowedRoles={["diaspora_investor"]}>
              <MainDashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="portfolio" element={<PortifolioPage />} />
          <Route path="remittance" element={<RemittancePage />} />
          {/* FIXED: Use relative paths instead of absolute paths */}
          <Route path="ipo/page" element={<BrowseIPOsPage />} />
          <Route path="ipo/sub" element={<MySubscriptionsPage />} />
          <Route path="kyc" element={<InvestorKycPage />} />
          <Route path="market" element={<MarketPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="investipo" element={<IpoBrowsePage />} />
          <Route path="investments" element={<NewInvestmentPage />} />
          <Route path="investments/:id" element={<InvestmentDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
