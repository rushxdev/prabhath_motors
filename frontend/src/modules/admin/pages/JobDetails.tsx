import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PencilIcon, PlusIcon, TrashIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { Job, NamedCostItem } from '../../../types/Job';
import { Task } from '../../../types/Task';
import { StockItem } from '../../../types/Stock';
import { jobService } from '../../../services/jobService';
import * as taskService from '../../../services/taskService';
import { itemService } from '../../../services/stockItemService';
import AppointLayouts from '../layout/AppointmentLayouts/AppointLayouts';
import Modal from '../../../components/Model';
import { Button } from "@headlessui/react";
import { PDFViewer } from '@react-pdf/renderer';
import ServiceReport from '../components/Reports/ServiceReport';

interface TaskFormErrors {
  description?: string;
  cost?: string;
}

interface SparePartFormErrors {
  quantity?: string;
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

  // Spare parts states
  const [spareParts, setSpareParts] = useState<StockItem[]>([]);
  const [currentSparePart, setCurrentSparePart] = useState<StockItem | null>(null);
  const [isSparePartModalOpen, setIsSparePartModalOpen] = useState<boolean>(false);
  const [sparePartLoading, setSparePartLoading] = useState<boolean>(false);
  const [sparePartFormErrors, setSparePartFormErrors] = useState<SparePartFormErrors>({});
  
  // Spare part deletion states
  const [sparePartToDelete, setSparePartToDelete] = useState<number | null>(null);
  const [isSparePartDeleteModalOpen, setIsSparePartDeleteModalOpen] = useState<boolean>(false);
  const [sparePartDeleteError, setSparePartDeleteError] = useState<string | null>(null);

  // Spare part autocomplete states
  const [allSpareParts, setAllSpareParts] = useState<StockItem[]>([]);
  const [filteredSpareParts, setFilteredSpareParts] = useState<StockItem[]>([]);
  const [showSparePartDropdown, setShowSparePartDropdown] = useState<boolean>(false);
  
  // Add new state for saving
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Add new state for success message
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Add new state for PDF viewer
  const [showReport, setShowReport] = useState<boolean>(false);

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
          
          // Convert NamedCostItems back to Tasks and StockItems
          const taskItems: Task[] = foundJob.tasks.map((task: NamedCostItem, index: number) => ({
            id: index + 1, // Generate a temporary ID
            description: task.name,
            cost: task.cost
          }));

          const sparePartItems: StockItem[] = foundJob.spareParts.map((part: NamedCostItem, index: number) => ({
            itemID: index + 1, // Generate a temporary ID
            itemName: part.name,
            qtyAvailable: 1, // Default quantity
            unitPrice: part.cost, // Since cost is total, we'll use it as unit price
            sellPrice: part.cost, // Same as unit price
            itemCtgryID: 0,
            supplierId: 0,
            itemBarcode: "",
            recorderLevel: 0,
            itemBrand: "",
            stockLevel: "HIGH",
            rackNo: 0,
            updatedDate: new Date().toISOString().split('T')[0]
          }));

          setTasks(taskItems);
          setSpareParts(sparePartItems);
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

  // Fetch all spare parts for autocomplete
  useEffect(() => {
    const fetchAllSpareParts = async () => {
      try {
        const spareParts = await itemService.getAllItems();
        setAllSpareParts(spareParts);
      } catch (err) {
        console.error('Error fetching spare parts for autocomplete:', err);
      }
    };

    fetchAllSpareParts();
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

  // Spare part related functions
  const validateSparePartForm = (): boolean => {
    const errors: SparePartFormErrors = {};
    let isValid = true;

    if (!currentSparePart?.qtyAvailable || currentSparePart.qtyAvailable <= 0) {
      errors.quantity = "Quantity must be greater than 0";
      isValid = false;
    }

    setSparePartFormErrors(errors);
    return isValid;
  };

  const openSparePartModal = (sparePart?: StockItem) => {
    console.log('Opening spare part modal with:', sparePart);
    if (sparePart) {
      setCurrentSparePart(sparePart);
    } else {
      setCurrentSparePart({ 
        itemName: "", 
        qtyAvailable: 1,
        sellPrice: 0,
        unitPrice: 0,
        itemCtgryID: 0,
        supplierId: 0,
        itemBarcode: "",
        recorderLevel: 0,
        itemBrand: "",
        stockLevel: "HIGH",
        rackNo: 0,
        updatedDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsSparePartModalOpen(true);
    setError(null);
    setSparePartFormErrors({});
    setFilteredSpareParts([]);
    setShowSparePartDropdown(false);
  };

  const closeSparePartModal = () => {
    console.log('Closing spare part modal');
    setIsSparePartModalOpen(false);
    setCurrentSparePart(null);
    setError(null);
    setSparePartFormErrors({});
    setFilteredSpareParts([]);
    setShowSparePartDropdown(false);
  };

  const handleSparePartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    
    setCurrentSparePart(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'qtyAvailable' || name === 'sellPrice' || name === 'unitPrice' 
          ? (value === '' ? 0 : parseFloat(value)) 
          : value
      };
    });
    
    // Handle autocomplete for itemName field
    if (name === 'itemName') {
      if (value.trim().length > 0) {
        const filtered = allSpareParts.filter(part => 
          part.itemName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSpareParts(filtered);
        setShowSparePartDropdown(true);
      } else {
        setFilteredSpareParts([]);
        setShowSparePartDropdown(false);
      }
    }
    
    // Clear error when user starts typing
    if (sparePartFormErrors[name as keyof SparePartFormErrors]) {
      setSparePartFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const selectSparePart = (sparePart: StockItem) => {
    console.log('Selected spare part:', sparePart);
    setCurrentSparePart({
      ...sparePart,
      qtyAvailable: 1 // Reset quantity to 1 when selecting from dropdown
    });
    setFilteredSpareParts([]);
    setShowSparePartDropdown(false);
  };

  const handleSparePartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSparePartForm() || !job?.id) {
      return;
    }

    setSparePartLoading(true);
    setError(null);

    try {
      console.log('Current spare part before save:', currentSparePart);
      
      // Create a new spare part with an ID if it doesn't exist
      const newSparePart = {
        ...currentSparePart!,
        itemID: currentSparePart?.itemID || Math.floor(Math.random() * 1000) + 1 // Temporary ID for frontend
      };
      
      console.log('New spare part to be added:', newSparePart);
      
      // For now, handle spare parts locally until backend API is ready
      setSpareParts(prevParts => {
        // Check if the spare part already exists in the list
        const existingIndex = prevParts.findIndex(p => p.itemID === newSparePart.itemID);
        
        if (existingIndex >= 0) {
          // Update existing spare part
          const updatedParts = [...prevParts];
          updatedParts[existingIndex] = newSparePart;
          console.log('Updated spare parts after edit:', updatedParts);
          return updatedParts;
        } else {
          // Add new spare part
          const updatedParts = [...prevParts, newSparePart];
          console.log('Updated spare parts after add:', updatedParts);
          return updatedParts;
        }
      });
      
      // Uncomment below code when API endpoints are ready
      /*
      let updatedSparePart;
      if (currentSparePart?.itemID) {
        // Update existing spare part
        updatedSparePart = await jobService.updateJobSparePart(job.id, currentSparePart.itemID, currentSparePart);
      } else {
        // Add new spare part to the job
        updatedSparePart = await jobService.addSparePart(job.id, currentSparePart!);
      }
      
      // Update spare parts list
      if (currentSparePart?.itemID) {
        setSpareParts(prevParts => prevParts.map(p => p.itemID === updatedSparePart.itemID ? updatedSparePart : p));
      } else {
        setSpareParts(prevParts => [...prevParts, updatedSparePart]);
      }
      */
      
      closeSparePartModal();
    } catch (err) {
      console.error('Error saving spare part:', err);
      setError("Failed to save spare part. Please try again.");
    } finally {
      setSparePartLoading(false);
    }
  };

  // Add useEffect to log spare parts state changes
  useEffect(() => {
    console.log('Spare parts state updated:', spareParts);
  }, [spareParts]);

  // Add useEffect to log current spare part changes
  useEffect(() => {
    console.log('Current spare part updated:', currentSparePart);
  }, [currentSparePart]);

  const promptDeleteSparePart = (id: number) => {
    setSparePartToDelete(id);
    setSparePartDeleteError(null);
    setIsSparePartDeleteModalOpen(true);
  };

  const handleDeleteSparePart = async () => {
    if (!sparePartToDelete || !job?.id) return;
    
    try {
      // For now, handle deletion locally until the API is ready
      setSpareParts(spareParts.filter(part => part.itemID !== sparePartToDelete));
      setIsSparePartDeleteModalOpen(false);
      
      // Uncomment when API endpoint is ready
      // await jobService.deleteJobSparePart(job.id, sparePartToDelete);
    } catch (err) {
      console.error('Error deleting spare part:', err);
      setSparePartDeleteError("Failed to delete spare part. Please try again.");
    }
  };

  const cancelSparePartDelete = () => {
    setIsSparePartDeleteModalOpen(false);
    setSparePartToDelete(null);
    setSparePartDeleteError(null);
  };

  // Add function to convert tasks and spare parts to NamedCostItem
  const convertToNamedCostItems = () => {
    const taskItems: NamedCostItem[] = tasks.map(task => ({
      name: task.description,
      cost: task.cost
    }));

    const sparePartItems: NamedCostItem[] = spareParts.map(part => ({
      name: part.itemName,
      cost: part.qtyAvailable * part.unitPrice
    }));

    return { taskItems, sparePartItems };
  };

  // Add function to handle saving the job
  const handleSaveJob = async () => {
    if (!job?.id) return;

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { taskItems, sparePartItems } = convertToNamedCostItems();
      const totalCost = taskItems.reduce((sum, item) => sum + item.cost, 0) +
                       sparePartItems.reduce((sum, item) => sum + item.cost, 0);

      const updatedJob: Job = {
        ...job,
        tasks: taskItems,
        spareParts: sparePartItems,
        totalCost
      };

      await jobService.updateJob(job.id.toString(), updatedJob);
      setSaveSuccess("Job saved successfully!");
      setTimeout(() => setSaveSuccess(null), 500);
    } catch (err) {
      console.error('Error saving job:', err);
      setSaveError("Failed to save job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsDone = async () => {
    if (!job?.id) return;

    try {
      await jobService.markJobAsDone(job.id.toString());
      // Update the job status locally
      setJob(prev => prev ? { ...prev, status: "Done" } : null);
      setSaveSuccess("Job marked as completed successfully!");
      setTimeout(() => setSaveSuccess(null), 500);
    } catch (err) {
      console.error('Error marking job as done:', err);
      setError("Failed to mark job as completed. Please try again.");
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
            onClick={() => navigate('/admin/jobs', { state: { refresh: true } })}
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
          <div className="flex space-x-2">
            <button
              onClick={() => setShowReport(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Service Report
            </button>
            {job?.status !== "Done" && (
              <button 
                onClick={handleMarkAsDone}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                Mark as Done
              </button>
            )}
            <button 
              onClick={handleSaveJob}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Job"
              )}
            </button>
            <button 
              onClick={() => navigate('/admin/jobs', { state: { refresh: true } })}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Back to Job List
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-medium">{saveError}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p className="font-medium">{saveSuccess}</p>
          </div>
        )}

        {/* Job Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-lg font-medium mb-4">Job Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Job ID:</span> {job?.jobId}</p>
                <p><span className="font-medium">Vehicle:</span> {job?.vehicleRegistrationNumber}</p>
                <p><span className="font-medium">Service Section:</span> {job?.serviceSection}</p>
                <p><span className="font-medium">Assigned Employee:</span> {job?.assignedEmployee}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    job?.status === "Done"
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job?.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
        </div>

        {/* Spare Parts Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Spare Parts</h2>
            <button
              onClick={() => openSparePartModal()}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Spare Part
            </button>
          </div>

          {spareParts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No spare parts added to this job yet. Click "Add Spare Part" to add one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price (Rs.)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (Rs.)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {spareParts.map((part) => (
                    <tr key={part.itemID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{part.itemID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{part.itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{part.qtyAvailable}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{part.unitPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{(part.qtyAvailable * part.unitPrice).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openSparePartModal(part)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => promptDeleteSparePart(part.itemID!)}
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
              Total Cost: Rs. {(
                tasks.reduce((sum, task) => sum + task.cost, 0) +
                spareParts.reduce((sum, part) => sum + (part.qtyAvailable * part.unitPrice), 0)
              ).toFixed(2)}
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

      {/* Add/Edit Spare Part Modal */}
      <Modal
        isOpen={isSparePartModalOpen}
        onClose={closeSparePartModal}
        title={currentSparePart?.itemID ? "Edit Spare Part" : "Add New Spare Part"}
      >
        <form onSubmit={handleSparePartSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          <div className="mb-4 relative">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={currentSparePart?.itemName || ""}
              onChange={handleSparePartInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              autoComplete="off"
              required
              placeholder="Enter item name or start typing to see suggestions"
              disabled={sparePartLoading}
            />
            {showSparePartDropdown && filteredSpareParts.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                <ul className="divide-y divide-gray-200">
                  {filteredSpareParts.map((part) => (
                    <li
                      key={part.itemID}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => selectSparePart(part)}
                    >
                      <span>{part.itemName}</span>
                      <span className="text-gray-500">Rs. {part.unitPrice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="qtyAvailable" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="qtyAvailable"
              name="qtyAvailable"
              value={currentSparePart?.qtyAvailable || ""}
              onChange={handleSparePartInputChange}
              className={`w-full p-2 border rounded-md ${
                sparePartFormErrors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="1"
              placeholder="Enter quantity"
              disabled={sparePartLoading}
            />
            {sparePartFormErrors.quantity && (
              <p className="mt-1 text-sm text-red-600">{sparePartFormErrors.quantity}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price (Rs.)
            </label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={currentSparePart?.unitPrice || ""}
              onChange={handleSparePartInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              min="0"
              step="0.01"
              placeholder="Enter unit price"
              disabled={sparePartLoading}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              onClick={closeSparePartModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              disabled={sparePartLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center min-w-[100px]"
              disabled={sparePartLoading}
            >
              {sparePartLoading ? (
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

      {/* Delete Spare Part Confirmation Modal */}
      <Modal
        isOpen={isSparePartDeleteModalOpen}
        onClose={cancelSparePartDelete}
        title="Confirm Deletion"
      >
        <div className="p-4">
          {sparePartDeleteError ? (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">{sparePartDeleteError}</p>
            </div>
          ) : (
            <p className="mb-4">
              Are you sure you want to delete this spare part? This action cannot be undone.
            </p>
          )}

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              onClick={cancelSparePartDelete}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </Button>
            {!sparePartDeleteError && (
              <Button
                type="button"
                onClick={handleDeleteSparePart}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={sparePartLoading}
              >
                {sparePartLoading ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* PDF Viewer Modal */}
      <Modal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        title="Service Report"
        fullSize={true}
      >
        <div className="h-[80vh] w-full">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowReport(false)}
              className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Close
            </button>
          </div>
          <PDFViewer width="100%" height="100%">
            <ServiceReport
              job={job!}
              tasks={tasks}
              spareParts={spareParts}
            />
          </PDFViewer>
        </div>
      </Modal>
    </AppointLayouts>
  );
};

export default JobDetails;