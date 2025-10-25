-- Add seed data for Learning Roadmap feature

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
