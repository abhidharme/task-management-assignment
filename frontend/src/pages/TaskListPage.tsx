import React from 'react';
import TaskList from '../components/TaskList';
import Toast from '../components/Toast';

const TaskListPage: React.FC = () => {
  return (
    <div>
      <TaskList />
      <Toast />
    </div>
  );
};

export default TaskListPage;