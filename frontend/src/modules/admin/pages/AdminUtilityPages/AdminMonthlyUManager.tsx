import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import UtilityLayout from "../../layout/UtilityLayouts/UtilityLayouts";
import MonthlyUtilityBillForm from "../../components/AdminUtility-page/MonthlyUtilityBillForm";
import UtilityChartModal from "../../components/AdminUtility-page/UtilityChartModal";
import { MonthlyUtilityBill } from "../../../../types/Utility"; // Import the interface from Utility.ts

const AdminMonthlyUManager: React.FC = () => {
    const [monthlyBills, setMonthlyBills] = useState<MonthlyUtilityBill[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isChartModalOpen, setIsChartModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentBill, setCurrentBill] = useState<Partial<MonthlyUtilityBill> | undefined>(undefined);
    
    useEffect(() => {
        fetchMonthlyBills();
    }, []);

    const fetchMonthlyBills = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8081/monthlyutilitybill/get');
            if (response.ok) {
                const data = await response.json();
                setMonthlyBills(data);
            }
        } catch (error) {
            console.error('Error fetching monthly utility bills:', error);
            setError('Failed to fetch monthly utility bills');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this monthly utility bill?')) {
            try {
                const response = await fetch(`http://localhost:8081/monthlyutilitybill/delete/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchMonthlyBills(); // Refresh the list
                }
            } catch (error) {
                console.error('Error deleting monthly utility bill:', error);
            }
        }
    };

    const handleEdit = (bill: MonthlyUtilityBill) => {
        setCurrentBill(bill);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBill(undefined);
    };

    const filteredBills = monthlyBills.filter(bill => 
        bill.id.toString().includes(searchTerm) ||
        bill.invoiceNo.toString().includes(searchTerm) ||
        bill.billingAccNo.toString().includes(searchTerm) ||
        bill.billingMonth.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <UtilityLayout>
            <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
                    Manage Monthly Utility Bills
                </h2>
                <div className="flex items-center justify-between mt-12">
                    <input
                        type="text"
                        placeholder="Search monthly bills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md mb-4 bg-transparent"
                    />
                    <div className="flex space-x-2">
                        <Button
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                            onClick={() => setIsChartModalOpen(true)}
                        >
                            <ChartBarIcon className="w-5 h-5 mr-2" />
                            View Analytics
                        </Button>
                        <Button
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                            onClick={() => {
                                setCurrentBill(undefined);
                                setIsModalOpen(true);
                            }}
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Monthly Bill
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 mt-4">{error}</div>
                ) : (
                    <div className="mt-8 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Acc No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Month</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Year</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBills.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                                            No monthly bills found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBills.map((bill) => (
                                        <tr key={bill.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.invoiceNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.billingAccNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.billingMonth}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.billingYear}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.units}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.totalPayment}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{bill.generatedDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(bill)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(bill.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Monthly Utility Bill Form Modal */}
            <MonthlyUtilityBillForm 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                currentBill={currentBill}
                refreshData={fetchMonthlyBills}
            />

            {/* Utility Chart Modal */}
            <UtilityChartModal
                isOpen={isChartModalOpen}
                onClose={() => setIsChartModalOpen(false)}
                monthlyBills={monthlyBills}
            />
        </UtilityLayout>
    );
}

export default AdminMonthlyUManager;