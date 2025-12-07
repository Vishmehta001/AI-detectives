/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client for database operations.
 * Supabase is used to store and retrieve chat logs for the admin dashboard.
 * 
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Get your project URL and anon key from project settings
 * 3. Add them to your .env.local file:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 * 4. Create a table called 'chat_logs' with columns:
 *    - id (uuid, primary key)
 *    - student_id (text)
 *    - message (text)
 *    - role (text) - either 'user' or 'assistant'
 *    - created_at (timestamp)
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// Use empty strings as fallback to avoid build errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create and export the Supabase client
// This client can be used throughout the app to interact with the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
}

/**
 * Database Schema for chat_logs table:
 * 
 * CREATE TABLE chat_logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   student_id TEXT NOT NULL,
 *   message TEXT NOT NULL,
 *   role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_chat_logs_student_id ON chat_logs(student_id);
 * CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at DESC);
 */
