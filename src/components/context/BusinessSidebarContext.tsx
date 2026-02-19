// src/components/context/BusinessSidebarContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface BusinessSidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const BusinessSidebarContext = createContext<
  BusinessSidebarContextType | undefined
>(undefined);

export const BusinessSidebarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("businessSidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("businessSidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <BusinessSidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </BusinessSidebarContext.Provider>
  );
};

export const useBusinessSidebar = () => {
  const context = useContext(BusinessSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useBusinessSidebar must be used within BusinessSidebarProvider",
    );
  }
  return context;
};
