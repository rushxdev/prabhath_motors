import React from "react";
import { useNavigate } from "react-router-dom";

const UtilityNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="stocknav container mx-auto bg-black text-white text-center py-5">
        <div className="grid grid-cols-4 gap-4">
            {/* 1st button */}
            <div 
              className="text-center space-y-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
              onClick={() => navigate('/admin/utility')}
            >
                <p className="uppercase tracking-wide text-xs">Utility Bills</p>
            </div>
          
            {/* 2nd button */}
            <div 
              className="text-center space-y-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
              onClick={() => navigate('/admin/monthly-utility')}
            >
                <p className="uppercase tracking-wide text-xs">Monthly Utility Bills</p>
            </div>

            {/* 3rd button */}
            <div 
              className="text-center space-y-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
               onClick={() => navigate('#')}  
            >
                <p className="uppercase tracking-wide text-xs">Miscelleneous Items</p>
            </div>

            {/* 4th button */}
            <div 
              className="text-center space-y-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
              onClick={() => navigate('/admin/utility-reports')}
            >
                <p className="uppercase tracking-wide text-xs">Utility Reports</p>
            </div>
        </div>
    </div>
  );
};

export default UtilityNav;
