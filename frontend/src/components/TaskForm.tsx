// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import api from '../utils/api';
// import { Task, User, AuthContextType } from '../types';
// import { AuthContext } from '../context/AuthContext';

// const TaskForm: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useContext(AuthContext) as AuthContextType;
//   const [task, setTask] = useState<Partial<Task>>({
//     title: '',
//     description: '',
//     status: 'pending',
//     priority: 'low',
//     dueDate: '',
//     reminderAt: '',
//     assignedTo: undefined,
//     createdBy: user ?  user : undefined, // Map id to _id for consistency
//   });
//   console.log({user,task})
//   const [users, setUsers] = useState<User[]>([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await api.get('/users');
//         // Map backend _id to frontend id
//         const mappedUsers = response.data.map((user: any) => ({
//           ...user,
//           id: user._id.toString(), // Convert _id to id
//         }));
//         console.log({mappedUsers})
//         setUsers(mappedUsers);
//       } catch (error) {
//         toast.error('Failed to fetch users');
//         console.error('Fetch users error:', error);
//       }
//     };

//     const fetchTask = async () => {
//       if (!id || users.length === 0) return;
//       try {
//         const response = await api.get(`/tasks/${id}`);
//         const taskData = response.data;
//         const assignedToUser =
//           taskData.assignedTo
//             ? typeof taskData.assignedTo === 'string'
//               ? users.find((user) => user.id === taskData.assignedTo)
//               : { ...taskData.assignedTo, id: taskData.assignedTo._id.toString() }
//             : undefined;
//         const createdByUser =
//           taskData.createdBy
//             ? typeof taskData.createdBy === 'string'
//               ? users.find((user) => user.id === taskData.createdBy)
//               : { ...taskData.createdBy, id: taskData.createdBy.id.toString() }
//             : undefined;

//         setTask({
//           ...taskData,
//           assignedTo: assignedToUser || users[0],
//           createdBy: createdByUser || (user ? { ...user } : users[0]),
//         });
//       } catch (error) {
//         toast.error('Failed to fetch task');
//         console.error('Fetch task error:', error);
//       }
//     };

//     fetchUsers().then(() => fetchTask());

//     setTask((prevTask) => ({
//       ...prevTask,  
//       createdBy: user ? { ...user } : undefined, // Ensure createdBy is set
//     }));
//   }, [id, user]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       console.log({task,user})
//       if (!task.assignedTo || !task.createdBy) {
//         toast.error('Please assign a user and ensure createdBy is set');
//         return;
//       }

//       const payload = {
//         ...task,
//         assignedTo: task.assignedTo._id, // Send id (mapped from _id)
//         createdBy: task.createdBy.id,   // Send id (mapped from _id)
//       };

//       if (id) {
//         await api.put(`/tasks/${id}`, payload);
//         toast.success('Task updated successfully');
//       } else {
//         await api.post('/tasks', payload);
//         toast.success('Task created successfully');
//       }
//       navigate('/tasks');
//     } catch (error) {
//       toast.error('Failed to save task');
//       console.error('Submit error:', error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
//       <h2 className="text-2xl font-bold text-accent mb-6">{id ? 'Edit Task' : 'Create Task'}</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700">Title</label>
//           <input
//             type="text"
//             value={task.title || ''}
//             onChange={(e) => setTask({ ...task, title: e.target.value })}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Description</label>
//           <textarea
//             value={task.description || ''}
//             onChange={(e) => setTask({ ...task, description: e.target.value })}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Status</label>
//           <select
//             value={task.status || 'pending'}
//             onChange={(e) => setTask({ ...task, status: e.target.value as Task['status'] })}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//           >
//             <option value="pending">Pending</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Priority</label>
//           <select
//             value={task.priority || 'low'}
//             onChange={(e) => setTask({ ...task, priority: e.target.value as Task['priority'] })}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Due Date</label>
//           <input
//             type="datetime-local"
//             value={task.dueDate || ''}
//             onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Reminder</label>
//           <input
//             type="datetime-local"
//             value={task.reminderAt || ''}
//             onChange={(e) => setTask({ ...task, reminderAt: e.target.value })}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">Assign To</label>
//           <select
//             value={task.assignedTo?.id || ''}
//             onChange={(e) => {
//               const selectedUser = users.find((user) => user.id === e.target.value);
//               setTask({ ...task, assignedTo: selectedUser || users[0] || task.assignedTo });
//             }}
//             className="w-full p-2 border border-gray-300 rounded mt-1"
//             required
//           >
//             <option value="">Select User</option>
//             {users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.username}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-accent">
//           {id ? 'Update Task' : 'Create Task'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default TaskForm;

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { Task, User, AuthContextType } from '../types';
import { AuthContext } from '../context/AuthContext';

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useContext(AuthContext) as AuthContextType;
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'low',
    dueDate: '',
    reminderAt: '',
    assignedTo: undefined,
    createdBy: user ? { ...user, id: user.id } : undefined,
  });
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        // Map backend _id to frontend id
        const mappedUsers = response.data.map((user: any) => ({
          ...user,
          id: user._id.toString(),
        }));
        setUsers(mappedUsers);
      } catch (error) {
        toast.error('Failed to fetch users');
        console.error('Fetch users error:', error);
      }
    };

    const fetchTask = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/tasks/${id}`);
        const taskData = response.data;
        // Map backend _id to id for assignedTo and createdBy
        setTask({
          ...taskData,
          _id: taskData._id.toString(),
          assignedTo: taskData.assignedTo
            ? { ...taskData.assignedTo, id: taskData.assignedTo._id.toString() }
            : undefined,
          createdBy: taskData.createdBy
            ? { ...taskData.createdBy, id: taskData.createdBy._id.toString() }
            : user
            ? { ...user, id: user.id }
            : undefined,
          dueDate: taskData.dueDate
            ? new Date(taskData.dueDate).toISOString().slice(0, 16)
            : '',
          reminderAt: taskData.reminderAt
            ? new Date(taskData.reminderAt).toISOString().slice(0, 16)
            : '',
        });
      } catch (error) {
        toast.error('Failed to fetch task');
        console.error('Fetch task error:', error);
      }
    };

    fetchUsers().then(() => fetchTask());
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!task.assignedTo || !task.createdBy) {
        toast.error('Please assign a user and ensure createdBy is set');
        return;
      }

      const payload = {
        ...task,
        assignedTo: task.assignedTo.id, // Send ID to backend
        createdBy: task.createdBy.id, // Send ID to backend
      };

      if (id) {
        await api.put(`/tasks/${id}`, payload);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', payload);
        toast.success('Task created successfully');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error('Failed to save task');
      console.error('Submit error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-accent mb-6">{id ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={task.title || ''}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={task.description || ''}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={task.status || 'pending'}
            onChange={(e) => setTask({ ...task, status: e.target.value as Task['status'] })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            value={task.priority || 'low'}
            onChange={(e) => setTask({ ...task, priority: e.target.value as Task['priority'] })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input
            type="datetime-local"
            value={task.dueDate || ''}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Reminder</label>
          <input
            type="datetime-local"
            value={task.reminderAt || ''}
            onChange={(e) => setTask({ ...task, reminderAt: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Assign To</label>
          <select
            value={task.assignedTo?.id || ''}
            onChange={(e) => {
              const selectedUser = users.find((user) => user.id === e.target.value);
              setTask({ ...task, assignedTo: selectedUser || task.assignedTo });
            }}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-primary text-white p-2 rounded hover:bg-accent">
          {id ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;