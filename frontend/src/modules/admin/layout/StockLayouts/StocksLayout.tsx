import React from "react";
import Sidebar from "../../components/Sidebar";
import StockContent from "../../components/AdminStocks-pages/StockContent";

interface StockLayoutProps {
  children: React.ReactNode;
}

const StocksLayout: React.FC<StockLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <StockContent>{children}</StockContent>
    </div>
  );
};

export default StocksLayout;