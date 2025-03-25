import { supabase } from '../lib/supabase';
import { Event } from '../types/Event';
import { EventVolunteer } from '../types/EventVolunteer';

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    return data || [];
  },

  async getUpcomingEvents(limit = 10): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }

    return data || [];
  },

  async getEventById(id: number): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return data;
  },

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating event with id ${id}:`, error);
      throw error;
    }

    return data;
  },

  async deleteEvent(id: number): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting event with id ${id}:`, error);
      throw error;
    }
  },

  async getEventVolunteers(eventId: number): Promise<EventVolunteer[]> {
    const { data, error } = await supabase
      .from('event_volunteers')
      .select(`
        *,
        volunteers:volunteer_id (id, name, email, department, role)
      `)
      .eq('event_id', eventId);

    if (error) {
      console.error(`Error fetching volunteers for event ${eventId}:`, error);
      throw error;
    }

    return data || [];
  },

  async assignVolunteerToEvent(eventId: number, volunteerId: number, role?: string): Promise<EventVolunteer> {
    const { data, error } = await supabase
      .from('event_volunteers')
      .insert([
        { 
          event_id: eventId, 
          volunteer_id: volunteerId,
          role,
          is_confirmed: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(`Error assigning volunteer ${volunteerId} to event ${eventId}:`, error);
      throw error;
    }

    return data;
  },

  async confirmVolunteer(eventId: number, volunteerId: number): Promise<void> {
    const { error } = await supabase
      .from('event_volunteers')
      .update({ is_confirmed: true })
      .eq('event_id', eventId)
      .eq('volunteer_id', volunteerId);

    if (error) {
      console.error(`Error confirming volunteer ${volunteerId} for event ${eventId}:`, error);
      throw error;
    }
  },

  async removeVolunteerFromEvent(eventId: number, volunteerId: number): Promise<void> {
    const { error } = await supabase
      .from('event_volunteers')
      .delete()
      .eq('event_id', eventId)
      .eq('volunteer_id', volunteerId);

    if (error) {
      console.error(`Error removing volunteer ${volunteerId} from event ${eventId}:`, error);
      throw error;
    }
  }
};
