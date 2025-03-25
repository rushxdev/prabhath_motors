import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";

interface StockItem {
    itemID: number;
    itemCtgryID: number;
    supplierId: number;
    itemName: string;
    itemBarcode: string;
    recorderLevel: number;
    qtyAvailable: number;
    itemBrand: string;
    unitPrice: number;
    stockLevel: string;
    rackNo: number;
    updatedDate: string;
}