-- Interview Preparation Tables Migration
-- This migration creates tables for Interview Gameplan functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Interview Categories table
CREATE TABLE IF NOT EXISTS public.interview_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Questions table - stores generated interview questions
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
    focus_areas TEXT[], -- e.g., ['technical', 'behavioral', 'leadership']
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Question Items table - individual questions in a gameplan
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

-- Interview Practice Sessions table - tracks user practice sessions
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

-- Interview Practice Responses table - stores individual question responses
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

-- Interview Resources table - additional resources for interview prep
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.interview_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_question_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_practice_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interview_categories (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view interview categories" ON public.interview_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for interview_questions
CREATE POLICY "Users can view their own interview questions" ON public.interview_questions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interview questions" ON public.interview_questions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own interview questions" ON public.interview_questions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interview questions" ON public.interview_questions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for interview_question_items
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
CREATE POLICY "Users can view their own practice sessions" ON public.interview_practice_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own practice sessions" ON public.interview_practice_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own practice sessions" ON public.interview_practice_sessions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own practice sessions" ON public.interview_practice_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for interview_practice_responses
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

-- RLS Policies for interview_resources (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view interview resources" ON public.interview_resources
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_categories_name ON public.interview_categories(name);
CREATE INDEX IF NOT EXISTS idx_interview_questions_user_id ON public.interview_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_questions_created_at ON public.interview_questions(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_questions_target_role ON public.interview_questions(target_role);
CREATE INDEX IF NOT EXISTS idx_interview_question_items_question_set_id ON public.interview_question_items(question_set_id);
CREATE INDEX IF NOT EXISTS idx_interview_question_items_order_index ON public.interview_question_items(order_index);
CREATE INDEX IF NOT EXISTS idx_interview_practice_sessions_user_id ON public.interview_practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_practice_sessions_question_set_id ON public.interview_practice_sessions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_interview_practice_responses_session_id ON public.interview_practice_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_practice_responses_question_item_id ON public.interview_practice_responses(question_item_id);
CREATE INDEX IF NOT EXISTS idx_interview_resources_category_id ON public.interview_resources(category_id);
CREATE INDEX IF NOT EXISTS idx_interview_resources_title ON public.interview_resources(title);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_interview_questions_updated_at
    BEFORE UPDATE ON public.interview_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_practice_sessions_updated_at
    BEFORE UPDATE ON public.interview_practice_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_practice_responses_updated_at
    BEFORE UPDATE ON public.interview_practice_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
