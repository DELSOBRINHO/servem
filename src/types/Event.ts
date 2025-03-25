export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  department?: string;
  status: 'Confirmado' | 'Cancelado' | 'Adiado' | 'Concluído';
  max_volunteers?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
