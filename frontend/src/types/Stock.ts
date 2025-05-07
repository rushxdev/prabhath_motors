export interface StockItem {
    itemID?: number;
    itemName: string;
    qtyAvailable: number;
    unitPrice: number;
    sellPrice: number;
    itemCtgryID: number;
    supplierId: number;
    itemBarcode: string;
    recorderLevel: number;
    itemBrand: string;
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
    stockInID?: number;
    itemID: number;
    ctgryID: number;
    supplierID: number;
    qtyAdded: number;
    unitPrice: number;
    sellPrice: number;
    dateAdded: string;
}

export interface Supplier {
    supplierId: number;
    supplierName: string;
    contactPerson: string;
    phoneNumber: number;
}