-- Corrected seed data for Learning Roadmap feature
-- Using proper UUIDs instead of string IDs

-- First, let's get some UUIDs for our seed data
-- We'll use gen_random_uuid() to generate proper UUIDs

-- Seed data for Course Categories
INSERT INTO public.course_categories (id, name, description, icon, color) VALUES
(gen_random_uuid(), 'Programming & Development', 'Software development, coding, and technical skills', 'code', '#3B82F6'),
(gen_random_uuid(), 'Data Science & Analytics', 'Data analysis, machine learning, and statistics', 'bar-chart', '#10B981'),
(gen_random_uuid(), 'Design & UX', 'User experience, visual design, and creative skills', 'palette', '#F59E0B'),
(gen_random_uuid(), 'Business & Management', 'Leadership, project management, and business skills', 'briefcase', '#8B5CF6'),
(gen_random_uuid(), 'Marketing & Sales', 'Digital marketing, sales, and communication', 'megaphone', '#EF4444'),
(gen_random_uuid(), 'Soft Skills', 'Communication, teamwork, and personal development', 'users', '#06B6D4'),
(gen_random_uuid(), 'Tools & Technology', 'Software tools, platforms, and technical utilities', 'wrench', '#84CC16'),
(gen_random_uuid(), 'Industry Specific', 'Specialized knowledge for specific industries', 'building', '#F97316');

-- Get the category IDs for courses
WITH category_ids AS (
  SELECT id, name FROM public.course_categories
),
programming_cat AS (
  SELECT id FROM category_ids WHERE name = 'Programming & Development'
),
data_science_cat AS (
  SELECT id FROM category_ids WHERE name = 'Data Science & Analytics'
),
design_cat AS (
  SELECT id FROM category_ids WHERE name = 'Design & UX'
),
business_cat AS (
  SELECT id FROM category_ids WHERE name = 'Business & Management'
),
marketing_cat AS (
  SELECT id FROM category_ids WHERE name = 'Marketing & Sales'
),
soft_skills_cat AS (
  SELECT id FROM category_ids WHERE name = 'Soft Skills'
)

-- Seed data for Courses
INSERT INTO public.courses (title, description, provider, url, category_id, difficulty_level, duration_hours, is_free, rating, enrollment_count, skills_covered, prerequisites, learning_objectives) VALUES
-- Programming & Development
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming language', 'freeCodeCamp', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', (SELECT id FROM programming_cat), 'beginner', 40, true, 4.8, 500000, ARRAY['JavaScript', 'Programming', 'Web Development'], ARRAY['Basic HTML/CSS'], ARRAY['Understand JavaScript syntax', 'Write basic programs', 'Handle data structures']),
('Python for Data Science', 'Complete Python course for data analysis and visualization', 'Coursera', 'https://www.coursera.org/learn/python-for-applied-data-science-ai', (SELECT id FROM programming_cat), 'intermediate', 60, true, 4.6, 200000, ARRAY['Python', 'Data Analysis', 'Pandas', 'NumPy'], ARRAY['Basic programming knowledge'], ARRAY['Master Python for data science', 'Use pandas and numpy', 'Create data visualizations']),
('React Development', 'Build modern web applications with React', 'The Odin Project', 'https://www.theodinproject.com/paths/full-stack-javascript', (SELECT id FROM programming_cat), 'intermediate', 80, true, 4.7, 150000, ARRAY['React', 'JavaScript', 'Frontend Development'], ARRAY['HTML', 'CSS', 'JavaScript'], ARRAY['Build React applications', 'Understand component lifecycle', 'Manage state effectively']),

-- Data Science & Analytics
('Machine Learning Basics', 'Introduction to machine learning concepts and algorithms', 'Coursera', 'https://www.coursera.org/learn/machine-learning', (SELECT id FROM data_science_cat), 'intermediate', 55, true, 4.9, 1000000, ARRAY['Machine Learning', 'Python', 'Statistics', 'Algorithms'], ARRAY['Linear Algebra', 'Statistics', 'Python'], ARRAY['Understand ML algorithms', 'Implement models', 'Evaluate performance']),
('SQL for Data Analysis', 'Master SQL for database querying and analysis', 'DataCamp', 'https://www.datacamp.com/courses/intro-to-sql-for-data-science', (SELECT id FROM data_science_cat), 'beginner', 20, true, 4.5, 300000, ARRAY['SQL', 'Database', 'Data Analysis'], ARRAY['Basic computer skills'], ARRAY['Write SQL queries', 'Analyze data', 'Work with databases']),

-- Design & UX
('UI/UX Design Fundamentals', 'Learn user interface and experience design principles', 'Google', 'https://www.coursera.org/professional-certificates/google-ux-design', (SELECT id FROM design_cat), 'beginner', 100, true, 4.8, 50000, ARRAY['UI Design', 'UX Design', 'Figma', 'User Research'], ARRAY['Basic design sense'], ARRAY['Design user interfaces', 'Conduct user research', 'Create prototypes']),
('Adobe Creative Suite', 'Master Photoshop, Illustrator, and InDesign', 'Adobe', 'https://helpx.adobe.com/creative-suite/tutorials.html', (SELECT id FROM design_cat), 'intermediate', 50, true, 4.6, 200000, ARRAY['Photoshop', 'Illustrator', 'InDesign', 'Graphic Design'], ARRAY['Basic computer skills'], ARRAY['Use Adobe tools', 'Create graphics', 'Design layouts']),

-- Business & Management
('Project Management Fundamentals', 'Learn essential project management skills', 'PMI', 'https://www.pmi.org/learning/certifications', (SELECT id FROM business_cat), 'beginner', 30, true, 4.7, 100000, ARRAY['Project Management', 'Leadership', 'Planning', 'Risk Management'], ARRAY['Basic work experience'], ARRAY['Plan projects', 'Manage teams', 'Handle risks']),

-- Marketing & Sales
('Digital Marketing Strategy', 'Comprehensive digital marketing course', 'Google', 'https://learndigital.withgoogle.com/digitalgarage', (SELECT id FROM marketing_cat), 'intermediate', 40, true, 4.5, 500000, ARRAY['Digital Marketing', 'SEO', 'Social Media', 'Analytics'], ARRAY['Basic marketing knowledge'], ARRAY['Create marketing campaigns', 'Use analytics', 'Optimize for SEO']),

-- Soft Skills
('Communication Skills', 'Improve your professional communication', 'LinkedIn Learning', 'https://www.linkedin.com/learning/communication-foundations', (SELECT id FROM soft_skills_cat), 'beginner', 15, true, 4.6, 200000, ARRAY['Communication', 'Presentation', 'Writing'], ARRAY['Basic English'], ARRAY['Communicate effectively', 'Present ideas', 'Write professionally']),
('Leadership Skills', 'Develop leadership and team management abilities', 'Coursera', 'https://www.coursera.org/learn/leadership-skills', (SELECT id FROM soft_skills_cat), 'intermediate', 25, true, 4.7, 150000, ARRAY['Leadership', 'Team Management', 'Decision Making'], ARRAY['Work experience'], ARRAY['Lead teams', 'Make decisions', 'Motivate others']);

-- Seed data for Learning Resources
INSERT INTO public.learning_resources (title, description, url, resource_type, category_id, difficulty_level, duration_minutes, is_free, skills_covered) VALUES
('MDN Web Docs', 'Comprehensive web development documentation', 'https://developer.mozilla.org/', 'article', (SELECT id FROM programming_cat), 'intermediate', 0, true, ARRAY['Web Development', 'HTML', 'CSS', 'JavaScript']),
('Stack Overflow', 'Programming Q&A community', 'https://stackoverflow.com/', 'community', (SELECT id FROM programming_cat), 'beginner', 0, true, ARRAY['Programming', 'Problem Solving', 'Community']),
('GitHub', 'Code repository and collaboration platform', 'https://github.com/', 'tool', (SELECT id FROM programming_cat), 'beginner', 0, true, ARRAY['Git', 'Version Control', 'Collaboration']),
('Figma Community', 'Design resources and templates', 'https://www.figma.com/community', 'community', (SELECT id FROM design_cat), 'beginner', 0, true, ARRAY['UI Design', 'Figma', 'Design Systems']),
('Google Analytics Academy', 'Learn web analytics and data interpretation', 'https://analytics.google.com/analytics/academy/', 'article', (SELECT id FROM data_science_cat), 'intermediate', 0, true, ARRAY['Analytics', 'Data Analysis', 'Marketing']),
('Harvard Business Review', 'Business strategy and management articles', 'https://hbr.org/', 'article', (SELECT id FROM business_cat), 'advanced', 0, true, ARRAY['Business Strategy', 'Management', 'Leadership']),
('TED Talks', 'Inspirational talks on various topics', 'https://www.ted.com/', 'video', (SELECT id FROM soft_skills_cat), 'beginner', 0, true, ARRAY['Communication', 'Inspiration', 'Learning']),
('Medium', 'Professional articles and insights', 'https://medium.com/', 'article', (SELECT id FROM soft_skills_cat), 'intermediate', 0, true, ARRAY['Writing', 'Industry Knowledge', 'Professional Development']);
