import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Please verify your .env.local file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set.'
  );
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export const createClient = () => supabase;

export default supabase;
