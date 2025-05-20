
-- Supabase Schema for HR Application
-- This SQL can be executed in the Supabase SQL Editor

-- Enable the necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  applicants INTEGER DEFAULT 0,
  posted_date DATE NOT NULL,
  technologies TEXT[] NOT NULL,
  workplace_type TEXT NOT NULL,
  complexity TEXT NOT NULL,
  qualification TEXT,
  active_days INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_url TEXT,
  applied_date DATE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  rating INTEGER NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LinkedIn posts table
CREATE TABLE IF NOT EXISTS linkedin_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  scheduled_date DATE,
  scheduled_time TEXT,
  posted BOOLEAN DEFAULT FALSE,
  niche TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for candidate resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('candidate-files', 'candidate-files', true)
ON CONFLICT DO NOTHING;

-- Functions for updating applicant counts
CREATE OR REPLACE FUNCTION increment_job_applicants(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs
  SET applicants = applicants + 1
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_job_applicants(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE jobs
  SET applicants = GREATEST(0, applicants - 1)
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
CREATE POLICY "Users can view their own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for candidates table
CREATE POLICY "Users can view their own candidates" ON candidates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own candidates" ON candidates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own candidates" ON candidates
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own candidates" ON candidates
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for calendar_events table
CREATE POLICY "Users can view their own events" ON calendar_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" ON calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own events" ON calendar_events
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own events" ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for linkedin_posts table
CREATE POLICY "Users can view their own posts" ON linkedin_posts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts" ON linkedin_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own posts" ON linkedin_posts
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own posts" ON linkedin_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Set up storage policies for candidate-files bucket
CREATE POLICY "Public GET access for candidate-files" ON storage.objects
  FOR SELECT USING (bucket_id = 'candidate-files');
  
CREATE POLICY "Users can upload to candidate-files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'candidate-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'candidate-files' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'candidate-files' AND auth.uid() = owner);
