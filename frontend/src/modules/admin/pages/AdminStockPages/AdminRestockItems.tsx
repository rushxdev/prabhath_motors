import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import Modal from "../../../../components/Model";
import { ErrorBoundary } from 'react-error-boundary';
import { StockItem, Supplier } from "../../../../types/Stock";
import apiClient from "../../../../axios.config";

interface Restock {
    restockID: number;
    itemID: number;
    supplierID: number;
    restockStatus: "Pending" | "In Progress" | "Completed" | "Cancelled";
    restockedQty: number;
    date: string;
}

interface ErrorFallbackProps {
    error: Error;
}

const ErrorFallback = ({ error }: ErrorFallbackProps) => (
    <div className="text-red-500 p-4">
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
    </div>
);

const RestockForm: React.FC<{
    initialData?: Partial<Restock>;
    items: StockItem[];
    suppliers: Supplier[];
    onSuccess: (restock: Partial<Restock>) => void;
    onCancel: () => void;
}> = ({ initialData, items, suppliers, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<Partial<Restock>>(() => {
        if (initialData) {
            return { ...initialData };
        } else {
            return {
                itemID: undefined,
                supplierID: undefined,
                restockStatus: "Pending",
                restockedQty: undefined,
                date: new Date().toISOString().split('T')[0]
            };
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [itemError, setItemError] = useState<string | null>(null);
    const [supplierError, setSupplierError] = useState<string | null>(null);
    const [qtyError, setQtyError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Validation
        if (name === "itemID") {
            if (!value) {
                setItemError("Item is required");
            } else {
                setItemError(null);
            }
        }

        if (name === "supplierID") {
            if (!value) {
                setSupplierError("Supplier is required");
            } else {
                setSupplierError(null);
            }
        }

        if (name === "restockedQty") {
            const qty = Number(value);
            if (!value) {
                setQtyError("Quantity is required");
            } else if (isNaN(qty) || qty <= 0) {
                setQtyError("Quantity must be a positive number");
            } else if (!Number.isInteger(qty)) {
                setQtyError("Quantity must be a whole number");
            } else {
                setQtyError(null);
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === "itemID" || name === "supplierID" || name === "restockedQty" 
                ? Number(value) 
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // Validate form
            if (!formData.itemID) {
                setItemError("Item is required");
                throw new Error("Item is required");
            }
            if (!formData.supplierID) {
                setSupplierError("Supplier is required");
                throw new Error("Supplier is required");
            }
            if (!formData.restockedQty) {
                setQtyError("Quantity is required");
                throw new Error("Quantity is required");
            }

            onSuccess(formData);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Item<span className="text-red-500">*</span>
                    </label>
                    <select
                        name="itemID"
                        value={formData.itemID || ""}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            itemError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    >
                        <option value="">Select an Item</option>
                        {items.map(item => (
                            <option key={item.itemID} value={item.itemID}>
                                {item.itemName} ({item.itemBrand}) - Available: {item.qtyAvailable}
                            </option>
                        ))}
                    </select>
                    {itemError && <p className="text-red-500 text-sm mt-1">{itemError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Supplier<span className="text-red-500">*</span>
                    </label>
                    <select
                        name="supplierID"
                        value={formData.supplierID || ""}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            supplierError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    >
                        <option value="">Select a Supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.supplierId} value={supplier.supplierId}>
                                {supplier.supplierName}
                            </option>
                        ))}
                    </select>
                    {supplierError && <p className="text-red-500 text-sm mt-1">{supplierError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Restock Status<span className="text-red-500">*</span>
                    </label>
                    <select
                        name="restockStatus"
                        value={formData.restockStatus || "Pending"}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Quantity<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="restockedQty"
                        value={formData.restockedQty || ""}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border p-2 ${
                            qtyError ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="1"
                        step="1"
                        required
                    />
                    {qtyError && <p className="text-red-500 text-sm mt-1">{qtyError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Date<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                        required
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="flex justify-end space-x-2 mt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {initialData?.restockID ? 'Update Restock' : 'Create Restock'}
                </Button>
            </div>
        </form>
    );
};

const AdminRestockItems: React.FC = () => {
    const [restocks, setRestocks] = useState<Restock[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentRestock, setCurrentRestock] = useState<Partial<Restock> | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [restockToDelete, setRestockToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedRestock, setSelectedRestock] = useState<Restock | null>(null);
    const [items, setItems] = useState<StockItem[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchRestocks(), fetchItems(), fetchSuppliers(), fetchCategories()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchRestocks = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get('/restock/get');
            setRestocks(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const { data } = await apiClient.get('/item/get');
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const { data } = await apiClient.get('/supplier/get');
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await apiClient.get('/itemCtgry/get');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateOrUpdateRestock = async (restock: Partial<Restock>) => {
        setLoading(true);
        setError(null);
        try {
            const isUpdate = restock.restockID !== undefined;
            
            if (isUpdate) {
                await apiClient.put(`/restock/update/${restock.restockID}`, restock);
            } else {
                await apiClient.post('/restock/save', restock);
            }

            setIsModalOpen(false);
            setCurrentRestock(undefined);
            await fetchRestocks();
        } catch (error) {
            setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        setIsDeleteModalOpen(true);
        setRestockToDelete(id);
    };

    const confirmDelete = async () => {
        if (!restockToDelete) return;
        
        setLoading(true);
        try {
            await apiClient.delete(`/restock/delete/${restockToDelete}`);
            await fetchRestocks();
            setIsDeleteModalOpen(false);
            setRestockToDelete(null);
            setIsViewModalOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete restock item');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (restock: Restock) => {
        setSelectedRestock(restock);
        setIsViewModalOpen(true);
    };

    const getItemName = (itemId: number) => {
        const item = items.find(item => item.itemID === itemId);
        return item ? item.itemName : 'Unknown Item';
    };

    const getSupplierName = (supplierId: number) => {
        const supplier = suppliers.find(sup => sup.supplierId === supplierId);
        return supplier ? supplier.supplierName : 'Unknown Supplier';
    };

    const getItemBrand = (itemId: number) => {
        const item = items.find(item => item.itemID === itemId);
        return item ? item.itemBrand : '';
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.itemCtgryId === categoryId);
        return category ? category.itemCtgryName : 'Unknown Category';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'text-green-600';
            case 'In Progress':
                return 'text-blue-600';
            case 'Pending':
                return 'text-yellow-600';
            case 'Cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const filteredRestocks = restocks.filter(restock => {
        const itemName = getItemName(restock.itemID).toLowerCase();
        const supplierName = getSupplierName(restock.supplierID).toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return itemName.includes(searchLower) ||
               supplierName.includes(searchLower) ||
               restock.restockStatus.toLowerCase().includes(searchLower);
    });

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StocksLayout>
                {/* Sticky header container */}
                <div className="sticky top-1 z-40 bg-white pb-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h2 className="text-2xl sm:text-2xl font-press font-semibold pt-10 text-primary">
                            Manage Restock Items
                        </h2>
                        
                        <div className="flex items-center justify-between mt-8 px-4">
                            <input
                                type="text"
                                placeholder="Search restocks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md bg-transparent"
                            />
                            <Button
                                onClick={() => {
                                    setCurrentRestock(undefined);
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Add Restock
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto text-center pt-4 mb-12">
                    {/* Low Stock Items Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-left text-primary pb-2">
                            Low Stock Items
                        </h3>
                        
                        {loading ? (
                            <div className="flex justify-center items-center mt-4">
                                <p className="text-lg text-green-300">Loading low stock items...</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {/* Header Row */}
                                <div className="grid grid-cols-7 bg-gray-50 rounded-t-lg py-3">
                                    <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</div>
                                    <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</div>
                                    <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</div>
                                    <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</div>
                                    <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</div>
                                    <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</div>
                                    <div className="px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</div>
                                </div>

                                {/* Item Rows */}
                                {items
                                    .filter(item => item.stockLevel === "Low" || item.stockLevel === "Critical")
                                    .map((item, index) => (
                                        <div 
                                            key={item.itemID}
                                            className={`grid grid-cols-7 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                        >
                                            <div className="px-6 py-3 text-left whitespace-nowrap">
                                                <p className="text-medium font-medium text-gray-900">{item.itemName}</p>
                                            </div>
                                            <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                                {item.itemBrand || 'N/A'}
                                            </div>
                                            <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                                {getCategoryName(item.itemCtgryID)}
                                            </div>
                                            <div className="px-6 py-3 text-left whitespace-nowrap">
                                                <span 
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-medium font-medium ${
                                                        item.stockLevel === "Critical" ? " text-red-800" : " text-yellow-800"
                                                    }`}
                                                >
                                                    {item.stockLevel}
                                                </span>
                                            </div>
                                            <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                                {item.qtyAvailable}
                                            </div>
                                            <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                                {item.recorderLevel}
                                            </div>
                                            <div className="px-6 py-3 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        const suggestedQty = Math.max(
                                                            item.recorderLevel * 2 - item.qtyAvailable,
                                                            item.recorderLevel
                                                        );
                                                        setCurrentRestock({
                                                            itemID: item.itemID,
                                                            supplierID: item.supplierId,
                                                            restockStatus: "Pending",
                                                            restockedQty: suggestedQty,
                                                            date: new Date().toISOString().split('T')[0]
                                                        });
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-green-600 hover:text-green-900 font-medium bg-blue-50 px-3 py-1 rounded"
                                                >
                                                    Mark Reorder
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                
                                {/* Empty state message */}
                                {items.filter(item => item.stockLevel === "Low" || item.stockLevel === "Critical").length === 0 && (
                                    <div className="col-span-7 px-6 py-4 text-center text-sm text-gray-500 bg-white">
                                        No low stock items found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Existing Restock Items Table Header */}
                    <h3 className="text-xl font-semibold mb-4 text-left text-primary pb-2">
                        All Restock Orders
                    </h3>

                    {/* Restock Items */}
                    {loading ? (
                        <div className="flex justify-center items-center mt-4">
                            <p className="text-lg text-green-300">Loading Restock Items...</p>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center mt-4">
                            <p className="text-lg text-red-500">{error}</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {/* Header Row */}
                            <div className="grid grid-cols-7 bg-gray-50 rounded-t-lg py-3">
                                <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</div>
                                <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</div>
                                <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</div>
                                <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</div>
                                <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</div>
                                <div className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</div>
                                <div className="px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
                            </div>

                            {/* Restock Order Rows */}
                            {filteredRestocks.map((restock, index) => (
                                <div 
                                    key={restock.restockID}
                                    className={`grid grid-cols-7 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors duration-150 ease-in-out`}
                                >
                                    <div className="px-6 py-3 text-left whitespace-nowrap">
                                        <p className="text-medium font-medium text-gray-900">
                                            {getItemName(restock.itemID)}
                                        </p>
                                    </div>
                                    <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                        {getItemBrand(restock.itemID) || 'N/A'}
                                    </div>
                                    <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                        {getSupplierName(restock.supplierID)}
                                    </div>
                                    <div className="px-6 py-3 text-left whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-medium font-medium
                                            ${restock.restockStatus === "Completed" ? " text-green-800" : 
                                              restock.restockStatus === "In Progress" ? " text-blue-800" : 
                                              restock.restockStatus === "Pending" ? " text-yellow-800" : 
                                              "bg-red-100 text-red-800"}`}
                                        >
                                            {restock.restockStatus}
                                        </span>
                                    </div>
                                    <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                        {restock.restockedQty}
                                    </div>
                                    <div className="px-6 py-3 text-left whitespace-nowrap text-medium text-gray-600">
                                        {restock.date}
                                    </div>
                                    <div className="px-6 py-3 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => handleView(restock)}
                                            className="text-green-600 hover:text-green-900 font-medium"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Empty state message */}
                            {filteredRestocks.length === 0 && (
                                <div className="col-span-7 px-6 py-4 text-center text-medium text-gray-500 bg-white">
                                    No restock orders found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* View Modal */}
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title="Restock Details"
                >
                    {selectedRestock && (
                        <div className="space-y-6">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="absolute top-4 right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Restock Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Restock ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedRestock.restockID}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Status</p>
                                            <p className={`mt-1 font-semibold ${getStatusColor(selectedRestock.restockStatus)}`}>
                                                {selectedRestock.restockStatus}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedRestock.date}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Item Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Item</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getItemName(selectedRestock.itemID)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Brand</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getItemBrand(selectedRestock.itemID)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Quantity</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">{selectedRestock.restockedQty}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Supplier</p>
                                            <p className="mt-1 text-gray-900 dark:text-green-700">
                                                {getSupplierName(selectedRestock.supplierID)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => {
                                        setCurrentRestock(selectedRestock);
                                        setIsViewModalOpen(false);
                                        setIsModalOpen(true);
                                    }}
                                    className="flex items-center px-4 py-2 bg-transparent text-green-700 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300"
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedRestock.restockID)}
                                    className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 transition-all duration-300"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Create/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setCurrentRestock(undefined);
                    }}
                    title={currentRestock ? 'Edit Restock' : 'Add New Restock'}
                >
                    <RestockForm
                        initialData={currentRestock}
                        items={items}
                        suppliers={suppliers}
                        onSuccess={handleCreateOrUpdateRestock}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setCurrentRestock(undefined);
                        }}
                    />
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Confirm Deletion"
                >
                    <p className="text-gray-700">
                        Are you sure you want to delete this restock item?<br/>
                        <span className="text-red-400">This action cannot be undone.</span>
                    </p>
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={confirmDelete}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </Modal>
            </StocksLayout>
        </ErrorBoundary>
    );
};

export default AdminRestockItems;