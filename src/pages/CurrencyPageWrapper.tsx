
import CurrencyHero from "@/features/currency/pages/currencyHero";
import CurrencyPage from "@/features/currency/pages/CurrencyPage";

import CurrencyNavbar from "@/features/currency/pages/CurrenyNavbar";
const CurrencyPageWrapper = () => {
  return (
    <div>
    <CurrencyNavbar />
      <CurrencyPage />
      <CurrencyHero />  
    </div>
  );
}

export default CurrencyPageWrapper;
