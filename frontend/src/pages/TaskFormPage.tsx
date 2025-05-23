import React from 'react';
import TaskForm from '../components/TaskForm';
import Toast from '../components/Toast';

const TaskFormPage: React.FC = () => {
  return (
    <div>
      <TaskForm />
      <Toast />
    </div>
  );
};

export default TaskFormPage;