import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User } from '../types';
import { toast } from 'react-toastify';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, role: string) => {
    // Validate and assert role as valid User.role type
    const validRole: User['role'] = ['admin', 'manager', 'user'].includes(role)
      ? (role as 'admin' | 'manager' | 'user')
      : 'user'; // Fallback to 'user' if invalid

    try {
      await api.put(`/users/${id}/role`, { role: validRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, role: validRole } : user
        )
      );
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-accent mb-6">User Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            <th className="p-2">Username</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="p-1 border border-gray-300 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;