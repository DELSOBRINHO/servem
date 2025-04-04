import { supabase } from '../services/supabase';
import { Volunteer } from '../types/Volunteer';

export const volunteerService = {
  async getVolunteers(): Promise<Volunteer[]> {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }

    return data || [];
  },

  async getVolunteerById(id: number): Promise<Volunteer | null> {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching volunteer with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async createVolunteer(volunteer: Omit<Volunteer, 'id' | 'created_at' | 'updated_at'>): Promise<Volunteer> {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([volunteer])
      .select()
      .single();

    if (error) {
      console.error('Error creating volunteer:', error);
      throw error;
    }

    return data;
  },

  async updateVolunteer(id: number, volunteer: Partial<Volunteer>): Promise<Volunteer> {
    const { data, error } = await supabase
      .from('volunteers')
      .update(volunteer)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating volunteer with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async deleteVolunteer(id: number): Promise<void> {
    const { error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting volunteer with id ${id}:`, error);
      throw error;
    }
  },

  async getVolunteersByDepartment(department: string): Promise<Volunteer[]> {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('department', department)
      .eq('status', 'Ativo')
      .order('name');

    if (error) {
      console.error(`Error fetching volunteers from department ${department}:`, error);
      throw error;
    }

    return data || [];
  },

  async getVolunteersByStatus(status: string): Promise<Volunteer[]> {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('status', status)
      .order('name');

    if (error) {
      console.error(`Error fetching volunteers with status ${status}:`, error);
      throw error;
    }

    return data || [];
  }
};
