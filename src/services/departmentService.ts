import { supabase } from '../lib/supabase';
import { Department } from '../types/Department';

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }

    return data || [];
  },

  async getDepartmentById(id: number): Promise<Department | null> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching department with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async createDepartment(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert([department])
      .select()
      .single();

    if (error) {
      console.error('Error creating department:', error);
      throw error;
    }

    return data;
  },

  async updateDepartment(id: number, department: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(department)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating department with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async deleteDepartment(id: number): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting department with id ${id}:`, error);
      throw error;
    }
  }
};
