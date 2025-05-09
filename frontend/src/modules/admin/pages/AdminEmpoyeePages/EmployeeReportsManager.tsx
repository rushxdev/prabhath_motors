import React, { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ErrorBoundary } from 'react-error-boundary';
import EmployeeManagerLayout from '../../layout/EmployeeLayouts/EmployeeManagerLayout';
import EmployeeReport from '../../components/Reports/EmployeeReport';
import employeeService from '../../../../services/employeeService';
import { Employee } from '../../../../types/Employee';
import { CalendarIcon } from '@heroicons/react/24/outline';

const EmployeeReportsManager: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showPDF, setShowPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('');

  const ROLE_OPTIONS = [
    { value: '', label: 'All Roles' },
    { value: 'Operational Manager', label: 'Operational Manager' },
    { value: 'Supervisor', label: 'Supervisor' },
    { value: 'Mechanic', label: 'Mechanic' },
    { value: 'Store Keeper', label: 'Store Keeper' },
    { value: 'Cashier', label: 'Cashier' },
    { value: 'HR', label: 'HR' },
  ];

  const generateReport = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all employees
      const allEmployees = await employeeService.getAllEmployees();

      // Apply role filter if selected
      const filteredEmployees = filterRole
        ? allEmployees.filter(emp => emp.role === filterRole)
        : allEmployees;

      setEmployees(filteredEmployees);
      setShowPDF(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Error generating report:', error);
      } else {
        setError('Failed to generate report');
        console.error('Unknown error generating report:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowPDF(false);
    setEmployees([]);
    setFilterRole('');
  };

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
      <h2 className="text-lg font-bold mb-2">Something went wrong:</h2>
      <p>{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        onClick={handleReset}
      >
        Try again
      </button>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <EmployeeManagerLayout>
        <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
            Employee Salary Reports
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!showPDF && (
            <div className="grid grid-cols-1 gap-6">
              {/* Report Parameters */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Employee Salary Report Parameters</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={startDate.toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={endDate.toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={generateReport}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          {showPDF && employees.length > 0 && (
            <div className="mt-6 h-screen">
              <div className="mb-4">
                <button
                  onClick={handleReset}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generate New Report
                </button>
              </div>
              <PDFViewer width="100%" height="100%">
                <EmployeeReport
                  employees={employees}
                  startDate={startDate.toISOString()}
                  endDate={endDate.toISOString()}
                />
              </PDFViewer>
            </div>
          )}

          {showPDF && employees.length === 0 && (
            <div className="mt-6 p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p>No employees found matching the selected criteria.</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Try Different Parameters
              </button>
            </div>
          )}
        </div>
      </EmployeeManagerLayout>
    </ErrorBoundary>
  );
};

export default EmployeeReportsManager;
