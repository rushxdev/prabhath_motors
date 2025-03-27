import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import UtilityLayout from "../../layout/UtilityLayouts/UtilityLayouts";

interface UtilityBill {
    id: number;
    billing_Acc_No: number;
    type: string;
    address: string;
    meter_No: string;
    unit_Price: number;
}

const AdminUtilityManager: React.FC = () => {
    const [utilities, setUtilities] = useState<UtilityBill[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentUtility, setCurrentUtility] = useState<Partial<UtilityBill> | undefined>(undefined);
    
    useEffect(() => {
        fetchUtilities();
    }, []);

    const fetchUtilities = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/utilitybill/get');
            if (response.ok) {
                const data = await response.json();
                setUtilities(data);
            }
        } catch (error) {
            console.error('Error fetching utilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8081/utility/delete/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchUtilities(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting utility:', error);
        }
    };

    const filteredUtilities = utilities.filter(utility => 
        utility.id.toString().includes(searchTerm) ||
        utility.billing_Acc_No.toString().includes(searchTerm) ||
        utility.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UtilityLayout>
            <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
                    Manage All Utility Bills
                </h2>
                <div className="flex items-center justify-between mt-12">
                    <input
                        type="text"
                        placeholder="Search utilities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md mb-4 bg-transparent"
                    />
                    <Button
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                        onClick={() => {
                            setCurrentUtility(undefined);
                            setIsModalOpen(true);
                        }}
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Utility Bill
                    </Button>
                </div>

                {/* Utility Bills Table */}
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Account No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meter No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUtilities.map((utility) => (
                                <tr key={utility.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{utility.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{utility.billing_Acc_No}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{utility.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{utility.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{utility.meter_No}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{utility.unit_Price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleDelete(utility.id)}
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
        </UtilityLayout>
    );
}

export default AdminUtilityManager;
