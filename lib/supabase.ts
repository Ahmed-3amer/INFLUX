import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Initialization (Frontend Phase: Dormant)
 *
 * During the current frontend-first development phase, Supabase remains unconnected.
 * This client returns null when environment variables are not supplied.
 * Live authentication, database schema, and RLS will be wired in the future backend phase.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
