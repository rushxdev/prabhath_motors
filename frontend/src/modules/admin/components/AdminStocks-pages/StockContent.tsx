import React from "react";
import StockNav from "./StockNavigation";

interface StockContentProps {
  children: React.ReactNode;
}

const StockContent: React.FC<StockContentProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">
      <StockNav />
      <div className="max-w-full pattern-dots pattern-green-300 dark:pattern-green-950 pattern-bg-white dark:pattern-bg-black pattern-size-2 pattern-opacity-100 min-h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default StockContent;