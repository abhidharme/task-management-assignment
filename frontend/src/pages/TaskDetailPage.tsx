import React from 'react';
import TaskDetail from '../components/TaskDetail';
import Toast from '../components/Toast';

const TaskDetailPage: React.FC = () => {
  return (
    <div>
      <TaskDetail />
      <Toast />
    </div>
  );
};

export default TaskDetailPage;