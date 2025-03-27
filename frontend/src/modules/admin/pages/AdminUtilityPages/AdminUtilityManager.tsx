import React, { useState, useEffect } from "react";
import { Button } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import UtilityLayout from "../../layout/UtilityLayouts/UtilityLayouts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../../../components/Model";
import { toast } from "react-toastify";

interface UtilityBill {
  id: number;
  billing_Acc_No: number;
  type: string;
  address: string;
  meter_No: string;
  unit_Price: number;
}

interface MonthlyUtilityBill {
  id: number;
  invoiceNo: number;
  billingAccNo: number;
  billingMonth: string;
  billingYear: number;
  units: number;
  totalPayment: number;
  generatedDate: string;
}

const AdminUtilityManager: React.FC = () => {
  const [utilities, setUtilities] = useState<UtilityBill[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentUtility, setCurrentUtility] = useState<
    Partial<UtilityBill> | undefined
  >(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [utilityToDelete, setUtilityToDelete] = useState<number | null>(null);
  const [monthlyBills, setMonthlyBills] = useState<MonthlyUtilityBill[]>([]);
  const [isLoadingMonthlyBills, setIsLoadingMonthlyBills] = useState<boolean>(false);

  useEffect(() => {
    fetchUtilities();
    fetchMonthlyBills();
  }, []);

  const fetchUtilities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8081/utilitybill/get");
      if (response.data) {
        setUtilities(response.data);
      }
    } catch (error) {
      console.error("Error fetching utilities:", error);
      setError("Failed to load utility bills");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyBills = async () => {
    setIsLoadingMonthlyBills(true);
    try {
      const response = await axios.get("http://localhost:8081/monthlyutilitybill/get");
      if (response.data) {
        setMonthlyBills(response.data);
      }
    } catch (error) {
      console.error("Error fetching monthly bills:", error);
    } finally {
      setIsLoadingMonthlyBills(false);
    }
  };

  // Prompt to delete a utility bill
  const promptDelete = (id: number) => {
    setUtilityToDelete(id);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Check if the utility bill can be deleted
  const canDeleteUtilityBill = (billingAccNo: number): boolean => {
    // Check if there are any monthly bills with this billing account number
    return !monthlyBills.some(bill => bill.billingAccNo === billingAccNo);
  };

  // Delete function with validation
  const confirmDelete = async () => {
    if (!utilityToDelete) return;

    setLoading(true);
    setDeleteError(null);
    
    try {
      // Find the utility bill to delete
      const utilityToRemove = utilities.find(utility => utility.id === utilityToDelete);
      
      if (!utilityToRemove) {
        throw new Error("Utility bill not found");
      }
      
      // Check if the utility bill can be deleted
      if (!canDeleteUtilityBill(utilityToRemove.billing_Acc_No)) {
        setDeleteError(
          "Cannot delete this utility bill because it has associated monthly billing records. " +
          "Please delete all monthly utility bills for this account first."
        );
        return;
      }
      
      // Proceed with deletion
      const response = await axios.delete(
        `http://localhost:8081/utilitybill/delete/${utilityToDelete}`
      );
      
      if (response.data) {
        toast.success("Utility bill deleted successfully");
        fetchUtilities(); // Refresh the list
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting utility:", error);
      setDeleteError("An error occurred while deleting the utility bill");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUtilityToDelete(null);
    setDeleteError(null);
  };

  const filteredUtilities = utilities.filter(
    (utility) =>
      utility.id.toString().includes(searchTerm) ||
      utility.billing_Acc_No.toString().includes(searchTerm) ||
      utility.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigation
  const navigate = useNavigate();

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
            onClick={() => navigate("/admin/utility/add")}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Utility Bill
          </Button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
            {error}
          </div>
        )}

        {/* Utility Bills Table */}
        {!loading && !error && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billing Account No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meter No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUtilities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No utility bills found
                    </td>
                  </tr>
                ) : (
                  filteredUtilities.map((utility) => (
                    <tr key={utility.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{utility.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {utility.billing_Acc_No}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {utility.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {utility.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {utility.meter_No}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {utility.unit_Price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin/utility/edit/${utility.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => promptDelete(utility.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="Confirm Deletion"
      >
        <div className="p-4">
          {deleteError ? (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">{deleteError}</p>
            </div>
          ) : (
            <p className="mb-4">
              Are you sure you want to delete this utility bill? This action cannot be undone.
            </p>
          )}
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Button>
            {!deleteError && (
              <Button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </UtilityLayout>
  );
};

export default AdminUtilityManager;
