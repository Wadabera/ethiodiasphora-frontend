// import React from 'react';

import MarketNavbar from "@/features/banks/pages/MarketNavbar";
import BankPage from "@/features/banks/pages/BankPage";
import BankRatesPage from "@/features/banks/pages/BankRatesPage";
import Footer from "@/components/Layout/Footer";
const MarketExchangePage = () => {
  return (
    <div>
      <MarketNavbar />
      <BankPage />
      <BankRatesPage/>
      <Footer />
    </div>
  );
};

export default MarketExchangePage;
