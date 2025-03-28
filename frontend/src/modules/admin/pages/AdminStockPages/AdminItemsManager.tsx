import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import Modal from "../../../../components/Model";
import ItemForm from "../../components/AdminStocks-pages/ItemForm";
import { StockItem, Stock_In, ItemCategory } from "../../../../types/Stock";
import { itemService } from '../../../../services/stockItemService';
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

const AdminItemsManager: React.FC = () => {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentItem, setCurrentItem] = useState<Partial<StockItem> | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [eventToDelete, setEventToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
    const [categories, setCategories] = useState<ItemCategory[]>([]);
    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchStocks(), fetchCategories()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchStocks = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await itemService.getAllItems();
            setStocks(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };


    // Create or Update Item
    const handleCreateOrUpdateItem = async (item: Partial<StockItem>, stockInData: Partial<Stock_In>) => {
        setLoading(true);
        setError(null);
        try {
            const isUpdate = item.itemID !== undefined;
            const savedItem = isUpdate && item.itemID
                ? await itemService.updateItem(item.itemID, item)
                : await itemService.createItem(item);

            if (!isUpdate) {
                await itemService.createStockIn({
                    ...stockInData,
                    itemID: savedItem.itemID
                });
            }
            
            setIsModalOpen(false);
            setCurrentItem(undefined);
            await Promise.all([fetchStocks(), fetchCategories()]);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the item';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    // Delete Item
    const handleDelete = (id: number) => {
        setIsDeleteModalOpen(true);
        setEventToDelete(id);
    };

    const confirmDeleteItem = async () => {
        if (!eventToDelete) return;
        
        setLoading(true);
        try {
            await itemService.deleteItem(eventToDelete);
            await fetchStocks();
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete item');
        } finally {
            setLoading(false);
        }
    };
    
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
        // Reopen the view modal if there's a selected item
        if (selectedItem) {
            setIsViewModalOpen(true);
        }
    };

    // View Item
    const handleView = (item: StockItem) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    // Filter Stocks
    const filteredStocks = stocks.filter(stock => 
        (stock.itemID?.toString() ?? '').includes(searchTerm) ||
        stock.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch Categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await itemService.getAllCategories();
            setCategories(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch categories';
            setError(message);
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };
    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.itemCtgryId === categoryId);
        return category ? category.itemCtgryName : 'Unknown Category';
    };

    // Add this helper function at the top of the component
    const getStockLevelColor = (stockLevel: string) => {
        switch (stockLevel.toLowerCase()) {
            case 'high':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-orange-600';
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StocksLayout>
                {/* Sticky header container */}
                <div className="sticky top-20 z-40 bg-white shadow-md pb-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-2xl font-press font-semibold pt-10 text-primary">
                            Manage All Stock Items
                        </h2>
                        
                        <div className="flex items-center justify-between mt-8 px-4">
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md bg-transparent"
                            />
                            <Button
                                onClick={() => {
                                    setCurrentItem(undefined);
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table container with padding to prevent overlap */}
                <div className="max-w-7xl mx-auto text-center pt-4 mb-12 sm:mb-16">
                    {/* Stock Items Table */}
                    {loading ? (
                        <div className="flex justify-center items-center mt-16">
                        <p className="text-lg text-gray-700 dark:text-gray-300">
                            Loading Items...
                        </p>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">item Name</th>
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
                                {filteredStocks.map((stock, index) => (
                                    <tr 
                                        key={stock.itemID} // Using itemName as key is not reliable
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">{getCategoryName(stock.itemCtgryID)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.itemName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.qtyAvailable}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.itemBrand}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.sellPrice}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap font-semibold ${getStockLevelColor(stock.stockLevel)}`}>
                                            {stock.stockLevel}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.rackNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{stock.updatedDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleView(stock)}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            View Item
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>

                
                {/*ItemForm Modal component*/}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setCurrentItem(undefined);
                    }}
                    title={currentItem ? 'Edit Item' : 'Add New Item'}
                >
                    <ItemForm
                        initialData={currentItem}
                        categories={categories}
                        existingItems={stocks}
                        onSuccess={(itemData) => {
                            // stock object from item data
                            const stockData = {
                                itemID: itemData.itemID,
                                ctgryID: itemData.itemCtgryID,
                                supplierID: itemData.supplierId,
                                qtyAdded: itemData.qtyAvailable,
                                unitPrice: itemData.unitPrice,
                                sellPrice: itemData.sellPrice,
                                dateAdded: new Date().toISOString().split('T')[0]
                            };

                            const itemToSave = {
                                ...itemData,
                                itemCtgryID: itemData.itemCtgryID,
                            };
                            
                            handleCreateOrUpdateItem(itemToSave, stockData);
                        }}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setCurrentItem(undefined);
                        }}
                    />
                </Modal>

                {/* View Item Modal */}
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title="Item Details"
                >
                    {selectedItem && (
                        <div className="space-y-6">
                            {/* Add close button */}
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="absolute top-4 right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="col-span-2 bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Item ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.itemID}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Item Name</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.itemName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Identification */}
                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Identification</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Category</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getCategoryName(selectedItem.itemCtgryID)}
                                                <span className="text-gray-500 text-sm ml-2">
                                                    (ID: {selectedItem.itemCtgryID})
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Supplier ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.supplierId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Barcode</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.itemBarcode}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Details */}
                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Stock Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Stock Level</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.stockLevel}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Quantity Available</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.qtyAvailable}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Recorder Level</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.recorderLevel}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Product Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Brand</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.itemBrand}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Unit Price</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                ${selectedItem.sellPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Rack No</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedItem.rackNo}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="col-span-2 bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {new Date(selectedItem.updatedDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => {
                                                    setCurrentItem(selectedItem);
                                                    setIsViewModalOpen(false);
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex items-center px-4 py-2 bg-transparent text-green-700 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300"
                                            >
                                                <PencilIcon className="w-4 h-4 mr-2" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (selectedItem && selectedItem.itemID) {
                                                        handleDelete(selectedItem.itemID);
                                                        setIsViewModalOpen(false);
                                                    }
                                                }}
                                                className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 transition-all duration-300"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                    <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this Item?<br/>
                    <a className="text-red-400">This action cannot be undone.</a>
                    </p>
                    <div className="mt-4 flex justify-end">
                    <Button
                        type="button"
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md shadow-sm hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                        onClick={cancelDelete}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition"
                        onClick={confirmDeleteItem}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                    </div>
                </Modal>
            </StocksLayout>
        </ErrorBoundary>
    );
}

export default AdminItemsManager;