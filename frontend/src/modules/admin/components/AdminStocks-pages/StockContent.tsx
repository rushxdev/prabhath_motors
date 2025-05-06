import React from "react";
import StockNav from "./StockNavigation";

interface StockContentProps {
  children: React.ReactNode;
}

const StockContent: React.FC<StockContentProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Fixed stock navigation bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <StockNav />
      </div>
      
      {/* Scrollable stock content area (all dynamin pages)*/}
      <div className="flex-1 overflow-y-auto pattern-dots pattern-green-300 dark:pattern-green-950 pattern-bg-white dark:pattern-bg-black pattern-size-2 pattern-opacity-100 p-4">
        {children}
      </div>
    </div>
  );
};

export default StockContent;