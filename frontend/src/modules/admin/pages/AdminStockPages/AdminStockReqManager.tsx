import React from "react";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";

interface StockItem {
    stockInID: number;
    itemID: number;
    ctgryID: number;
    supplierID: number;
    qtyAdded: number;
    unitPrice: number;
    sellPrice: number;
    dateAdded: string;
}

const AdminStockReqManager: React.FC = () => {
    return (
        <StocksLayout>
            <div>Admin Items Manager</div>
        </StocksLayout>
    );
}

export default AdminStockReqManager;