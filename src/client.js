import { createClient } from '@supabase/supabase-js';

// Input: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from environment variables
// Output: Configured SupabaseClient object for interacting with the database
const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(URL, API_KEY);
