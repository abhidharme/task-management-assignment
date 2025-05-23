import React from 'react';
import UserManagement from '../components/UserManagement';
import Toast from '../components/Toast';

const UserManagementPage: React.FC = () => {
  return (
    <div>
      <UserManagement />
      <Toast />
    </div>
  );
};

export default UserManagementPage;