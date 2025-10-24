-- Skill DNA Analysis Tables Migration
-- This migration creates tables for skill analysis and archetype classification

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Skill Categories table - predefined skill categories
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category_type TEXT NOT NULL CHECK (category_type IN ('technical', 'soft', 'leadership', 'creative', 'analytical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table - individual skills with metadata
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
    skill_type TEXT NOT NULL CHECK (skill_type IN ('hard', 'soft', 'hybrid')),
    industry_relevance JSONB, -- Store industry-specific relevance scores
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Archetypes table - predefined personality/work style archetypes
CREATE TABLE IF NOT EXISTS public.employee_archetypes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    characteristics TEXT[] NOT NULL, -- Array of key characteristics
    ideal_roles TEXT[] NOT NULL, -- Array of ideal job roles
    skill_priorities JSONB, -- JSON object mapping skill categories to priority scores
    personality_traits JSONB, -- JSON object with personality indicators
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Analyses table - main analysis results
CREATE TABLE IF NOT EXISTS public.skill_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cv_text TEXT NOT NULL,
    job_title TEXT,
    industry TEXT,
    target_role TEXT,
    -- Skill scores (0-100)
    technical_skills_score INTEGER CHECK (technical_skills_score >= 0 AND technical_skills_score <= 100),
    soft_skills_score INTEGER CHECK (soft_skills_score >= 0 AND soft_skills_score <= 100),
    leadership_score INTEGER CHECK (leadership_score >= 0 AND leadership_score <= 100),
    creativity_score INTEGER CHECK (creativity_score >= 0 AND creativity_score <= 100),
    analytical_score INTEGER CHECK (analytical_score >= 0 AND analytical_score <= 100),
    -- Overall assessment
    overall_skill_score INTEGER CHECK (overall_skill_score >= 0 AND overall_skill_score <= 100),
    skill_balance_score INTEGER CHECK (skill_balance_score >= 0 AND skill_balance_score <= 100),
    -- Archetype classification
    primary_archetype_id UUID REFERENCES public.employee_archetypes(id),
    secondary_archetype_id UUID REFERENCES public.employee_archetypes(id),
    archetype_confidence DECIMAL(3,2) CHECK (archetype_confidence >= 0 AND archetype_confidence <= 1),
    -- AI analysis results
    top_skills TEXT[] NOT NULL, -- Array of top identified skills
    missing_skills TEXT[] NOT NULL, -- Array of missing/weak skills
    skill_gaps JSONB, -- Detailed skill gap analysis
    personality_indicators JSONB, -- Tone and personality analysis
    ai_analysis JSONB, -- Store detailed AI analysis
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Analysis Items table - detailed skill assessments
CREATE TABLE IF NOT EXISTS public.skill_analysis_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.skill_analyses(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    skill_category TEXT NOT NULL,
    proficiency_level TEXT NOT NULL CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
    evidence TEXT, -- Evidence from CV supporting this skill assessment
    is_strong_point BOOLEAN DEFAULT FALSE,
    is_weak_point BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Maps table - industry/role specific skill requirements
CREATE TABLE IF NOT EXISTS public.skill_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_title TEXT NOT NULL,
    industry TEXT NOT NULL,
    required_skills JSONB NOT NULL, -- JSON object mapping skills to importance levels
    skill_priorities JSONB NOT NULL, -- JSON object with skill category priorities
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_analysis_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_maps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view skill categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
DROP POLICY IF EXISTS "Anyone can view employee archetypes" ON public.employee_archetypes;
DROP POLICY IF EXISTS "Anyone can view skill maps" ON public.skill_maps;
DROP POLICY IF EXISTS "Users can view their own skill analyses" ON public.skill_analyses;
DROP POLICY IF EXISTS "Users can insert their own skill analyses" ON public.skill_analyses;
DROP POLICY IF EXISTS "Users can update their own skill analyses" ON public.skill_analyses;
DROP POLICY IF EXISTS "Users can delete their own skill analyses" ON public.skill_analyses;
DROP POLICY IF EXISTS "Users can view their skill analysis items" ON public.skill_analysis_items;
DROP POLICY IF EXISTS "Users can insert their skill analysis items" ON public.skill_analysis_items;
DROP POLICY IF EXISTS "Users can update their skill analysis items" ON public.skill_analysis_items;
DROP POLICY IF EXISTS "Users can delete their skill analysis items" ON public.skill_analysis_items;

-- RLS Policies for skill_categories (public read access)
CREATE POLICY "Anyone can view skill categories"
    ON public.skill_categories FOR SELECT
    USING (true);

-- RLS Policies for skills (public read access)
CREATE POLICY "Anyone can view skills"
    ON public.skills FOR SELECT
    USING (true);

-- RLS Policies for employee_archetypes (public read access)
CREATE POLICY "Anyone can view employee archetypes"
    ON public.employee_archetypes FOR SELECT
    USING (true);

-- RLS Policies for skill_maps (public read access)
CREATE POLICY "Anyone can view skill maps"
    ON public.skill_maps FOR SELECT
    USING (true);

-- RLS Policies for skill_analyses
CREATE POLICY "Users can view their own skill analyses"
    ON public.skill_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skill analyses"
    ON public.skill_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skill analyses"
    ON public.skill_analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skill analyses"
    ON public.skill_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for skill_analysis_items
CREATE POLICY "Users can view their skill analysis items"
    ON public.skill_analysis_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.skill_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their skill analysis items"
    ON public.skill_analysis_items FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.skill_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can update their skill analysis items"
    ON public.skill_analysis_items FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.skill_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their skill analysis items"
    ON public.skill_analysis_items FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM public.skill_analyses 
        WHERE id = analysis_id AND user_id = auth.uid()
    ));

-- Create indexes for better performance
CREATE INDEX idx_skills_category_id ON public.skills(category_id);
CREATE INDEX idx_skills_name ON public.skills(name);
CREATE INDEX idx_skill_analyses_user_id ON public.skill_analyses(user_id);
CREATE INDEX idx_skill_analyses_created_at ON public.skill_analyses(created_at);
CREATE INDEX idx_skill_analyses_industry ON public.skill_analyses(industry);
CREATE INDEX idx_skill_analyses_primary_archetype ON public.skill_analyses(primary_archetype_id);
CREATE INDEX idx_skill_analysis_items_analysis_id ON public.skill_analysis_items(analysis_id);
CREATE INDEX idx_skill_analysis_items_skill_name ON public.skill_analysis_items(skill_name);
CREATE INDEX idx_skill_maps_role_industry ON public.skill_maps(role_title, industry);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_skill_analyses_updated_at 
    BEFORE UPDATE ON public.skill_analyses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
