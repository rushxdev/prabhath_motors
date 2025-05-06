import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Combobox } from '@headlessui/react';
import { Job, ServiceSection } from '../../../types/Job';
import { Employee } from '../../../types/Employee';
import { jobService } from '../../../services/jobService';
import { getVehicleById } from '../../../services/vehicleService';
import { Vehicle } from '../../../types/Vehicle';

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
                contactNo: vehicle.contactNo // Using contactNo instead of contactNumber
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Create New Job</h2>

            {error && <div className="text-red-500">{error}</div>}

            {vehicle && (
                <div className="mb-4">
                    <h3 className="text-lg font-medium">Vehicle Details</h3>
                    <p>Registration Number: {vehicle.vehicleRegistrationNo}</p>
                    <p>Vehicle Type: {vehicle.vehicleType}</p>
                    <p>Owner Name: {vehicle.ownerName}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Service Section</label>
                <select
                    value={formData.serviceSection}
                    onChange={(e) => setFormData({ ...formData, serviceSection: e.target.value as ServiceSection })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    {Object.values(ServiceSection).map((section) => (
                        <option key={section} value={section}>
                            {section.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Assign Employee</label>
                <Combobox
                    value={selectedEmployee}
                    onChange={(employee: Employee | null) => {
                        setSelectedEmployee(employee);
                    }}
                >
                    <div className="relative mt-1">
                        <Combobox.Input
                            className="w-full rounded-md border border-gray-300 p-2"
                            displayValue={(employee: Employee | null) => 
                                employee ? `${employee.firstname} ${employee.lastname}` : ''
                            }
                            placeholder="Search employee..."
                        />
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {employees.map((employee) => (
                                <Combobox.Option
                                    key={employee.empId}
                                    value={employee}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                            active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {employee.firstname} {employee.lastname} - {employee.role}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </div>
                </Combobox>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel || (() => navigate(-1))}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Creating...' : 'Create Job'}
                </button>
            </div>
        </form>
    );
};

export default JobForm; 