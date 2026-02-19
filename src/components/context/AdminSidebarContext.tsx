// src/components/context/AdminSidebarContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminSidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
  undefined,
);

export const AdminSidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("adminSidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("adminSidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <AdminSidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return context;
};
