import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { FaEdit, FaTrash } from 'react-icons/fa'; // Ensure correct import
import api from '../utils/api'; // Your Axios instance
import { Task, User } from '../types'; // Import frontend types
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const limit = 10; // Tasks per page

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks', {
        params: { page, limit },
      });

      // Map backend _id to id for assignedTo and createdBy
      const mappedTasks = response.data.tasks
        ? response.data.tasks.map((task: any) => ({
            ...task,
            _id: task._id.toString(),
            assignedTo: task.assignedTo
              ? { ...task.assignedTo, id: task.assignedTo._id.toString() }
              : undefined,
            createdBy: task.createdBy
              ? { ...task.createdBy, id: task.createdBy._id.toString() }
              : undefined,
          }))
        : response.data.map((task: any) => ({
            ...task,
            _id: task._id.toString(),
            assignedTo: task.assignedTo
              ? { ...task.assignedTo, id: task.assignedTo._id.toString() }
              : undefined,
            createdBy: task.createdBy
              ? { ...task.createdBy, id: task.createdBy._id.toString() }
              : undefined,
          }));

      setTasks(mappedTasks);
      setTotalPages(
        Math.ceil((response.data.total || response.data.length) / limit)
      );
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const handleEdit = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', err);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading && <div className="text-gray-500">Loading...</div>}

      {!loading && tasks?.length === 0 && (
        <div className="text-gray-500">No tasks found.</div>
      )}

      {!loading && tasks?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Title</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Priority</th>
                <th className="py-2 px-4 border">Due Date</th>
                <th className="py-2 px-4 border">Assigned To</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{task.title}</td>
                  <td className="py-2 px-4 border">{task.description}</td>
                  <td className="py-2 px-4 border">{task.status}</td>
                  <td className="py-2 px-4 border">{task.priority}</td>
                  <td className="py-2 px-4 border">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">
                    {task.assignedTo?.username
                      ? `${task.assignedTo.username}`
                      : 'Unassigned'}
                  </td>
                  <td className="py-2 px-4 border flex space-x-2">
                    <button
                      onClick={() => handleEdit(task._id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Task"
                    >
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Task"
                    >
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;