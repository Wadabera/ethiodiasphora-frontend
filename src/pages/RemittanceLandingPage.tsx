// pages/RemittanceLandingPage.tsx
import React from "react";

import Footer from "@/components/Layout/Footer";
import RemittancePage from "@/features/remittance/pages/RemittancePage";
import HowToTransferMoney from "@/features/remittance/components/HowToTransferMoney";
import PaymentMethods from "@/features/remittance/pages/PaymentMethod";
import RemiNavabar from "@/features/remittance/pages/RemiNavabar";

const RemittanceLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
<RemiNavabar /> 
      <RemittancePage />
      <HowToTransferMoney />
      <PaymentMethods />
      <Footer />
    </div>
  );
};

export default RemittanceLandingPage;
