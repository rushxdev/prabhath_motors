import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import AppointLayouts from "../../layout/AppointmentLayouts/AppointLayouts";
import React, { useEffect, useState } from "react";
import { deleteTask, getAllTasks } from "../../../../services/taskService";
import { Task } from "../../../../types/Task";
import { useNavigate } from "react-router-dom";
import Modal from "../../../../components/Model";
import { Button } from "@headlessui/react";

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  //   const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [loading] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
    setFilteredTasks(data);
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
            //   onClick={}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>

        {/* Task Table */}

        <div className="mt-8 overflow-x-auto">
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
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`edit-task/${task.id}`)}
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
    </AppointLayouts>
  );
};

export default TaskList;
