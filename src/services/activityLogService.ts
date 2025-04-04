import { supabase } from '../lib/supabase';
import { ActivityLog } from '../types/ActivityLog';

export const activityLogService = {
  async getActivityLogs(limit = 50): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }

    return data || [];
  },

  async logActivity(
    action: string,
    entityType: string,
    entityId?: number,
    details?: Record<string, any>
  ): Promise<void> {
    const user = supabase.auth.getUser();
    const userId = user ? (await user).data.user?.id : null;

    const { error } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          details
        }
      ]);

    if (error) {
      console.error('Error logging activity:', error);
      throw error;
    }
  }
};
