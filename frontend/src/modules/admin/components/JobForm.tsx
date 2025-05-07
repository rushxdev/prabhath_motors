import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Combobox } from '@headlessui/react';
import { Job, ServiceSection } from '../../../types/Job';
import { Employee } from '../../../types/Employee';
import { jobService } from '../../../services/jobService';
import { getVehicleById } from '../../../services/vehicleService';
import { Vehicle } from '../../../types/Vehicle';
import AppointLayouts from '../layout/AppointmentLayouts/AppointLayouts';
import { 
    ClipboardDocumentListIcon, 
    UserIcon, 
    WrenchScrewdriverIcon,
    TruckIcon,
    PhoneIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';

interface JobFormProps {
    initialData?: Partial<Job>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const vehicleId = location.state?.vehicleId;

    const [formData, setFormData] = useState<Partial<Job>>({
        serviceSection: ServiceSection.GARAGE,
        status: 'Ongoing',
        ...initialData
    });

    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (vehicleId) {
                    const vehicleData = await getVehicleById(vehicleId);
                    setVehicle(vehicleData);
                }
                const employeeData = await jobService.getAllEmployees();
                setEmployees(employeeData);
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [vehicleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!vehicle || !selectedEmployee) {
                throw new Error('Vehicle and Employee are required');
            }

            const jobData: Partial<Job> = {
                jobId: `JOB-${Date.now()}`, // Generate a unique job ID
                vehicleRegistrationNumber: vehicle.vehicleRegistrationNo,
                serviceSection: formData.serviceSection || ServiceSection.GARAGE,
                assignedEmployee: `${selectedEmployee.firstname} ${selectedEmployee.lastname}`,
                tasks: [],
                spareParts: [],
                status: 'Ongoing',
                totalCost: 0,
                ownerName: vehicle.ownerName,
                contactNumber: vehicle.contactNumber
            };

            await jobService.createJob(jobData);
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/admin/jobs');
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppointLayouts>
            <div className="max-w-4xl mx-auto p-6">
                <div>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 rounded-lg mb-6">
                        <div className="flex items-center">
                            <ClipboardDocumentListIcon className="h-8 w-8 text-white mr-3" />
                            <h2 className="text-2xl font-bold text-white">Create New Job</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Vehicle Details Card */}
                        {vehicle && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center mb-4">
                                    <TruckIcon className="h-6 w-6 text-green-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-gray-900">Vehicle Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <IdentificationIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Registration Number</p>
                                            <p className="font-medium text-gray-900">{vehicle.vehicleRegistrationNo}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <TruckIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Vehicle Type</p>
                                            <p className="font-medium text-gray-900">{vehicle.vehicleType}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <UserIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Owner Name</p>
                                            <p className="font-medium text-gray-900">{vehicle.ownerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Number</p>
                                            <p className="font-medium text-gray-900">{vehicle.contactNo}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Service Section and Employee Selection in a row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 items-center">
                                    <WrenchScrewdriverIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    Service Section
                                </label>
                                <select
                                    value={formData.serviceSection}
                                    onChange={(e) => setFormData({ ...formData, serviceSection: e.target.value as ServiceSection })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-[38px]"
                                >
                                    {Object.values(ServiceSection).map((section) => (
                                        <option key={section} value={section}>
                                            {section.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Employee Selection */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 items-center">
                                    <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    Assign Employee
                                </label>
                                <Combobox
                                    value={selectedEmployee}
                                    onChange={(employee: Employee | null) => {
                                        setSelectedEmployee(employee);
                                    }}
                                >
                                    <div className="relative">
                                        <Combobox.Input
                                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm"
                                            displayValue={(employee: Employee | null) => 
                                                employee ? `${employee.firstname} ${employee.lastname}` : ''
                                            }
                                            placeholder="Search employee..."
                                        />
                                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Combobox.Button>
                                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {employees.map((employee) => (
                                                <Combobox.Option
                                                    key={employee.empId}
                                                    value={employee}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                                            active ? 'bg-green-600 text-white' : 'text-gray-900'
                                                        }`
                                                    }
                                                >
                                                    {({ active }) => (
                                                        <div className="flex items-center">
                                                            <span className="truncate">
                                                                {employee.firstname} {employee.lastname}
                                                            </span>
                                                            <span className={`ml-2 truncate ${
                                                                active ? 'text-blue-200' : 'text-gray-500'
                                                            }`}>
                                                                - {employee.role}
                                                            </span>
                                                        </div>
                                                    )}
                                                </Combobox.Option>
                                            ))}
                                        </Combobox.Options>
                                    </div>
                                </Combobox>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onCancel || (() => navigate(-1))}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </div>
                                ) : (
                                    'Create Job'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppointLayouts>
    );
};

export default JobForm; 