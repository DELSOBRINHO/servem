import { supabase } from '../lib/supabase';
import { Setting } from '../types/Setting';

export const settingService = {
  async getSettings(): Promise<Setting[]> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }

    return data || [];
  },

  async getSettingByKey(key: string): Promise<Setting | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error) {
      console.error(`Error fetching setting with key ${key}:`, error);
      throw error;
    }

    return data;
  },

  async updateSetting(key: string, value: string): Promise<Setting> {
    const { data, error } = await supabase
      .from('settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single();

    if (error) {
      console.error(`Error updating setting with key ${key}:`, error);
      throw error;
    }

    return data;
  },

  async getChurchInfo(): Promise<{
    name: string;
    address: string;
    phone: string;
    email: string;
  }> {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['church_name', 'church_address', 'church_phone', 'church_email']);

    if (error) {
      console.error('Error fetching church info:', error);
      throw error;
    }

    const settings = data || [];
    const getValue = (key: string) => {
      const setting = settings.find(s => s.key === key);
      return setting ? setting.value : '';
    };

    return {
      name: getValue('church_name'),
      address: getValue('church_address'),
      phone: getValue('church_phone'),
      email: getValue('church_email')
    };
  }
};
