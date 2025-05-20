
import { createClient } from '@supabase/supabase-js';

// These environment variables must be set in your deployment platform
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

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
