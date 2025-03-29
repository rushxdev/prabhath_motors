import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StockNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sticky top-0 z-40 w-full bg-black text-white shadow-md">
      <div className="px-4 py-5">
        <div className="grid grid-cols-4 gap-4">
          {/* All Items tab */}
          <div 
            className={`text-center space-y-2 cursor-pointer p-2 rounded transition-all duration-300 
              ${isActive('/admin/items') 
                ? 'bg-gray-700 text-white' 
                : 'hover:bg-gray-800'}`}
            onClick={() => navigate('/admin/items')}
          >
            <p className="uppercase tracking-wide text-xs">All Items</p>
          </div>
        
          {/* Stock Requests tab */}
          <div 
            className={`text-center space-y-2 cursor-pointer p-2 rounded transition-all duration-300 
              ${isActive('/admin/stock-requests') 
                ? 'bg-gray-700 text-white' 
                : 'hover:bg-gray-800'}`}
            onClick={() => navigate('/admin/stock-requests')}
          >
            <p className="uppercase tracking-wide text-xs">Stock Requests</p>
          </div>

          {/* Order Stocks tab */}
          <div 
            className={`text-center space-y-2 cursor-pointer p-2 rounded transition-all duration-300 
              ${isActive('/admin/order-stocks') 
                ? 'bg-gray-700 text-white' 
                : 'hover:bg-gray-800'}`}
            onClick={() => navigate('/admin/order-stocks')}
          >
            <p className="uppercase tracking-wide text-xs">Order Stocks</p>
          </div>

          {/* Supplier Details tab */}
          <div 
            className={`text-center space-y-2 cursor-pointer p-2 rounded transition-all duration-300 
              ${isActive('/admin/supplier-details') 
                ? 'bg-gray-700 text-white' 
                : 'hover:bg-gray-800'}`}
            onClick={() => navigate('/admin/supplier-details')}
          >
            <p className="uppercase tracking-wide text-xs">Supplier Details</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockNav;
