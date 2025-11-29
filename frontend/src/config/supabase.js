import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xoyxfcmpzmjjzwulejvr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveXhmY21wem1qanp3dWxlanZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzUxMTMsImV4cCI6MjA4MDAxMTExM30.S48PUVG7Oce5Uzch2iHh520a0So-5oUr_nwtmKaJ7sU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

