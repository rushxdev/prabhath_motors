import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import StocksLayout from "../../layout/StockLayouts/StocksLayout";
import Modal from "../../../../components/Model";
import { Supplier } from "../../../../types/Stock";
//import { supplierService } from '../../../../services/stockSupplierService';
import SupplierForm from "../../components/AdminStocks-pages/SupplierForm";
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

const AdminSupplierManager: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier> | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/supplier/get');
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateSupplier = async (supplier: Partial<Supplier>) => {
        setLoading(true);
        setError(null);
        try {
            const url = supplier.supplierId 
                ? `http://localhost:8080/supplier/update/${supplier.supplierId}`
                : 'http://localhost:8080/supplier/save';
            
            const response = await fetch(url, {
                method: supplier.supplierId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplier),
            });

            if (!response.ok) {
                throw new Error('Failed to save supplier');
            }

            setIsModalOpen(false);
            setCurrentSupplier(undefined);
            await fetchSuppliers();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        setIsDeleteModalOpen(true);
        setSupplierToDelete(id);
    };

    const confirmDelete = async () => {
        if (!supplierToDelete) return;
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/supplier/delete/${supplierToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete supplier');
            }

            await fetchSuppliers();
            setIsDeleteModalOpen(false);
            setSupplierToDelete(null);
            setIsViewModalOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete supplier');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsViewModalOpen(true);
    };

    const filteredSuppliers = suppliers.filter(supplier => 
        supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <StocksLayout>
                <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
                        Manage Suppliers
                    </h2>
                    <div className="flex items-center justify-between mt-12">
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md mb-4 bg-transparent"
                        />
                        <Button
                            onClick={() => {
                                setCurrentSupplier(undefined);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Supplier
                        </Button>
                    </div>

                    {/* Suppliers Table */}
                    {loading ? (
                        <div className="flex justify-center items-center mt-16">
                            <p className="text-lg text-gray-700">Loading Suppliers...</p>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSuppliers.map((supplier, index) => (
                                        <tr 
                                            key={supplier.supplierId}
                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                        >
                                            <td className="px-6 py-4 text-left whitespace-nowrap">{supplier.supplierName}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">{supplier.contactPerson}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">{supplier.phoneNumber}</td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => handleView(supplier)}
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
                    title="Supplier Details"
                >
                    {selectedSupplier && (
                        <div className="space-y-6">
                            {/* Add this button for the cross icon */}
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="absolute top-4 right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>

                            <div className="bg-gray-50 dark:bg-gray-200 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4 text-primary">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Supplier ID</p>
                                        <p className="mt-1 text-gray-900 dark:text-green-700">{selectedSupplier.supplierId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Name</p>
                                        <p className="mt-1 text-gray-900 dark:text-green-700">{selectedSupplier.supplierName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Contact Person</p>
                                        <p className="mt-1 text-gray-900 dark:text-green-700">{selectedSupplier.contactPerson}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                        <p className="mt-1 text-gray-900 dark:text-green-700">{selectedSupplier.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        onClick={() => {
                                            setCurrentSupplier(selectedSupplier);
                                            setIsViewModalOpen(false);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex items-center px-4 py-2 bg-transparent text-green-700 border-2 border-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300"
                                    >
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedSupplier.supplierId)}
                                        className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-900 transition-all duration-300"
                                    >
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Create/Edit Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setCurrentSupplier(undefined);
                    }}
                    title={currentSupplier ? "Edit Supplier" : "Add New Supplier"}
                >
                    <SupplierForm
                        initialData={currentSupplier}
                        onSuccess={handleCreateOrUpdateSupplier}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setCurrentSupplier(undefined);
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
                        Are you sure you want to delete this supplier?<br/>
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

export default AdminSupplierManager;