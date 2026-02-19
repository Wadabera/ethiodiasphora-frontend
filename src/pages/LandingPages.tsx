// import React from 'react';

import CTASection from "@/components/Layout/CTASection";
import Footer from "@/components/Layout/Footer";
import Hero from "@/components/Layout/Hero";
import HowItWorks from "@/components/Layout/HowItWorks";
import InvestmentCard from "@/components/Layout/InvestmentCard";
import Investnow from "@/components/Layout/Investnow";
import LovedByThousands from "@/components/Layout/LovedByThousands";
import Navbar from "@/components/Layout/Navbar";
import ReadyToTransform from "@/components/Layout/ReadyToTransform";


const LandingPages = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <CTASection />
      <InvestmentCard />  
      <HowItWorks />
      <LovedByThousands />
      <ReadyToTransform />
      <Investnow />
  <Footer />
    </div>
  );
}

export default LandingPages;
