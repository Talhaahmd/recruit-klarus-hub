-- Learning Roadmap Tables Migration
-- This migration creates tables for Learning Path functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Course Categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    provider TEXT NOT NULL,
    url TEXT NOT NULL,
    category_id UUID REFERENCES public.course_categories(id) ON DELETE SET NULL,
    difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_hours INTEGER,
    is_free BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    enrollment_count INTEGER DEFAULT 0,
    skills_covered TEXT[],
    prerequisites TEXT[],
    learning_objectives TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Paths table - stores generated learning paths for users
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_role TEXT,
    industry TEXT,
    skill_gaps TEXT[] NOT NULL,
    estimated_duration_weeks INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    total_hours INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    ai_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Path Items table - individual courses/steps in a learning path
CREATE TABLE IF NOT EXISTS public.learning_path_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    item_type TEXT NOT NULL DEFAULT 'course' CHECK (item_type IN ('course', 'resource', 'project', 'assessment')),
    order_index INTEGER NOT NULL,
    estimated_hours INTEGER,
    is_required BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Progress table - tracks user progress through learning paths
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.learning_path_items(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Resources table - additional resources beyond courses
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'video', 'book', 'tool', 'practice', 'community')),
    category_id UUID REFERENCES public.course_categories(id) ON DELETE SET NULL,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_minutes INTEGER,
    is_free BOOLEAN DEFAULT true,
    skills_covered TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_categories (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view course categories" ON public.course_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for courses (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view courses" ON public.courses
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for learning_resources (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view learning resources" ON public.learning_resources
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for learning_paths
CREATE POLICY "Users can view their own learning paths" ON public.learning_paths
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own learning paths" ON public.learning_paths
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning paths" ON public.learning_paths
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own learning paths" ON public.learning_paths
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for learning_path_items
CREATE POLICY "Users can view items for their own learning paths" ON public.learning_path_items
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.learning_paths
        WHERE id = path_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can insert items for their own learning paths" ON public.learning_path_items
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.learning_paths
        WHERE id = path_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can update items for their own learning paths" ON public.learning_path_items
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.learning_paths
        WHERE id = path_id AND user_id = auth.uid()
    ));
CREATE POLICY "Users can delete items for their own learning paths" ON public.learning_path_items
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.learning_paths
        WHERE id = path_id AND user_id = auth.uid()
    ));

-- RLS Policies for learning_progress
CREATE POLICY "Users can view progress for their own learning paths" ON public.learning_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert progress for their own learning paths" ON public.learning_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update progress for their own learning paths" ON public.learning_progress
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete progress for their own learning paths" ON public.learning_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_course_categories_name ON public.course_categories(name);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON public.courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_provider ON public.courses(provider);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON public.courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON public.courses(is_free);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON public.learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON public.learning_paths(status);
CREATE INDEX IF NOT EXISTS idx_learning_paths_created_at ON public.learning_paths(created_at);
CREATE INDEX IF NOT EXISTS idx_learning_path_items_path_id ON public.learning_path_items(path_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_items_order ON public.learning_path_items(path_id, order_index);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON public.learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_path_id ON public.learning_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON public.learning_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_category_id ON public.learning_resources(category_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at
    BEFORE UPDATE ON public.learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at
    BEFORE UPDATE ON public.learning_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
