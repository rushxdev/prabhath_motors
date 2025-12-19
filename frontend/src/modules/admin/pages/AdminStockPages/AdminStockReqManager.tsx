import React from "react";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";


const AdminStockReqManager: React.FC = () => {
    return (
        <StocksLayout>
            <div className="text-red-700">No Stock requests yet</div>
        </StocksLayout>
    );
}

export default AdminStockReqManager;