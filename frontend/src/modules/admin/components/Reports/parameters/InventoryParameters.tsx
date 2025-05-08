import React from "react";
import DateRangeParameters from "./DateRangeParameters";

interface InventoryParametersProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  showLowStock: boolean;
  setShowLowStock: (show: boolean) => void;
  sortBy?: string;
  setSortBy?: (sortField: string) => void;
  showChart?: boolean;
  setShowChart?: (show: boolean) => void;
}

const InventoryParameters: React.FC<InventoryParametersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showLowStock,
  setShowLowStock,
  sortBy = 'stockLevel', 
  setSortBy = () => {},
  showChart = true,
  setShowChart = () => {}
}) => {
  return (
    <div className="space-y-4">
      <DateRangeParameters 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      
      <div className="flex flex-col space-y-4">
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox"
              checked={showLowStock}
              onChange={(e) => setShowLowStock(e.target.checked)}
              className="rounded text-green-600"
            />
            <span className="text-sm font-medium text-gray-700">Show only low stock items</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox"
              checked={showChart}
              onChange={(e) => setShowChart(e.target.checked)}
              className="rounded text-green-600"
            />
            <span className="text-sm font-medium text-gray-700">Show stock level distribution chart</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="stockLevel">Stock Level</option>
            <option value="qtyAvailable">Quantity (Low to High)</option>
            <option value="inventoryValue">Value (High to Low)</option>
            <option value="itemName">Item Name (A-Z)</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InventoryParameters;