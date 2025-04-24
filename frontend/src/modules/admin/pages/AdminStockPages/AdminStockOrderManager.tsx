import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import Modal from "../../../../components/Model";
import { Stock_In, ItemCategory } from "../../../../types/Stock";
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

const AdminStockOrderManager: React.FC = () => {
    const [stockOrders, setStockOrders] = useState<Stock_In[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentOrder, setCurrentOrder] = useState<Partial<Stock_In> | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Stock_In | null>(null);
    const [categories, setCategories] = useState<ItemCategory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchStockOrders(), fetchCategories()]);
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchStockOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/stock_in/get');
            if (!response.ok) {
                throw new Error('Failed to fetch stock orders');
            }
            const data = await response.json();
            setStockOrders(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await itemService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.itemCtgryId === categoryId);
        return category ? category.itemCtgryName : 'Unknown Category';
    };

    // Filter Stock Orders
    const filteredOrders = stockOrders.filter(order => 
        (order.stockInId?.toString() ?? '').includes(searchTerm) ||
        (order.itemID?.toString() ?? '').includes(searchTerm)
    );

    // View Order Details
    const handleView = (order: Stock_In) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StocksLayout>
                <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
                        Stock Orders Management
                    </h2>
                    <div className="flex items-center justify-between mt-12">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md mb-4 bg-transparent"
                        />
                    </div>

                    {/* Stock Orders Table */}
                    {loading ? (
                        <div className="flex justify-center items-center mt-16">
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Loading Orders...
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Added</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map((order, index) => (
                                        <tr 
                                            key={order.stockInId}
                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">{order.stockInId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.itemID}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getCategoryName(order.ctgryID)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.supplierID}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.qtyAdded}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${order.unitPrice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${order.sellPrice}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.dateAdded}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleView(order)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    View Order
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* View Order Modal */}
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => setIsViewModalOpen(false)}
                    title="Order Details"
                >
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Order ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedOrder.stockInId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Date Added</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedOrder.dateAdded}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Item Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Item ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedOrder.itemID}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Category</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                {getCategoryName(selectedOrder.ctgryID)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Supplier ID</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedOrder.supplierID}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4 text-primary">Pricing Details</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Quantity Added</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">{selectedOrder.qtyAdded}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Unit Price</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                ${selectedOrder.unitPrice.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Sell Price</p>
                                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                                                ${selectedOrder.sellPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </StocksLayout>
        </ErrorBoundary>
    );
};

export default AdminStockOrderManager;