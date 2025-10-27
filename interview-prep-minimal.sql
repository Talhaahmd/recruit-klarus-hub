-- Interview Preparation Minimal Setup
-- This script creates the essential tables for Interview Prep feature

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Interview Categories table
CREATE TABLE IF NOT EXISTS public.interview_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Questions table
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_role TEXT NOT NULL,
    company_type TEXT,
    industry TEXT,
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    question_count INTEGER DEFAULT 5,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    focus_areas TEXT[],
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Question Items table
CREATE TABLE IF NOT EXISTS public.interview_question_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_set_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'behavioral' CHECK (question_type IN ('behavioral', 'technical', 'situational', 'leadership', 'cultural_fit')),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    order_index INTEGER NOT NULL,
    sample_answer TEXT,
    answer_explanation TEXT,
    key_points TEXT[],
    follow_up_questions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Practice Sessions table
CREATE TABLE IF NOT EXISTS public.interview_practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_set_id UUID NOT NULL REFERENCES public.interview_questions(id) ON DELETE CASCADE,
    session_name TEXT,
    practice_mode TEXT DEFAULT 'self_practice' CHECK (practice_mode IN ('self_practice', 'mock_interview', 'peer_review')),
    total_questions INTEGER DEFAULT 0,
    completed_questions INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    feedback_summary TEXT,
    strengths TEXT[],
    improvement_areas TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Practice Responses table
CREATE TABLE IF NOT EXISTS public.interview_practice_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.interview_practice_sessions(id) ON DELETE CASCADE,
    question_item_id UUID NOT NULL REFERENCES public.interview_question_items(id) ON DELETE CASCADE,
    user_response TEXT,
    response_time_seconds INTEGER,
    self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
    ai_feedback TEXT,
    strengths_identified TEXT[],
    improvement_suggestions TEXT[],
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Resources table
CREATE TABLE IF NOT EXISTS public.interview_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'book', 'tool', 'practice', 'community')),
    category_id UUID REFERENCES public.interview_categories(id) ON DELETE SET NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_minutes INTEGER,
    is_free BOOLEAN DEFAULT TRUE,
    skills_covered TEXT[],
    target_roles TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.interview_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_question_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_practice_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interview_categories
DROP POLICY IF EXISTS "All authenticated users can view interview categories" ON public.interview_categories;
CREATE POLICY "All authenticated users can view interview categories" ON public.interview_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for interview_questions
DROP POLICY IF EXISTS "Users can view their own interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Users can insert their own interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Users can update their own interview questions" ON public.interview_questions;
DROP POLICY IF EXISTS "Users can delete their own interview questions" ON public.interview_questions;
CREATE POLICY "Users can view their own interview questions" ON public.interview_questions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interview questions" ON public.interview_questions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interview questions" ON public.interview_questions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interview questions" ON public.interview_questions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for interview_question_items
DROP POLICY IF EXISTS "Users can view items for their own interview questions" ON public.interview_question_items;
DROP POLICY IF EXISTS "Users can insert items for their own interview questions" ON public.interview_question_items;
DROP POLICY IF EXISTS "Users can update items for their own interview questions" ON public.interview_question_items;
DROP POLICY IF EXISTS "Users can delete items for their own interview questions" ON public.interview_question_items;
CREATE POLICY "Users can view items for their own interview questions" ON public.interview_question_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.interview_questions
        WHERE id = question_set_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can insert items for their own interview questions" ON public.interview_question_items
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.interview_questions
        WHERE id = question_set_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can update items for their own interview questions" ON public.interview_question_items
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.interview_questions
        WHERE id = question_set_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can delete items for their own interview questions" ON public.interview_question_items
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.interview_questions
        WHERE id = question_set_id AND user_id = auth.uid()
    ));

-- RLS Policies for interview_practice_sessions
DROP POLICY IF EXISTS "Users can view their own practice sessions" ON public.interview_practice_sessions;
DROP POLICY IF EXISTS "Users can insert their own practice sessions" ON public.interview_practice_sessions;
DROP POLICY IF EXISTS "Users can update their own practice sessions" ON public.interview_practice_sessions;
DROP POLICY IF EXISTS "Users can delete their own practice sessions" ON public.interview_practice_sessions;
CREATE POLICY "Users can view their own practice sessions" ON public.interview_practice_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own practice sessions" ON public.interview_practice_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own practice sessions" ON public.interview_practice_sessions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own practice sessions" ON public.interview_practice_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for interview_practice_responses
DROP POLICY IF EXISTS "Users can view their own practice responses" ON public.interview_practice_responses;
DROP POLICY IF EXISTS "Users can insert their own practice responses" ON public.interview_practice_responses;
DROP POLICY IF EXISTS "Users can update their own practice responses" ON public.interview_practice_responses;
DROP POLICY IF EXISTS "Users can delete their own practice responses" ON public.interview_practice_responses;
CREATE POLICY "Users can view their own practice responses" ON public.interview_practice_responses
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.interview_practice_sessions
        WHERE id = session_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can insert their own practice responses" ON public.interview_practice_responses
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.interview_practice_sessions
        WHERE id = session_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can update their own practice responses" ON public.interview_practice_responses
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.interview_practice_sessions
        WHERE id = session_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can delete their own practice responses" ON public.interview_practice_responses
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.interview_practice_sessions
        WHERE id = session_id AND user_id = auth.uid()
    ));

-- RLS Policies for interview_resources
DROP POLICY IF EXISTS "All authenticated users can view interview resources" ON public.interview_resources;
CREATE POLICY "All authenticated users can view interview resources" ON public.interview_resources
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_interview_categories_name ON public.interview_categories(name);
CREATE INDEX IF NOT EXISTS idx_interview_questions_user_id ON public.interview_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_question_items_question_set_id ON public.interview_question_items(question_set_id);
CREATE INDEX IF NOT EXISTS idx_interview_practice_sessions_user_id ON public.interview_practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_practice_responses_session_id ON public.interview_practice_responses(session_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_interview_questions_updated_at ON public.interview_questions;
CREATE TRIGGER update_interview_questions_updated_at
    BEFORE UPDATE ON public.interview_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interview_practice_sessions_updated_at ON public.interview_practice_sessions;
CREATE TRIGGER update_interview_practice_sessions_updated_at
    BEFORE UPDATE ON public.interview_practice_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interview_practice_responses_updated_at ON public.interview_practice_responses;
CREATE TRIGGER update_interview_practice_responses_updated_at
    BEFORE UPDATE ON public.interview_practice_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data for Interview Categories
INSERT INTO public.interview_categories (name, description) VALUES
('Behavioral Interviews', 'Questions about past experiences and behavior'),
('Technical Interviews', 'Technical skills and problem-solving questions'),
('Leadership & Management', 'Leadership skills and team management'),
('Cultural Fit', 'Company culture and values alignment'),
('Situational', 'Hypothetical scenarios and problem-solving'),
('Industry Specific', 'Questions specific to particular industries');

-- Seed data for Interview Resources
INSERT INTO public.interview_resources (title, description, url, resource_type, category_id, difficulty_level, duration_minutes, is_free, skills_covered, target_roles) VALUES
('STAR Method Guide', 'Learn the Situation, Task, Action, Result framework for behavioral questions', 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique', 'article', (SELECT id FROM public.interview_categories WHERE name = 'Behavioral Interviews'), 'beginner', 15, true, ARRAY['Communication', 'Storytelling', 'Behavioral Interviewing'], ARRAY['All Roles']),
('Technical Interview Prep', 'Comprehensive guide to technical interview preparation', 'https://www.interviewbit.com/technical-interview-questions/', 'article', (SELECT id FROM public.interview_categories WHERE name = 'Technical Interviews'), 'intermediate', 30, true, ARRAY['Technical Skills', 'Problem Solving', 'Algorithm Design'], ARRAY['Software Engineer', 'Data Scientist', 'Developer']),
('Leadership Interview Questions', 'Common leadership and management interview questions', 'https://www.themuse.com/advice/leadership-interview-questions', 'article', (SELECT id FROM public.interview_categories WHERE name = 'Leadership & Management'), 'advanced', 20, true, ARRAY['Leadership', 'Management', 'Team Building'], ARRAY['Manager', 'Director', 'Executive']),
('Company Culture Assessment', 'How to evaluate and discuss company culture fit', 'https://www.glassdoor.com/blog/company-culture-interview-questions/', 'article', (SELECT id FROM public.interview_categories WHERE name = 'Cultural Fit'), 'beginner', 10, true, ARRAY['Cultural Fit', 'Values Alignment', 'Company Research'], ARRAY['All Roles']),
('Mock Interview Platform', 'Practice interviews with AI feedback', 'https://www.pramp.com/', 'tool', (SELECT id FROM public.interview_categories WHERE name = 'Technical Interviews'), 'intermediate', 60, true, ARRAY['Interview Practice', 'Feedback', 'Confidence Building'], ARRAY['All Roles']);
