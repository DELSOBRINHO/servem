import { Volunteer } from './Volunteer';
import { Event } from './Event';

export interface EventVolunteer {
  id: number;
  event_id: number;
  volunteer_id: number;
  role?: string;
  is_confirmed: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relacionamentos
  volunteers?: Volunteer;
  events?: Event;
}
