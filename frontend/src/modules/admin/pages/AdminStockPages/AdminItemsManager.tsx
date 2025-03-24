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

const AdminItemsManager: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentItem, setCurrentItem] = useState<Partial<StockItem> | undefined>(undefined);
    

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/item/get');
            if (response.ok) {
                const data = await response.json();
                setStocks(data);
            }
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8081/item/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchStocks(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    const filteredStocks = stocks.filter(stock => 
        stock.itemID.toString().includes(searchTerm) ||
        stock.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <StocksLayout>
            <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
                    Manage All Stock Items
                </h2>
                <div className="flex items-center justify-between mt-12">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md mb-4 bg-transparent"
                    />
                    <Button
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                        onClick={() => {
                            setCurrentItem(undefined);
                            setIsModalOpen(true);
                        }}
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Stock
                    </Button>
                </div>

                {/* Stock Items Table */}
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item CategoryID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">supplier ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">item Barcode</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">recorder Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">qty Available</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">item Brand</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">stock Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">rack No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">updated Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStocks.map((stock) => (
                                <tr key={stock.itemName}>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.itemID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.itemCtgryID}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.supplierId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.itemName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.itemBarcode}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.recorderLevel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.qtyAvailable}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.itemBrand}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.unitPrice}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.stockLevel}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.rackNo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{stock.updatedDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(stock.itemID)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </StocksLayout>
    );
}

export default AdminItemsManager;