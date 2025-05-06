import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import AppointLayouts from "../../layout/AppointmentLayouts/AppointLayouts";
import React, { useEffect, useState } from "react";
import { createTask, deleteTask, getAllTasks, updateTask } from "../../../../services/taskService";
import { Task } from "../../../../types/Task";
import Modal from "../../../../components/Model";
import { Button } from "@headlessui/react";

interface TaskFormErrors {
  description?: string;
  cost?: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  //   const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<TaskFormErrors>({});

  const validateForm = (): boolean => {
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

  const fetchTasks = async () => {
    try {
      setTableLoading(true);
      const data = await getAllTasks();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError("Failed to fetch tasks. Please try again.");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = tasks.filter((task) =>
      task.description.toLowerCase().includes(value)
    );

    setFilteredTasks(filtered);
  };

  const promptDelete = (id: number) => {
    setTaskToDelete(id);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setIsDeleteModalOpen(false);
    fetchTasks();
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
    setDeleteError(null);
  };

  const openTaskModal = (task?: Task) => {
    setCurrentTask(task || { description: "", cost: 0 });
    setIsTaskModalOpen(true);
    setError(null);
    setFormErrors({});
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setCurrentTask(null);
    setError(null);
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTask(prev => ({
      ...prev!,
      [name]: name === 'cost' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof TaskFormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (currentTask?.id) {
        await updateTask(currentTask.id, currentTask);
      } else {
        await createTask(currentTask!);
      }
      closeTaskModal();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointLayouts>
      <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-2xl font-press font-semibold mb-4 mt-10 text-primary">
          Manage All Tasks
        </h2>

        <div className="flex items-center justify-between mt-12">
          <input
            type="text"
            placeholder="Search Tasks"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-1/2 p-2 border border-gray-500 rounded-md mb-4 bg-transparent"
          />
          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
            onClick={() => openTaskModal()}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>

        {/* Task Table */}

        <div className="mt-8 overflow-x-auto">
          {tableLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost (Rs.)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {task.cost}
                      </td>
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
                            onClick={() => promptDelete(task.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            {" "}
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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
              Are you sure you want to delete this Appointment? This action
              cannot be undone.
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
                onClick={() => handleDelete(taskToDelete!)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={currentTask?.id ? "Edit Task" : "Add New Task"}
      >
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={currentTask?.description || ""}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              placeholder="Enter task description"
              disabled={loading}
            />
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
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.cost ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              min="0"
              step="0.01"
              placeholder="Enter cost"
              disabled={loading}
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center min-w-[100px]"
              disabled={loading}
            >
              {loading ? (
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
    </AppointLayouts>
  );
};

export default TaskList;
