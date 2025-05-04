import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Job, JobStatus } from '../../../types/Job';
import { Task } from '../../../types/Task';
import { jobService } from '../../../services/jobService';
import * as taskService from '../../../services/taskService';
import AppointLayouts from '../layout/AppointmentLayouts/AppointLayouts';
import Modal from '../../../components/Model';
import { Button } from "@headlessui/react";

interface TaskFormErrors {
  description?: string;
  cost?: string;
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Job state
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Task states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskLoading, setTaskLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<TaskFormErrors>({});
  
  // Task deletion states
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Task autocomplete states
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  
  // Fetch job details and its tasks
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        // First, fetch all jobs and find the one with matching ID
        const [ongoingJobs, doneJobs] = await Promise.all([
          jobService.getAllOngoingJobs(),
          jobService.getAllDoneJobs()
        ]);
        
        const allJobs = [...ongoingJobs, ...doneJobs];
        const foundJob = allJobs.find(job => job.id === Number(id));
        
        if (foundJob) {
          setJob(foundJob);
          
          // For now, use mock tasks since API endpoint is not ready
          // Replace this with real API call when backend is ready
          setTasks([]);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to fetch job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Fetch all tasks for autocomplete
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const tasks = await taskService.getAllTasks();
        setAllTasks(tasks);
      } catch (err) {
        console.error('Error fetching tasks for autocomplete:', err);
      }
    };

    fetchAllTasks();
  }, []);

  const validateTaskForm = (): boolean => {
    const errors: TaskFormErrors = {};
    let isValid = true;

    if (!currentTask?.description?.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (currentTask.description.length < 3) {
      errors.description = "Description must be at least 3 characters long";
      isValid = false;
    }

    if (currentTask?.cost === undefined || currentTask?.cost === null) {
      errors.cost = "Cost is required";
      isValid = false;
    } else if (isNaN(currentTask.cost)) {
      errors.cost = "Cost must be a valid number";
      isValid = false;
    } else if (currentTask.cost < 0) {
      errors.cost = "Cost cannot be negative";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const openTaskModal = (task?: Task) => {
    setCurrentTask(task || { description: "", cost: 0 });
    setIsTaskModalOpen(true);
    setError(null);
    setFormErrors({});
    setFilteredTasks([]);
    setShowDropdown(false);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setCurrentTask(null);
    setError(null);
    setFormErrors({});
    setFilteredTasks([]);
    setShowDropdown(false);
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setCurrentTask(prev => ({
      ...prev!,
      [name]: name === 'cost' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
    
    // Handle autocomplete for description field
    if (name === 'description') {
      if (value.trim().length > 0) {
        const filtered = allTasks.filter(task => 
          task.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredTasks(filtered);
        setShowDropdown(true);
      } else {
        setFilteredTasks([]);
        setShowDropdown(false);
      }
    }
    
    // Clear error when user starts typing
    if (formErrors[name as keyof TaskFormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const selectTask = (task: Task) => {
    setCurrentTask({
      ...task,
      id: undefined // Remove the id to create a new task instance
    });
    setFilteredTasks([]);
    setShowDropdown(false);
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTaskForm() || !job?.id) {
      return;
    }

    setTaskLoading(true);
    setError(null);

    try {
      // Create a new task with an ID if it doesn't exist
      const newTask = {
        ...currentTask!,
        id: currentTask?.id || Math.floor(Math.random() * 1000) + 1 // Temporary ID for frontend
      };
      
      // For now, handle tasks locally until backend API is ready
      if (currentTask?.id) {
        // Update existing task
        setTasks(tasks.map(t => t.id === currentTask.id ? newTask : t));
      } else {
        // Add new task
        setTasks([...tasks, newTask]);
        
        // Optionally save to the global task list if it's a new unique task
        if (!allTasks.some(t => t.description.toLowerCase() === newTask.description.toLowerCase())) {
          try {
            // This would save to backend in production
            // await taskService.createTask(newTask);
            
            // For now, just update local state
            setAllTasks([...allTasks, newTask]);
          } catch (err) {
            console.error('Error saving task to global list:', err);
            // Non-blocking error - we can continue
          }
        }
      }
      
      // Uncomment below code when API endpoints are ready
      /*
      let updatedTask;
      if (currentTask?.id) {
        // Update existing task
        updatedTask = await jobService.updateJobTask(job.id, currentTask.id, currentTask);
      } else {
        // Add new task to the job
        updatedTask = await jobService.addTask(job.id, currentTask!);
        
        // Also save to global task list if it's new
        if (!allTasks.some(t => t.description.toLowerCase() === updatedTask.description.toLowerCase())) {
          await taskService.createTask({
            description: updatedTask.description,
            cost: updatedTask.cost
          });
        }
      }
      
      // Update tasks list
      if (currentTask?.id) {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else {
        setTasks([...tasks, updatedTask]);
      }
      */
      
      closeTaskModal();
    } catch (err) {
      console.error('Error saving task:', err);
      setError("Failed to save task. Please try again.");
    } finally {
      setTaskLoading(false);
    }
  };

  const promptDeleteTask = (id: number) => {
    setTaskToDelete(id);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete || !job?.id) return;
    
    try {
      // For now, handle deletion locally until the API is ready
      setTasks(tasks.filter(task => task.id !== taskToDelete));
      setIsDeleteModalOpen(false);
      
      // Uncomment when API endpoint is ready
      // await jobService.deleteJobTask(job.id, taskToDelete);
    } catch (err) {
      console.error('Error deleting task:', err);
      setDeleteError("Failed to delete task. Please try again.");
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
    setDeleteError(null);
  };

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!job) return;
    
    try {
      // Update status locally for now
      setJob({ ...job, status: newStatus });
      
      // Uncomment when API is ready
      // const updatedJob = await jobService.updateJob(job.jobId, { ...job, status: newStatus });
      // setJob(updatedJob);
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status');
    }
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

  if (error || !job) {
    return (
      <AppointLayouts>
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error || "Job not found"}</span>
          </div>
          <button 
            onClick={() => navigate('/admin/jobs')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Job List
          </button>
        </div>
      </AppointLayouts>
    );
  }

  return (
    <AppointLayouts>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Job Details</h1>
          <button 
            onClick={() => navigate('/admin/jobs')}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Job List
          </button>
        </div>

        {/* Job Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-lg font-medium mb-4">Job Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Job ID:</span> {job.jobId}</p>
                <p><span className="font-medium">Vehicle:</span> {job.vehicleRegistrationNumber}</p>
                <p><span className="font-medium">Service Section:</span> {job.serviceSection}</p>
                <p><span className="font-medium">Assigned Employee:</span> {job.assignedEmployee}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Status
                  </label>
                  <select
                    id="status"
                    value={job.status}
                    onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {Object.values(JobStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center mt-2">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${
                      job.status === JobStatus.COMPLETED
                        ? 'bg-green-500'
                        : job.status === JobStatus.IN_PROGRESS
                        ? 'bg-yellow-500'
                        : job.status === JobStatus.CANCELLED
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  ></div>
                  <span className="text-sm">{job.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Tasks</h2>
            <button
              onClick={() => openTaskModal()}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tasks added to this job yet. Click "Add Task" to add one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost (Rs.)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.cost}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openTaskModal(task)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => promptDeleteTask(task.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total Cost */}
          <div className="mt-6 text-right">
            <p className="text-lg font-medium">
              Total Cost: Rs. {tasks.reduce((sum, task) => sum + task.cost, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={currentTask?.id ? "Edit Task" : "Add New Task"}
      >
        <form onSubmit={handleTaskSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          <div className="mb-4 relative">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={currentTask?.description || ""}
              onChange={handleTaskInputChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="off"
              required
              placeholder="Enter task description or start typing to see suggestions"
              disabled={taskLoading}
            />
            {showDropdown && filteredTasks.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                <ul className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <li
                      key={task.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => selectTask(task)}
                    >
                      <span>{task.description}</span>
                      <span className="text-gray-500">Rs. {task.cost}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
              Cost (Rs.)
            </label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={currentTask?.cost || ""}
              onChange={handleTaskInputChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.cost ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              step="0.01"
              placeholder="Enter cost"
              disabled={taskLoading}
            />
            {formErrors.cost && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cost}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              disabled={taskLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center min-w-[100px]"
              disabled={taskLoading}
            >
              {taskLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Modal>

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
              Are you sure you want to delete this task? This action cannot be undone.
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
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={taskLoading}
              >
                {taskLoading ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </AppointLayouts>
  );
};

export default JobDetails;