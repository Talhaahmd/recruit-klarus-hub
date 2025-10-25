-- Learning Roadmap Complete SQL Script
-- This script creates all learning roadmap tables and seed data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Course Categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "All authenticated users can view course categories" ON public.course_categories;
DROP POLICY IF EXISTS "All authenticated users can view courses" ON public.courses;
DROP POLICY IF EXISTS "All authenticated users can view learning resources" ON public.learning_resources;
DROP POLICY IF EXISTS "Users can view their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can insert their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can update their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can delete their own learning paths" ON public.learning_paths;
DROP POLICY IF EXISTS "Users can view items for their own learning paths" ON public.learning_path_items;
DROP POLICY IF EXISTS "Users can insert items for their own learning paths" ON public.learning_path_items;
DROP POLICY IF EXISTS "Users can update items for their own learning paths" ON public.learning_path_items;
DROP POLICY IF EXISTS "Users can delete items for their own learning paths" ON public.learning_path_items;
DROP POLICY IF EXISTS "Users can view progress for their own learning paths" ON public.learning_progress;
DROP POLICY IF EXISTS "Users can insert progress for their own learning paths" ON public.learning_progress;
DROP POLICY IF EXISTS "Users can update progress for their own learning paths" ON public.learning_progress;
DROP POLICY IF EXISTS "Users can delete progress for their own learning paths" ON public.learning_progress;

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

-- Seed data for Course Categories
INSERT INTO public.course_categories (id, name, description, icon, color) VALUES
('cat1', 'Programming & Development', 'Software development, coding, and technical skills', 'code', '#3B82F6'),
('cat2', 'Data Science & Analytics', 'Data analysis, machine learning, and statistics', 'bar-chart', '#10B981'),
('cat3', 'Design & UX', 'User experience, visual design, and creative skills', 'palette', '#F59E0B'),
('cat4', 'Business & Management', 'Leadership, project management, and business skills', 'briefcase', '#8B5CF6'),
('cat5', 'Marketing & Sales', 'Digital marketing, sales, and communication', 'megaphone', '#EF4444'),
('cat6', 'Soft Skills', 'Communication, teamwork, and personal development', 'users', '#06B6D4'),
('cat7', 'Tools & Technology', 'Software tools, platforms, and technical utilities', 'wrench', '#84CC16'),
('cat8', 'Industry Specific', 'Specialized knowledge for specific industries', 'building', '#F97316')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed data for Courses
INSERT INTO public.courses (id, title, description, provider, url, category_id, difficulty_level, duration_hours, is_free, rating, enrollment_count, skills_covered, prerequisites, learning_objectives) VALUES
-- Programming & Development
('course1', 'JavaScript Fundamentals', 'Learn the basics of JavaScript programming language', 'freeCodeCamp', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 'cat1', 'beginner', 40, true, 4.8, 500000, ARRAY['JavaScript', 'Programming', 'Web Development'], ARRAY['Basic HTML/CSS'], ARRAY['Understand JavaScript syntax', 'Write basic programs', 'Handle data structures']),
('course2', 'Python for Data Science', 'Complete Python course for data analysis and visualization', 'Coursera', 'https://www.coursera.org/learn/python-for-applied-data-science-ai', 'cat1', 'intermediate', 60, true, 4.6, 200000, ARRAY['Python', 'Data Analysis', 'Pandas', 'NumPy'], ARRAY['Basic programming knowledge'], ARRAY['Master Python for data science', 'Use pandas and numpy', 'Create data visualizations']),
('course3', 'React Development', 'Build modern web applications with React', 'The Odin Project', 'https://www.theodinproject.com/paths/full-stack-javascript', 'cat1', 'intermediate', 80, true, 4.7, 150000, ARRAY['React', 'JavaScript', 'Frontend Development'], ARRAY['HTML', 'CSS', 'JavaScript'], ARRAY['Build React applications', 'Understand component lifecycle', 'Manage state effectively']),

-- Data Science & Analytics
('course4', 'Machine Learning Basics', 'Introduction to machine learning concepts and algorithms', 'Coursera', 'https://www.coursera.org/learn/machine-learning', 'cat2', 'intermediate', 55, true, 4.9, 1000000, ARRAY['Machine Learning', 'Python', 'Statistics', 'Algorithms'], ARRAY['Linear Algebra', 'Statistics', 'Python'], ARRAY['Understand ML algorithms', 'Implement models', 'Evaluate performance']),
('course5', 'SQL for Data Analysis', 'Master SQL for database querying and analysis', 'DataCamp', 'https://www.datacamp.com/courses/intro-to-sql-for-data-science', 'cat2', 'beginner', 20, true, 4.5, 300000, ARRAY['SQL', 'Database', 'Data Analysis'], ARRAY['Basic computer skills'], ARRAY['Write SQL queries', 'Analyze data', 'Work with databases']),

-- Design & UX
('course6', 'UI/UX Design Fundamentals', 'Learn user interface and experience design principles', 'Google', 'https://www.coursera.org/professional-certificates/google-ux-design', 'cat3', 'beginner', 100, true, 4.8, 50000, ARRAY['UI Design', 'UX Design', 'Figma', 'User Research'], ARRAY['Basic design sense'], ARRAY['Design user interfaces', 'Conduct user research', 'Create prototypes']),
('course7', 'Adobe Creative Suite', 'Master Photoshop, Illustrator, and InDesign', 'Adobe', 'https://helpx.adobe.com/creative-suite/tutorials.html', 'cat3', 'intermediate', 50, true, 4.6, 200000, ARRAY['Photoshop', 'Illustrator', 'InDesign', 'Graphic Design'], ARRAY['Basic computer skills'], ARRAY['Use Adobe tools', 'Create graphics', 'Design layouts']),

-- Business & Management
('course8', 'Project Management Fundamentals', 'Learn essential project management skills', 'PMI', 'https://www.pmi.org/learning/certifications', 'cat4', 'beginner', 30, true, 4.7, 100000, ARRAY['Project Management', 'Leadership', 'Planning', 'Risk Management'], ARRAY['Basic work experience'], ARRAY['Plan projects', 'Manage teams', 'Handle risks']),
('course9', 'Digital Marketing Strategy', 'Comprehensive digital marketing course', 'Google', 'https://learndigital.withgoogle.com/digitalgarage', 'cat5', 'intermediate', 40, true, 4.5, 500000, ARRAY['Digital Marketing', 'SEO', 'Social Media', 'Analytics'], ARRAY['Basic marketing knowledge'], ARRAY['Create marketing campaigns', 'Use analytics', 'Optimize for SEO']),

-- Soft Skills
('course10', 'Communication Skills', 'Improve your professional communication', 'LinkedIn Learning', 'https://www.linkedin.com/learning/communication-foundations', 'cat6', 'beginner', 15, true, 4.6, 200000, ARRAY['Communication', 'Presentation', 'Writing'], ARRAY['Basic English'], ARRAY['Communicate effectively', 'Present ideas', 'Write professionally']),
('course11', 'Leadership Skills', 'Develop leadership and team management abilities', 'Coursera', 'https://www.coursera.org/learn/leadership-skills', 'cat6', 'intermediate', 25, true, 4.7, 150000, ARRAY['Leadership', 'Team Management', 'Decision Making'], ARRAY['Work experience'], ARRAY['Lead teams', 'Make decisions', 'Motivate others'])
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title, 
    description = EXCLUDED.description,
    provider = EXCLUDED.provider,
    url = EXCLUDED.url;

-- Seed data for Learning Resources
INSERT INTO public.learning_resources (id, title, description, url, resource_type, category_id, difficulty_level, duration_minutes, is_free, skills_covered) VALUES
('res1', 'MDN Web Docs', 'Comprehensive web development documentation', 'https://developer.mozilla.org/', 'article', 'cat1', 'intermediate', 0, true, ARRAY['Web Development', 'HTML', 'CSS', 'JavaScript']),
('res2', 'Stack Overflow', 'Programming Q&A community', 'https://stackoverflow.com/', 'community', 'cat1', 'beginner', 0, true, ARRAY['Programming', 'Problem Solving', 'Community']),
('res3', 'GitHub', 'Code repository and collaboration platform', 'https://github.com/', 'tool', 'cat1', 'beginner', 0, true, ARRAY['Git', 'Version Control', 'Collaboration']),
('res4', 'Figma Community', 'Design resources and templates', 'https://www.figma.com/community', 'community', 'cat3', 'beginner', 0, true, ARRAY['UI Design', 'Figma', 'Design Systems']),
('res5', 'Google Analytics Academy', 'Learn web analytics and data interpretation', 'https://analytics.google.com/analytics/academy/', 'article', 'cat2', 'intermediate', 0, true, ARRAY['Analytics', 'Data Analysis', 'Marketing']),
('res6', 'Harvard Business Review', 'Business strategy and management articles', 'https://hbr.org/', 'article', 'cat4', 'advanced', 0, true, ARRAY['Business Strategy', 'Management', 'Leadership']),
('res7', 'TED Talks', 'Inspirational talks on various topics', 'https://www.ted.com/', 'video', 'cat6', 'beginner', 0, true, ARRAY['Communication', 'Inspiration', 'Learning']),
('res8', 'Medium', 'Professional articles and insights', 'https://medium.com/', 'article', 'cat6', 'intermediate', 0, true, ARRAY['Writing', 'Industry Knowledge', 'Professional Development'])
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    url = EXCLUDED.url;
