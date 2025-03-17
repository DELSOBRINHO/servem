import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://seu-supabase-url.supabase.co";
const SUPABASE_ANON_KEY = "sua-chave-anonima";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
