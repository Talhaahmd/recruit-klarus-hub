
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use environment variables first, then fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bzddkmmjqwgylckimwiq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGRrbW1qcXdneWxja2ltd2lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDUyNTIsImV4cCI6MjA2MzI4MTI1Mn0.TJ-WarxEHdsEbsychuwRHaKDtWQcWK3Yl5-zqAO4Ow0';

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      detectSessionInUrl: true,
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);

// Add debugging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state changed:', event, 'User ID:', session?.user?.id);
  
  // Clear any stale session data on sign out
  if (event === 'SIGNED_OUT') {
    localStorage.removeItem('sb-auth-token');
    sessionStorage.clear();
  }
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
