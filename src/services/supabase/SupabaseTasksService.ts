import { supabase } from '../../config/supabase';
import { Task } from '../../core/models';
import { BaseSupabaseService } from './BaseSupabaseService';

/**
 * Handles all tasks operations with Supabase
 * Single Responsibility: Tasks only
 */
export class SupabaseTasksService extends BaseSupabaseService {
  /**
   * Get tasks for a cabin
   */
  async getTasks(cabinId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          cabin_id,
          title,
          description,
          status,
          created_at,
          completed_at
        `)
        .eq('cabin_id', cabinId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(task => ({
        id: task.id,
        cabinId: task.cabin_id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.created_at,
        completedAt: task.completed_at,
      }));
    } catch (error) {
      console.error('Get tasks error:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  /**
   * Create a new task
   */
  async createTask(
    cabinId: string,
    taskData: { 
      title: string; 
      description?: string; 
      priority?: 'low' | 'medium' | 'high'; 
      dueDate?: string; 
      assignedTo?: string 
    }
  ): Promise<Task> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          cabin_id: cabinId,
          title: taskData.title,
          description: taskData.description,
          status: 'todo',
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        cabinId: data.cabin_id,
        title: data.title,
        description: data.description,
        status: data.status,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Create task error:', error);
      throw new Error('Failed to create task');
    }
  }

  /**
   * Update a task
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status) {
        updateData.status = updates.status;
        if (updates.status === 'done') {
          updateData.completed_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Update task error:', error);
      throw new Error('Failed to update task');
    }
  }

  /**
   * Assign a task to a user
   */
  async assignTask(taskId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ assigned_to: userId })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Assign task error:', error);
      throw new Error('Failed to assign task');
    }
  }
}
