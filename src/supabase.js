import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required config
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase configuration is incomplete. Please check your environment variables.");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // Use PKCE flow for cleaner URLs
    }
});

export default supabase;
