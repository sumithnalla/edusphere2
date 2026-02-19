
import { createClient } from '@supabase/supabase-js';

// URL from your Supabase project (safe to keep in frontend)
const supabaseUrl = 'https://umyulwicxxkqrbkhikdy.supabase.co';

// IMPORTANT: paste your actual anon key from Supabase project settings here.
// It will look like: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// Never paste the SERVICE_ROLE key here – only the anon/public key.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXVsd2ljeHhrcXJia2hpa2R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NzkxMTYsImV4cCI6MjA4NTM1NTExNn0.c6zqlrvlBFySpjBpyhaVXuf13auIKVcWaUI0DEIMEJE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  }
});
