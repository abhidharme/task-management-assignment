import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Task } from '../types';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data);
      } catch (error) {
        toast.error('Failed to fetch task');
      }
    };
    fetchTask();
  }, [id]);

  const handleComplete = async () => {
    try {
      await api.post(`/tasks/${id}/complete`);
      toast.success('Task marked as completed');
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-accent mb-6">{task.title}</h2>
      <p>Description: {task.description}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleString()}</p>
      <p>Reminder: {new Date(task.reminderAt).toLocaleString()}</p>
      <p>Assigned To: {task.assignedTo.username}</p>
      <p>Created By: {task.createdBy.username}</p>
      {user?.role === 'user' && task.status !== 'completed' && (
        <button
          onClick={handleComplete}
          className="mt-4 bg-primary text-white p-2 rounded hover:bg-accent"
        >
          Mark as Completed
        </button>
      )}
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <button
          onClick={() => navigate(`/tasks/edit/${task._id}`)}
          className="mt-4 ml-4 bg-primary text-white p-2 rounded hover:bg-accent"
        >
          Edit Task
        </button>
      )}
    </div>
  );
};

export default TaskDetail;