
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ytnxdgunnzeqycwauiwx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0bnhkZ3VubnplcXljd2F1aXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTg0NTgsImV4cCI6MjA2MDM5NDQ1OH0.aelpejYbp0NV4_Lz8xl4sWLXwqmAldyJfdXiFx7CHc4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to get current auth session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user || null;
};
