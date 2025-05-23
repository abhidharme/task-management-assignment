import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../types';

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, dueDate } = req.query;
    const query: any = {};

    if (req.user?.role === 'user') {
      query.assignedTo = req.user._id;
    } else if (req.user?.role === 'manager') {
      query.createdBy = req.user._id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate as string) };

    const tasks = await Task.find(query)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch tasks', error });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate('assignedTo', 'username email role')
      .populate('createdBy', 'username email role');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Authorization: Admins can access any task, managers can access tasks they created,
    // users can access tasks assigned to them
    if (
      req.user?.role !== 'admin' &&
      (req.user?.role === 'manager' && task.createdBy._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch task', error });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, dueDate, reminderAt, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      reminderAt,
      assignedTo,
      createdBy: req.user?._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create task', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user?.role === 'user' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update task', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user?.role === 'manager' && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete task', error });
  }
};

export const completeTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.assignedTo.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = 'completed';
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Failed to complete task', error });
  }
};