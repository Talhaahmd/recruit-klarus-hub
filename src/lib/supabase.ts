
import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Provide default values for development
const SUPABASE_URL = supabaseUrl || 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = supabaseAnonKey || 'your-anon-key';

// Log warning if environment variables are not set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Using fallback values. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for proper functionality.');
}

console.log('Initializing Supabase client with explicit auth configuration');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Important for OAuth redirects
    flowType: 'implicit' // Use implicit flow for OAuth
  }
});

// Add debugging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state changed:', event, 'User ID:', session?.user?.id);
});

// Verify current session on initialization
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('🔐 Initial auth check:', session ? `Authenticated as ${session.user.id}` : 'No active session');
});

// Database schema types based on our Supabase setup
export type Tables = {
  jobs: JobRow;
  candidates: CandidateRow;
  calendar_events: CalendarEventRow;
  linkedin_posts: LinkedInPostRow;
};

export type JobRow = {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  posted_date: string;
  technologies: string[];
  workplace_type: string;
  complexity: string;
  qualification: string;
  active_days: number;
  user_id: string;
  created_at: string;
};

export type CandidateRow = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  applied_date: string;
  status: string;
  notes: string;
  rating: number;
  user_id: string;
  created_at: string;
};

export type CalendarEventRow = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  type: string;
  user_id: string;
  created_at: string;
};

export type LinkedInPostRow = {
  id: string;
  content: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  posted: boolean;
  niche: string;
  user_id: string;
  created_at: string;
};
