export interface User {
 _id?: string; // Optional, for backend compatibility
  id: string; // Frontend uses this
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  reminderAt: string;
  assignedTo: User;
  createdBy: User;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}