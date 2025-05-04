import React, { useState, useEffect } from "react";
import { Button as HeadlessButton } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import Modal from "../../../../components/Model";
import { Stock_In, StockItem, ItemCategory, Supplier } from "../../../../types/Stock";
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
    error: Error;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
    <div className="text-red-500 p-4">
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
    </div>
);

const AdminStockOrderManager: React.FC = () => {
    const [stocks, setStocks] = useState<Stock_In[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentStock, setCurrentStock] = useState<Partial<Stock_In> | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [stockToDelete, setStockToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedStock, setSelectedStock] = useState<Stock_In | null>(null);
    const [items, setItems] = useState<StockItem[]>([]);
    const [categories, setCategories] = useState<ItemCategory[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        fetchStocks();
        fetchItems();
        fetchCategories();
        fetchSuppliers();
    }, []);

    const fetchStocks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/stock_in/get');
            if (!response.ok) {
                throw new Error('Failed to fetch stocks');
            }
            const data = await response.json();
            setStocks(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:8081/item/get');
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8081/itemCtgry/get');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:8081/supplier/get');
            if (!response.ok) throw new Error('Failed to fetch suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const getItemName = (itemId: number) => {
        const item = items.find(item => item.itemID === itemId);
        return item ? item.itemName : 'Unknown Item';
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.itemCtgryId === categoryId);
        return category ? category.itemCtgryName : 'Unknown Category';
    };

    const getSupplierName = (supplierId: number) => {
        const supplier = suppliers.find(sup => sup.supplierId === supplierId);
        return supplier ? supplier.supplierName : 'Unknown Supplier';
    };

    const handleDelete = (id: number) => {
        setIsDeleteModalOpen(true);
        setStockToDelete(id);
    };

    const confirmDelete = async () => {
        if (!stockToDelete) {
            console.log('No stock to delete');
            return;
        }
        
        setLoading(true);
        try {
            console.log('Attempting to delete stock:', stockToDelete);
            const response = await fetch(`http://localhost:8081/stock_in/delete/${stockToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete stock');
            }

            console.log('Stock deleted successfully');
            await fetchStocks();
            setIsDeleteModalOpen(false);
            setStockToDelete(null);
            setIsViewModalOpen(false);
        } catch (error) {
            console.error('Delete error:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete stock');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (stock: Stock_In) => {
        setSelectedStock(stock);
        setIsViewModalOpen(true);
    };

    const filteredStocks = stocks.filter(stock => {
        const itemName = getItemName(stock.itemID).toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return stock.stockInID?.toString().includes(searchTerm) ||
               stock.itemID.toString().includes(searchTerm) ||
               itemName.includes(searchLower);
    });

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StocksLayout>
                <div className="sticky top-20 z-40 bg-white shadow-md pb-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-2xl font-press font-semibold pt-10 text-primary">
                            Manage Stock Orders
                        </h2>
                        
                        <div className="flex items-center justify-between mt-8 px-4">
                            <input
                                type="text"
                                placeholder="Search by item name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md bg-transparent"
                            />
                            {/*<HeadlessButton
                                onClick={() => {
                                    setCurrentStock(undefined);
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Stock Order
                            </HeadlessButton>*/}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto text-center pt-4 mb-12 sm:mb-16">
                    {loading ? (
                        <div className="flex justify-center items-center mt-16">
                            <p className="text-lg text-gray-700">Loading Stocks...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center mt-16">
                            <p className="text-lg text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="mt-8 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Added</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStocks.map((stock, index) => (
                                        <tr 
                                            key={stock.stockInID}
                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                        >
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{getItemName(stock.itemID)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{getCategoryName(stock.ctgryID)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{getSupplierName(stock.supplierID)}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">{stock.qtyAdded}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">Rs.{stock.unitPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">Rs.{stock.sellPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">{stock.dateAdded}</td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => handleView(stock)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* View Modal */}
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title="Stock Order Details"
                >
                    {selectedStock && (
                        <div className="space-y-6">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="absolute top-4 right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Stock Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Stock ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedStock.stockInID}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Item</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getItemName(selectedStock.itemID)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Category</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getCategoryName(selectedStock.ctgryID)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Supplier</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getSupplierName(selectedStock.supplierID)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Order Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Quantity Added</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedStock.qtyAdded}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Unit Price</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">Rs.{selectedStock.unitPrice.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Sell Price</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">Rs.{selectedStock.sellPrice.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date Added</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedStock.dateAdded}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => {
                                        setCurrentStock(selectedStock);
                                        setIsViewModalOpen(false);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex items-center px-4 py-2 bg-transparent text-green-700 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedStock.stockInID!)}
                                    className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 transition-all duration-300"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Deletion"
                >
                    <p className="text-gray-700">
                        Are you sure you want to delete this stock order?<br/>
                        <span className="text-red-400">This action cannot be undone.</span>
                    </p>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={confirmDelete}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </Modal>
            </StocksLayout>
        </ErrorBoundary>
    );
}

export default AdminStockOrderManager;