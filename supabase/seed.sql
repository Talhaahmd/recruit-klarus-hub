-- Seed data for Skill DNA Analysis
-- This file seeds the database with initial skill categories, skills, archetypes, and skill maps

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
