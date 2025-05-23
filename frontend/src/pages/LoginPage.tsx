import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AuthContextType } from '../types';
import Login from '../components/Login';
import Toast from '../components/Toast';

const LoginPage: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType;

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <Login />
      <Toast />
    </div>
  );
};

export default LoginPage;