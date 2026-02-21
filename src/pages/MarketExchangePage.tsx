// import React from 'react';

import Navbar from "@/components/Layout/Navbar";  
import BankPage from "@/features/banks/pages/BankPage";
import BankRatesPage from "@/features/banks/pages/BankRatesPage";
import Footer from "@/components/Layout/Footer";
import BankHero from "@/features/banks/pages/BankHero";
const MarketExchangePage = () => {
  return (
    <div>
      <Navbar />
     <BankHero />
      <BankPage />
      <BankRatesPage/>
      <Footer />
    </div>
  );
};

export default MarketExchangePage;
