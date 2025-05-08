import React from "react";
import Sidebar from "../../components/Sidebar";
import UtilityContent from "../../components/AdminUtility-page/UtilityContent";

interface StockLayoutProps {
  children: React.ReactNode;
}

const StocksLayout: React.FC<StockLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
    <Sidebar />
    <UtilityContent>{children}</UtilityContent>
    </div>
  );
};

export default StocksLayout;