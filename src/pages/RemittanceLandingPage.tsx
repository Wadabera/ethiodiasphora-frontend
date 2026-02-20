// pages/RemittanceLandingPage.tsx
import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import RemittancePage from "@/features/remittance/pages/RemittancePage";

const RemittanceLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <RemittancePage />
      <Footer />
    </div>
  );
};

export default RemittanceLandingPage;
