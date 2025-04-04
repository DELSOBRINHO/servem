export interface ActivityLog {
  id: number;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: number;
  details?: Record<string, any>;
  created_at?: string;
}
