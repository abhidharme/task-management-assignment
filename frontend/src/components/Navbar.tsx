import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Task Manager
        </Link>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-accent">
                Dashboard
              </Link>
              <Link to="/tasks" className="hover:text-accent">
                Tasks
              </Link>
              {user.role === 'admin' && (
                <Link to="/users" className="hover:text-accent">
                  User Management
                </Link>
              )}
              <span className="text-sm">{user.username} ({user.role})</span>
              <button
                onClick={handleLogout}
                className="bg-accent text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-accent">
                Login
              </Link>
              <Link to="/register" className="hover:text-accent">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;