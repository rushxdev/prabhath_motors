import React from "react";
import DateRangeParameters from "./DateRangeParameters";

interface InventoryParametersProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  showLowStock: boolean;
  setShowLowStock: (show: boolean) => void;
}

const InventoryParameters: React.FC<InventoryParametersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showLowStock,
  setShowLowStock
}) => {
  return (
    <div className="space-y-4">
      <DateRangeParameters 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      
      <div>
        <label className="flex items-center space-x-2">
          <input 
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="rounded text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">Show only low stock items</span>
        </label>
      </div>
    </div>
  );
};

export default InventoryParameters;