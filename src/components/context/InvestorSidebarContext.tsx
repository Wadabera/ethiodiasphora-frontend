// src/components/context/InvestorSidebarContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface InvestorSidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const InvestorSidebarContext = createContext<
  InvestorSidebarContextType | undefined
>(undefined);

export const InvestorSidebarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("investorSidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("investorSidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <InvestorSidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </InvestorSidebarContext.Provider>
  );
};

export const useInvestorSidebar = () => {
  const context = useContext(InvestorSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useInvestorSidebar must be used within InvestorSidebarProvider",
    );
  }
  return context;
};
