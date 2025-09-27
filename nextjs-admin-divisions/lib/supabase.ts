import { createClient } from '@supabase/supabase-js';

// Log the environment variables as the server sees them
console.log('Supabase URL from env:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key from env:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded' : 'NOT LOADED');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('CRITICAL ERROR: Missing Supabase URL or Anon Key. Check Netlify environment variables. They must be prefixed with NEXT_PUBLIC_.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
