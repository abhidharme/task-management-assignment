import cron from 'node-cron';
import { Document, Types } from 'mongoose';
import Task from '../models/Task';
import { IUser } from '../models/User';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Load from .env
    pass: process.env.EMAIL_PASS // Load from .env
  }
});

// Define interface for populated task
interface IPopulatedTask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  reminderAt: Date;
  assignedTo: IUser; // Populated as IUser
  createdBy: Types.ObjectId;
}

export const startReminderService = () => {
  cron.schedule('*/10 * * * * *', async () => {
    try {
      // Validate environment variables
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('EMAIL_USER or EMAIL_PASS not defined in environment variables');
      }

      const now = new Date();
      const tasks = await Task.find({
        reminderAt: { $lte: now },
        status: { $ne: 'completed' }
      }).populate<{ assignedTo: IUser }>('assignedTo');

      for (const task of tasks as IPopulatedTask[]) {
        await transporter.sendMail({
          to: task.assignedTo.email,
          subject: `Task Reminder: ${task.title}`,
          text: `Reminder: Your task "${task.title}" is due on ${task.dueDate.toLocaleString()}.`
        });
        // Update reminderAt to prevent repeated emails
        task.reminderAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Set to next day
        await task.save();
      }
    } catch (error) {
      console.error('Reminder service error:', error);
    }
  });
};