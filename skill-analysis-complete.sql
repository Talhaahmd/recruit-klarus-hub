-- Complete Skill DNA Analysis Setup
-- Run this script in the Supabase SQL Editor to create all skill analysis tables and seed data

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
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_user_id ON public.skill_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_created_at ON public.skill_analyses(created_at);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_industry ON public.skill_analyses(industry);
CREATE INDEX IF NOT EXISTS idx_skill_analyses_primary_archetype ON public.skill_analyses(primary_archetype_id);
CREATE INDEX IF NOT EXISTS idx_skill_analysis_items_analysis_id ON public.skill_analysis_items(analysis_id);
CREATE INDEX IF NOT EXISTS idx_skill_analysis_items_skill_name ON public.skill_analysis_items(skill_name);
CREATE INDEX IF NOT EXISTS idx_skill_maps_role_industry ON public.skill_maps(role_title, industry);

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

-- Insert Skill Categories
INSERT INTO public.skill_categories (name, description, category_type) VALUES
('Programming & Development', 'Technical programming and software development skills', 'technical'),
('Data & Analytics', 'Data analysis, statistics, and analytical skills', 'analytical'),
('Design & Creative', 'Design, creativity, and artistic skills', 'creative'),
('Communication', 'Verbal and written communication skills', 'soft'),
('Leadership & Management', 'Team leadership and management capabilities', 'leadership'),
('Problem Solving', 'Critical thinking and problem-solving abilities', 'analytical'),
('Project Management', 'Planning, organizing, and executing projects', 'leadership'),
('Customer Service', 'Client interaction and service skills', 'soft'),
('Sales & Marketing', 'Business development and marketing skills', 'soft'),
('Technical Writing', 'Documentation and technical communication', 'technical');

-- Insert Skills
INSERT INTO public.skills (name, description, category_id, skill_type) VALUES
-- Programming & Development
('JavaScript', 'JavaScript programming language', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('Python', 'Python programming language', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('React', 'React.js framework', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('Node.js', 'Node.js runtime environment', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('SQL', 'Structured Query Language', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('Git', 'Version control system', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('Docker', 'Containerization technology', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),
('AWS', 'Amazon Web Services', (SELECT id FROM public.skill_categories WHERE name = 'Programming & Development'), 'hard'),

-- Data & Analytics
('Data Analysis', 'Analyzing and interpreting data', (SELECT id FROM public.skill_categories WHERE name = 'Data & Analytics'), 'hard'),
('Statistics', 'Statistical analysis and methods', (SELECT id FROM public.skill_categories WHERE name = 'Data & Analytics'), 'hard'),
('Machine Learning', 'ML algorithms and implementation', (SELECT id FROM public.skill_categories WHERE name = 'Data & Analytics'), 'hard'),
('Excel', 'Spreadsheet analysis and modeling', (SELECT id FROM public.skill_categories WHERE name = 'Data & Analytics'), 'hard'),
('Tableau', 'Data visualization tool', (SELECT id FROM public.skill_categories WHERE name = 'Data & Analytics'), 'hard'),
('Power BI', 'Business intelligence platform', (SELECT id FROM public.skill_categories WHERE name = 'Data & Analytics'), 'hard'),

-- Design & Creative
('UI/UX Design', 'User interface and experience design', (SELECT id FROM public.skill_categories WHERE name = 'Design & Creative'), 'hard'),
('Graphic Design', 'Visual design and branding', (SELECT id FROM public.skill_categories WHERE name = 'Design & Creative'), 'hard'),
('Adobe Creative Suite', 'Design software proficiency', (SELECT id FROM public.skill_categories WHERE name = 'Design & Creative'), 'hard'),
('Figma', 'Collaborative design tool', (SELECT id FROM public.skill_categories WHERE name = 'Design & Creative'), 'hard'),
('Sketch', 'Digital design tool', (SELECT id FROM public.skill_categories WHERE name = 'Design & Creative'), 'hard'),

-- Communication
('Public Speaking', 'Presenting to groups and audiences', (SELECT id FROM public.skill_categories WHERE name = 'Communication'), 'soft'),
('Written Communication', 'Clear and effective writing', (SELECT id FROM public.skill_categories WHERE name = 'Communication'), 'soft'),
('Active Listening', 'Understanding and responding to others', (SELECT id FROM public.skill_categories WHERE name = 'Communication'), 'soft'),
('Presentation Skills', 'Creating and delivering presentations', (SELECT id FROM public.skill_categories WHERE name = 'Communication'), 'soft'),

-- Leadership & Management
('Team Leadership', 'Leading and motivating teams', (SELECT id FROM public.skill_categories WHERE name = 'Leadership & Management'), 'soft'),
('Strategic Planning', 'Long-term planning and vision', (SELECT id FROM public.skill_categories WHERE name = 'Leadership & Management'), 'soft'),
('Conflict Resolution', 'Managing and resolving conflicts', (SELECT id FROM public.skill_categories WHERE name = 'Leadership & Management'), 'soft'),
('Mentoring', 'Guiding and developing others', (SELECT id FROM public.skill_categories WHERE name = 'Leadership & Management'), 'soft'),

-- Problem Solving
('Critical Thinking', 'Analyzing problems systematically', (SELECT id FROM public.skill_categories WHERE name = 'Problem Solving'), 'soft'),
('Research', 'Gathering and analyzing information', (SELECT id FROM public.skill_categories WHERE name = 'Problem Solving'), 'soft'),
('Innovation', 'Creative problem-solving approaches', (SELECT id FROM public.skill_categories WHERE name = 'Problem Solving'), 'soft'),

-- Project Management
('Agile', 'Agile project management methodology', (SELECT id FROM public.skill_categories WHERE name = 'Project Management'), 'hard'),
('Scrum', 'Scrum framework implementation', (SELECT id FROM public.skill_categories WHERE name = 'Project Management'), 'hard'),
('Risk Management', 'Identifying and mitigating risks', (SELECT id FROM public.skill_categories WHERE name = 'Project Management'), 'soft'),
('Budget Management', 'Managing project budgets', (SELECT id FROM public.skill_categories WHERE name = 'Project Management'), 'hard');

-- Insert Employee Archetypes
INSERT INTO public.employee_archetypes (name, description, characteristics, ideal_roles, skill_priorities, personality_traits) VALUES
('The Innovator', 'Creative problem-solver who thrives on new challenges and innovative solutions', 
 ARRAY['Creative', 'Curious', 'Risk-taking', 'Visionary', 'Adaptable'],
 ARRAY['Product Manager', 'UX Designer', 'Research Scientist', 'Entrepreneur', 'Innovation Manager'],
 '{"creative": 0.9, "analytical": 0.7, "leadership": 0.6, "technical": 0.5, "soft": 0.8}',
 '{"openness": 0.9, "conscientiousness": 0.6, "extraversion": 0.7, "agreeableness": 0.6, "neuroticism": 0.3}'),

('The Analyst', 'Data-driven professional who excels at research, analysis, and evidence-based decision making',
 ARRAY['Analytical', 'Detail-oriented', 'Methodical', 'Logical', 'Precise'],
 ARRAY['Data Scientist', 'Business Analyst', 'Research Analyst', 'Financial Analyst', 'Operations Manager'],
 '{"analytical": 0.9, "technical": 0.8, "soft": 0.5, "leadership": 0.4, "creative": 0.6}',
 '{"openness": 0.7, "conscientiousness": 0.9, "extraversion": 0.4, "agreeableness": 0.6, "neuroticism": 0.4}'),

('The Leader', 'Natural-born leader who excels at managing teams, driving strategy, and inspiring others',
 ARRAY['Charismatic', 'Strategic', 'Inspiring', 'Decisive', 'Empathetic'],
 ARRAY['CEO', 'VP of Operations', 'Team Lead', 'Department Head', 'Executive Director'],
 '{"leadership": 0.9, "soft": 0.8, "analytical": 0.6, "creative": 0.5, "technical": 0.4}',
 '{"openness": 0.6, "conscientiousness": 0.8, "extraversion": 0.9, "agreeableness": 0.7, "neuroticism": 0.3}'),

('The Builder', 'Technical expert who loves building, coding, and implementing solutions',
 ARRAY['Technical', 'Problem-solver', 'Persistent', 'Detail-oriented', 'Logical'],
 ARRAY['Software Engineer', 'DevOps Engineer', 'System Architect', 'Technical Lead', 'Solutions Engineer'],
 '{"technical": 0.9, "analytical": 0.8, "soft": 0.5, "leadership": 0.4, "creative": 0.6}',
 '{"openness": 0.7, "conscientiousness": 0.8, "extraversion": 0.4, "agreeableness": 0.6, "neuroticism": 0.4}'),

('The Connector', 'Relationship-focused professional who excels at communication, collaboration, and building networks',
 ARRAY['Collaborative', 'Communicative', 'Empathetic', 'Diplomatic', 'Network-oriented'],
 ARRAY['Account Manager', 'HR Manager', 'Sales Manager', 'Community Manager', 'Partnership Manager'],
 '{"soft": 0.9, "leadership": 0.7, "analytical": 0.4, "creative": 0.6, "technical": 0.3}',
 '{"openness": 0.6, "conscientiousness": 0.7, "extraversion": 0.9, "agreeableness": 0.9, "neuroticism": 0.3}'),

('The Specialist', 'Deep domain expert who excels in a specific field with extensive knowledge and expertise',
 ARRAY['Expert', 'Focused', 'Knowledgeable', 'Reliable', 'Methodical'],
 ARRAY['Senior Developer', 'Subject Matter Expert', 'Technical Consultant', 'Research Scientist', 'Domain Expert'],
 '{"technical": 0.9, "analytical": 0.8, "soft": 0.4, "leadership": 0.3, "creative": 0.5}',
 '{"openness": 0.5, "conscientiousness": 0.9, "extraversion": 0.3, "agreeableness": 0.6, "neuroticism": 0.4}');

-- Insert Skill Maps for different roles and industries
INSERT INTO public.skill_maps (role_title, industry, required_skills, skill_priorities, experience_level) VALUES
-- Software Engineering roles
('Software Engineer', 'Technology', 
 '{"JavaScript": 0.9, "Python": 0.8, "React": 0.7, "SQL": 0.8, "Git": 0.9, "Problem Solving": 0.9, "Communication": 0.6}',
 '{"technical": 0.9, "analytical": 0.8, "soft": 0.5, "leadership": 0.3, "creative": 0.6}',
 'mid'),

('Senior Software Engineer', 'Technology',
 '{"JavaScript": 0.9, "Python": 0.8, "React": 0.8, "Node.js": 0.7, "AWS": 0.6, "Leadership": 0.7, "Mentoring": 0.8, "Strategic Planning": 0.6}',
 '{"technical": 0.9, "leadership": 0.7, "analytical": 0.8, "soft": 0.6, "creative": 0.5}',
 'senior'),

-- Data Science roles
('Data Scientist', 'Technology',
 '{"Python": 0.9, "SQL": 0.8, "Machine Learning": 0.9, "Statistics": 0.8, "Data Analysis": 0.9, "Communication": 0.7, "Research": 0.8}',
 '{"analytical": 0.9, "technical": 0.8, "soft": 0.6, "leadership": 0.4, "creative": 0.7}',
 'mid'),

-- Product Management roles
('Product Manager', 'Technology',
 '{"Strategic Planning": 0.9, "Communication": 0.8, "Leadership": 0.8, "Analytics": 0.7, "Innovation": 0.8, "Project Management": 0.7}',
 '{"leadership": 0.8, "analytical": 0.7, "soft": 0.8, "creative": 0.8, "technical": 0.5}',
 'senior'),

-- Marketing roles
('Marketing Manager', 'Marketing',
 '{"Communication": 0.9, "Strategic Planning": 0.8, "Analytics": 0.7, "Leadership": 0.7, "Innovation": 0.7, "Project Management": 0.6}',
 '{"soft": 0.8, "leadership": 0.7, "creative": 0.8, "analytical": 0.6, "technical": 0.3}',
 'mid'),

-- Sales roles
('Sales Manager', 'Sales',
 '{"Communication": 0.9, "Leadership": 0.8, "Strategic Planning": 0.7, "Customer Service": 0.8, "Analytics": 0.6, "Mentoring": 0.7}',
 '{"soft": 0.9, "leadership": 0.8, "analytical": 0.5, "creative": 0.6, "technical": 0.3}',
 'senior'),

-- Design roles
('UX Designer', 'Design',
 '{"UI/UX Design": 0.9, "Figma": 0.8, "Communication": 0.8, "Research": 0.7, "Innovation": 0.8, "Problem Solving": 0.7}',
 '{"creative": 0.9, "soft": 0.7, "analytical": 0.6, "leadership": 0.4, "technical": 0.5}',
 'mid'),

-- Operations roles
('Operations Manager', 'Operations',
 '{"Strategic Planning": 0.8, "Leadership": 0.8, "Analytics": 0.7, "Project Management": 0.8, "Communication": 0.7, "Risk Management": 0.7}',
 '{"leadership": 0.8, "analytical": 0.7, "soft": 0.7, "creative": 0.5, "technical": 0.4}',
 'senior');

-- Verify tables were created
SELECT 'Skill DNA Analysis tables created successfully!' as status;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('skill_categories', 'skills', 'employee_archetypes', 'skill_analyses', 'skill_analysis_items', 'skill_maps');
