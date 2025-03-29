import React, { useState, useEffect } from "react";
import StockNav from "./StockNavigation";
import Sidebar from "../../../../components/Sidebar";

interface StockLayoutProps {
  children: React.ReactNode;
}

const StocksLayout: React.FC<StockLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebarState');
      setSidebarOpen(savedState ? JSON.parse(savedState) : true);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "ml-72" : "ml-20"
      }`}>
        <StockNav />
        <div className="flex-1 p-4 pattern-dots pattern-green-300 dark:pattern-green-950 pattern-bg-white dark:pattern-bg-black pattern-size-2 pattern-opacity-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StocksLayout;