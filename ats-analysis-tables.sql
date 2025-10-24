-- ATS Analysis Tables - Direct SQL for Supabase Editor
-- Run this script in the Supabase SQL Editor to create the required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ATS Analyses table - stores main analysis results
CREATE TABLE IF NOT EXISTS public.ats_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_text TEXT NOT NULL,
    job_title TEXT,
    industry TEXT,
    job_description TEXT, -- Optional JD for better matching
    ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
    formatting_score INTEGER NOT NULL CHECK (formatting_score >= 0 AND formatting_score <= 100),
    keyword_density_score INTEGER NOT NULL CHECK (keyword_density_score >= 0 AND keyword_density_score <= 100),
    grammar_score INTEGER NOT NULL CHECK (grammar_score >= 0 AND grammar_score <= 100),
    quantifiable_results_score INTEGER NOT NULL CHECK (quantifiable_results_score >= 0 AND quantifiable_results_score <= 100),
    overall_compatibility_score INTEGER NOT NULL CHECK (overall_compatibility_score >= 0 AND overall_compatibility_score <= 100),
    feedback_summary TEXT,
    ai_analysis JSONB, -- Store detailed AI analysis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATS Feedback Items table - stores categorized feedback
CREATE TABLE IF NOT EXISTS public.ats_feedback_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.ats_analyses(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'formatting', 'keywords', 'grammar', 'content', 'structure'
    issue TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Descriptions table - optional storage for JD matching
CREATE TABLE IF NOT EXISTS public.job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT,
    industry TEXT,
    description TEXT NOT NULL,
    requirements TEXT,
    keywords TEXT[], -- Extracted keywords for matching
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_feedback_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ats_analyses
CREATE POLICY "Users can view their own ATS analyses"
    ON public.ats_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ATS analyses"
    ON public.ats_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ATS analyses"
    ON public.ats_analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ATS analyses"
    ON public.ats_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for ats_feedback_items
CREATE POLICY "Users can view feedback for their analyses"
    ON public.ats_feedback_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.ats_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert feedback for their analyses"
    ON public.ats_feedback_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.ats_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update feedback for their analyses"
    ON public.ats_feedback_items FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.ats_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete feedback for their analyses"
    ON public.ats_feedback_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.ats_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

-- RLS Policies for job_descriptions
CREATE POLICY "Users can view their own job descriptions"
    ON public.job_descriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job descriptions"
    ON public.job_descriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job descriptions"
    ON public.job_descriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job descriptions"
    ON public.job_descriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ats_analyses_user_id ON public.ats_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_created_at ON public.ats_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_ats_analyses_industry ON public.ats_analyses(industry);
CREATE INDEX IF NOT EXISTS idx_ats_feedback_items_analysis_id ON public.ats_feedback_items(analysis_id);
CREATE INDEX IF NOT EXISTS idx_ats_feedback_items_category ON public.ats_feedback_items(category);
CREATE INDEX IF NOT EXISTS idx_ats_feedback_items_severity ON public.ats_feedback_items(severity);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_industry ON public.job_descriptions(industry);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ats_analyses_updated_at 
    BEFORE UPDATE ON public.ats_analyses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_descriptions_updated_at 
    BEFORE UPDATE ON public.job_descriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('ats_analyses', 'ats_feedback_items', 'job_descriptions');
