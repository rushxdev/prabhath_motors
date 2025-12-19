import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";

const StockNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin/items', label: 'All Items' },
    /*{ path: '/admin/stock-requests', label: 'Stock Requests' },*/
    { path: '/admin/order-stocks', label: 'Ordered Stocks' },
    { path: '/admin/supplier-details', label: 'Supplier Details' },
    { path: '/admin/restock-Items', label: 'Restock Items' },
    { path: '/admin/stock-reports', label: 'Stock Reports' },
  ];

  return (
    <div className="w-full bg-black text-white text-center py-5">
      <div className="container mx-auto">
        <LayoutGroup>
          <div className="grid grid-cols-5 gap-4 justify-center relative">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <div
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="relative text-center flex items-center justify-center cursor-pointer p-3 rounded hover:text-green-500 transition-colors duration-300"

                >
                  <p className="uppercase tracking-wide text-xs relative z-10">
                    {item.label}
                  </p>

                  {/* Bottom-Right line */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 z-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, transparent 30%, rgba(34,197,94,0.4) 60%, transparent 90%)`,
                        height: "100%",
                        top: "12.5%",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
};

export default StockNav;
