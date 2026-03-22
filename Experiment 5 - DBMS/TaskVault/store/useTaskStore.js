import { create } from 'zustand';
import {
  initDB,
  getAllTasks,
  addTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from '../database';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });
      await initDB();
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize task store:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  refreshTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  addTask: async (title, description, priority) => {
    try {
      set({ isLoading: true, error: null });
      await addTask(title, description, priority);
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to add task:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      await updateTaskStatus(id, status);
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to update task status:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  updateTask: async (id, title, description, priority, status) => {
    try {
      set({ isLoading: true, error: null });
      await updateTask(id, title, description, priority, status);
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to update task:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteTask(id);
      const tasks = await getAllTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Failed to delete task:', error);
      set({ error: error.message, isLoading: false });
    }
  },
}));
