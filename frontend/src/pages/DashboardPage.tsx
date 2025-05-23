import React from 'react';
import Dashboard from '../components/Dashboard';
import Toast from '../components/Toast';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Dashboard />
      <Toast />
    </div>
  );
};

export default DashboardPage;