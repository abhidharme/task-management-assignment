import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-accent mb-6">Welcome, {user?.username}</h2>
      <p className="mb-4">Role: {user?.role}</p>
      <div className="flex space-x-4">
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/users')}
            className="bg-primary text-white p-2 rounded hover:bg-accent"
          >
            Manage Users
          </button>
        )}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button
            onClick={() => navigate('/tasks/new')}
            className="bg-primary text-white p-2 rounded hover:bg-accent"
          >
            Create Task
          </button>
        )}
        <button
          onClick={() => navigate('/tasks')}
          className="bg-primary text-white p-2 rounded hover:bg-accent"
        >
          View Tasks
        </button>
        {/* <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
};

export default Dashboard;