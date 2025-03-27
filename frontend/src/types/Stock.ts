export interface StockItem {
    itemID?: number;
    itemCtgryID: number;
    supplierId: number;
    itemName: string;
    itemBarcode: string;
    recorderLevel: number;
    qtyAvailable: number;
    itemBrand: string;
    sellPrice: number;
    unitPrice: number;
    stockLevel: string;
    rackNo: number;
    updatedDate: string;
}

export interface ItemCategory {
    itemCtgryId: number;
    itemID: number;
    itemCtgryName: string;
}

export interface Stock_In {
    stockInId?: number;
    itemID: number;
    ctgryID: number;
    supplierID: number;
    qtyAdded: number;
    unitPrice: number;
    sellPrice: number;
    dateAdded: string;
}