import React, { useState, useEffect } from 'react';
import { Button, Combobox } from '@headlessui/react';
import { Job, SparePart, JobStatus, TaskStatus } from '../../../types/Job';
import { jobService } from '../../../services/jobService';
import AppointLayouts from '../layout/AppointmentLayouts/AppointLayouts';

const JobList: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newTask, setNewTask] = useState('');
    const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
    const [newSparePart, setNewSparePart] = useState('');
    const [suggestedSpareParts, setSuggestedSpareParts] = useState<SparePart[]>([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const [ongoingJobs, doneJobs] = await Promise.all([
                jobService.getAllOngoingJobs(),
                jobService.getAllDoneJobs()
            ]);
            setJobs([...ongoingJobs, ...doneJobs]);
        } catch (error) {
            setError('Failed to fetch jobs');
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskInputChange = async (value: string) => {
        setNewTask(value);
        if (value.length > 2) {
            try {
                const suggestions = await jobService.getSuggestedTasks(value);
                setSuggestedTasks(suggestions);
            } catch (error) {
                console.error('Failed to fetch task suggestions:', error);
            }
        } else {
            setSuggestedTasks([]);
        }
    };

    const handleSparePartInputChange = async (value: string) => {
        setNewSparePart(value);
        if (value.length > 2) {
            try {
                const suggestions = await jobService.getSuggestedSpareParts(value);
                setSuggestedSpareParts(suggestions);
            } catch (error) {
                console.error('Failed to fetch spare part suggestions:', error);
            }
        } else {
            setSuggestedSpareParts([]);
        }
    };

    const handleAddTask = async () => {
        if (!selectedJob || !newTask.trim()) return;

        try {
            await jobService.addTask(selectedJob.jobId, {
                description: newTask,
                status: TaskStatus.PENDING
            });
            setNewTask('');
            setSuggestedTasks([]);
            fetchJobs(); // Refresh the job list
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    };

    const handleAddSparePart = async (sparePart: SparePart) => {
        if (!selectedJob) return;

        try {
            await jobService.addSparePart(selectedJob.jobId, {
                ...sparePart,
                quantity: 1 // Default quantity
            });
            setNewSparePart('');
            setSuggestedSpareParts([]);
            fetchJobs(); // Refresh the job list
        } catch (err) {
            console.error('Failed to add spare part:', err);
        }
    };

    const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
        try {
            const job = jobs.find(j => j.jobId === jobId);
            if (!job) return;

            if (newStatus === JobStatus.COMPLETED) {
                await jobService.markJobAsDone(jobId);
            } else {
                await jobService.updateJob(jobId, { ...job, status: newStatus });
            }
            fetchJobs();
        } catch (error) {
            setError('Failed to update job status');
            console.error('Error updating job status:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <AppointLayouts>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-semibold mb-4">Job List</h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Section</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Employee</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job.jobId} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{job.jobId}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{job.vehicleRegistrationNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{job.serviceSection}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{job.assignedEmployee}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <select
                                                value={job.status}
                                                onChange={(e) => handleStatusChange(job.jobId, e.target.value as JobStatus)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            >
                                                {Object.values(JobStatus).map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleStatusChange(job.jobId, JobStatus.COMPLETED)}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Mark as Done
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppointLayouts>
    );
};

export default JobList; 