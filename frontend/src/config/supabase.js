import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase environment variables!')
  console.error('Please create a .env file in the frontend directory with:')
  console.error('  VITE_SUPABASE_URL')
  console.error('  VITE_SUPABASE_ANON_KEY')
  console.error('See .env.example for a template.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

