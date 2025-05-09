import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Employee } from "../../../../types/Employee";
import employeeService from "../../../../services/employeeService";
import EmployeeModal from "../../components/AdminEmployee-pages/EmployeeModal";
import Modal from "../../../../components/Model";

const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = employees.filter(
        (emp) =>
          emp.firstname.toLowerCase().includes(lowercasedSearch) ||
          emp.lastname.toLowerCase().includes(lowercasedSearch) ||
          emp.role.toLowerCase().includes(lowercasedSearch) ||
          emp.contact.includes(searchTerm) ||
          emp.nic.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openEmployeeModal = (employee?: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const closeEmployeeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(undefined);
  };

  const promptDelete = (id: number) => {
    setEmployeeToDelete(id);
    setIsDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await employeeService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.empId !== id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
      setDeleteError("Failed to delete employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
    setDeleteError(null);
  };

  return (
    <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
        Manage All Employees
      </h2>

      <div className="flex items-center justify-between mt-12">
        <div className="relative w-full sm:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, role, contact, or NIC..."
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
          onClick={() => openEmployeeModal()}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? "No employees match your search criteria." : "No employees found. Add your first employee!"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIC
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary (Rs)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.empId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.empId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{emp.firstname} {emp.lastname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.nic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{emp.salary.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => openEmployeeModal(emp)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => emp.empId !== undefined && promptDelete(emp.empId)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={closeEmployeeModal}
        currentEmployee={currentEmployee}
        refreshData={fetchEmployees}
      />

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
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            {!deleteError && (
              <button
                type="button"
                onClick={() => employeeToDelete !== null && handleDelete(employeeToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManager;
