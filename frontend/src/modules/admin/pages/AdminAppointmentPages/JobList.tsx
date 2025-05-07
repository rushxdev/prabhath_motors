import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Job } from '../../../../types/Job';
import { jobService } from '../../../../services/jobService';
import AppointLayouts from '../../layout/AppointmentLayouts/AppointLayouts';
import { TrashIcon } from "@heroicons/react/24/solid";
import Modal from '../../../../components/Model';

const JobList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [jobToDelete, setJobToDelete] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const [ongoingJobs, doneJobs] = await Promise.all([
                jobService.getAllOngoingJobs(),
                jobService.getAllDoneJobs()
            ]);
            setJobs([...ongoingJobs, ...doneJobs]);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to fetch jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Refresh jobs when returning from job details
    useEffect(() => {
        if (location.state?.refresh) {
            fetchJobs();
            // Clear the refresh flag
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    const handleDeleteJob = async () => {
        if (!jobToDelete) return;

        try {
            await jobService.deleteJob(jobToDelete.toString());
            setJobs(jobs.filter(job => job.id !== jobToDelete));
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
        } catch (err) {
            console.error('Error deleting job:', err);
            setDeleteError('Failed to delete job. Please try again.');
        }
    };

    const promptDeleteJob = (id: number) => {
        setJobToDelete(id);
        setDeleteError(null);
        setIsDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
        setDeleteError(null);
    };

    if (loading) {
        return (
            <AppointLayouts>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AppointLayouts>
        );
    }

    if (error) {
        return (
            <AppointLayouts>
                <div className="max-w-7xl mx-auto p-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                </div>
            </AppointLayouts>
        );
    }

    return (
        <AppointLayouts>
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Jobs</h1>
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Section</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost (Rs.)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">{job.jobId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{job.vehicleRegistrationNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{job.serviceSection}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{job.assignedEmployee}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{job.totalCost?.toFixed(2) || '0.00'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-sm ${
                                                job.status === "Done"
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {job.status === "Done" ? 'Done' : 'Ongoing'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => navigate(`/admin/jobs/${job.id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => promptDeleteJob(job.id!)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
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
                            Are you sure you want to delete this job? This action cannot be undone.
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
                                onClick={handleDeleteJob}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </Modal>
        </AppointLayouts>
    );
};

export default JobList; 