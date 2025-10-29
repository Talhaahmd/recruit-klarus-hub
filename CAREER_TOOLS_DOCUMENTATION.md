# Klarus Career Tools - Complete Documentation

## Overview

The Klarus Career Tools suite provides AI-powered career development features for both job seekers and HR professionals. This comprehensive suite includes four main tools: ATS Analysis, Skill DNA Analysis, Learning Roadmap, and Interview Gameplan.

## 🚀 Quick Start

### Accessing Career Tools

**For Job Seekers (Personal Dashboard):**
- Navigate to `/dashboard/personal` 
- Find the "Career Development Tools" section
- Click on any tool card to access the feature

**For HR Professionals (HR Dashboard):**
- Navigate to `/dashboard/hr`
- Find the "Career Development Tools" section  
- Use tools to analyze candidates and create development plans

### Direct Access URLs
- ATS Analysis: `/ats-analysis`
- Skill DNA Analysis: `/skill-dna`
- Learning Roadmap: `/learning-path`
- Interview Preparation: `/interview-prep`

---

## 📋 Tool 1: ATS Analysis

### Purpose
Optimize CVs for Applicant Tracking Systems (ATS) to increase job application success rates.

### Features
- **CV Upload & Analysis**: Upload CV text and get instant ATS scoring
- **Multi-dimensional Scoring**: 
  - ATS Score (0-100)
  - Formatting Score (0-100)
  - Keyword Density Score (0-100)
  - Grammar Score (0-100)
  - Quantifiable Results Score (0-100)
  - Overall Compatibility Score (0-100)
- **Detailed Feedback**: Specific suggestions for improvement
- **Industry-Specific Analysis**: Tailored recommendations based on job industry

### How to Use
1. **Navigate** to `/ats-analysis`
2. **Upload CV** by pasting CV text into the text area
3. **Specify Details**:
   - Job Title (optional)
   - Industry (optional)
   - Job Description (optional)
4. **Click "Analyze CV"** to get results
5. **Review Scores** and implement feedback suggestions

### Best Practices
- Include specific job title and industry for more targeted analysis
- Provide job description for keyword optimization
- Focus on quantifiable achievements and metrics
- Use industry-standard keywords and terminology

---

## 🧬 Tool 2: Skill DNA Analysis

### Purpose
Discover professional archetypes and assess skill profiles to understand career strengths and development areas.

### Features
- **Archetype Classification**: Identifies primary and secondary professional archetypes
- **Skill Scoring**: Comprehensive assessment across multiple dimensions:
  - Technical Skills Score (0-100)
  - Soft Skills Score (0-100)
  - Leadership Score (0-100)
  - Creativity Score (0-100)
  - Analytical Score (0-100)
  - Overall Skill Score (0-100)
  - Skill Balance Score (0-100)
- **Confidence Metrics**: Archetype confidence level (0.0-1.0)
- **Skill Analysis**: Detailed breakdown of individual skills with proficiency levels
- **Gap Identification**: Highlights missing skills and areas for improvement

### How to Use
1. **Navigate** to `/skill-dna`
2. **Upload CV** by pasting CV text
3. **Specify Context**:
   - Job Title (optional)
   - Industry (optional)
   - Target Role (optional)
4. **Click "Analyze Skills"** to get results
5. **Review Archetype** and skill breakdown
6. **Identify Development Areas** from missing skills

### Professional Archetypes
- **Technical Specialist**: High technical skills, focused expertise
- **Creative Innovator**: High creativity, innovative thinking
- **Strategic Leader**: High leadership, strategic planning
- **Analytical Problem-Solver**: High analytical skills, data-driven
- **Collaborative Communicator**: High soft skills, team-oriented

---

## 🎓 Tool 3: Learning Roadmap

### Purpose
Create personalized learning paths with courses and resources to bridge skill gaps and advance career goals.

### Features
- **Personalized Learning Paths**: AI-generated roadmaps based on skill gaps
- **Course Database**: Curated courses from various providers
- **Progress Tracking**: Monitor learning progress and completion
- **Resource Library**: Articles, videos, books, and tools
- **Timeline Planning**: Estimated duration and time commitment
- **Skill Mapping**: Direct connection between courses and target skills

### How to Use
1. **Navigate** to `/learning-path`
2. **Specify Learning Goals**:
   - Target Role
   - Industry
   - Skill Gaps (comma-separated)
   - Experience Level
   - Time Commitment
3. **Click "Generate Learning Path"** to create roadmap
4. **Review Generated Path** with courses and resources
5. **Start Learning** by clicking "View Course" buttons
6. **Track Progress** as you complete items

### Learning Path Components
- **Courses**: Structured learning programs
- **Resources**: Articles, videos, books
- **Projects**: Hands-on practice opportunities
- **Assessments**: Skill validation tests

### Course Categories
- Technical Skills
- Soft Skills
- Leadership & Management
- Industry-Specific Knowledge
- Tools & Technologies

---

## 💼 Tool 4: Interview Gameplan

### Purpose
Generate AI-powered interview questions and preparation strategies tailored to specific roles and companies.

### Features
- **Question Generation**: AI-created interview questions for specific roles
- **Question Categories**:
  - Behavioral Interviews
  - Technical Interviews
  - Leadership & Management
  - Cultural Fit
  - Situational Questions
  - Industry-Specific Questions
- **Practice Mode**: Interactive question answering with feedback
- **Resource Library**: Interview preparation guides and tips
- **Company-Specific Questions**: Tailored questions for specific companies

### How to Use
1. **Navigate** to `/interview-prep`
2. **Specify Interview Details**:
   - Job Title
   - Company Name
   - Industry
   - Experience Level
3. **Click "Generate Interview Gameplan"** to create questions
4. **Review Questions** organized by category
5. **Practice Answers** using the practice mode
6. **Access Resources** for additional preparation

### Question Types
- **Behavioral**: Past experience and behavior questions
- **Technical**: Skills and problem-solving questions
- **Leadership**: Management and team leadership questions
- **Cultural Fit**: Company values and culture alignment
- **Situational**: Hypothetical scenario questions
- **Industry-Specific**: Domain knowledge questions

---

## 🔧 Technical Implementation

### Database Schema
Each tool has dedicated database tables:

**ATS Analysis:**
- `ats_analyses`: Main analysis records
- `ats_feedback_items`: Detailed feedback suggestions

**Skill DNA Analysis:**
- `skill_analyses`: Main skill analysis records
- `skill_analysis_items`: Individual skill assessments
- `employee_archetypes`: Professional archetype definitions
- `skill_categories`: Skill categorization system

**Learning Roadmap:**
- `learning_paths`: Generated learning roadmaps
- `learning_path_items`: Individual learning items
- `courses`: Course database
- `course_categories`: Course categorization
- `learning_resources`: Additional learning materials

**Interview Preparation:**
- `interview_gameplans`: Generated interview plans
- `interview_questions`: Question database
- `interview_categories`: Question categorization
- `interview_resources`: Preparation materials

### Edge Functions
Each tool uses Supabase Edge Functions for AI processing:

- `analyze-ats`: CV analysis and ATS scoring
- `analyze-skills`: Skill assessment and archetype classification
- `generate-learning-path`: Learning roadmap generation
- `generate-interview-gameplan`: Interview question generation

### Frontend Services
TypeScript services handle API communication:

- `atsAnalysisService.ts`: ATS analysis API calls
- `skillAnalysisService.ts`: Skill analysis API calls
- `learningPathService.ts`: Learning path management
- `interviewPrepService.ts`: Interview preparation API calls

---

## 🎯 Use Cases

### For Job Seekers
1. **CV Optimization**: Use ATS Analysis to improve CV for specific job applications
2. **Career Discovery**: Use Skill DNA to understand professional strengths and archetype
3. **Skill Development**: Use Learning Roadmap to create personalized development plans
4. **Interview Preparation**: Use Interview Gameplan to prepare for specific interviews

### For HR Professionals
1. **Candidate Assessment**: Use ATS Analysis to evaluate candidate CVs
2. **Skill Evaluation**: Use Skill DNA to assess candidate skill profiles
3. **Development Planning**: Use Learning Roadmap to create employee development plans
4. **Interview Preparation**: Use Interview Gameplan to prepare interview questions

### For Career Coaches
1. **Client Assessment**: Use all tools to provide comprehensive career guidance
2. **Development Planning**: Create structured learning paths for clients
3. **Interview Coaching**: Prepare clients with targeted interview questions

---

## 📊 Dashboard Integration

### Personal Dashboard
- **Career Development Tools** section with quick access cards
- **Visual indicators** for each tool with hover effects
- **Direct navigation** to each career tool
- **Progress tracking** for ongoing learning paths

### HR Dashboard
- **Career Development Tools** section for candidate analysis
- **HR-focused descriptions** emphasizing candidate evaluation
- **Quick access** to all career assessment tools
- **Integration** with existing HR workflows

---

## 🔒 Security & Privacy

### Data Protection
- **User Authentication**: All tools require user authentication
- **Data Isolation**: User data is isolated by user ID
- **Secure Storage**: All data stored in Supabase with RLS (Row Level Security)
- **API Security**: Edge Functions use secure authentication

### Privacy Considerations
- **CV Data**: CV text is processed securely and not stored permanently
- **Analysis Results**: Analysis results are stored for user reference
- **No Data Sharing**: User data is not shared between users
- **GDPR Compliance**: Tools comply with data protection regulations

---

## 🚀 Getting Started Checklist

### For New Users
- [ ] Complete user registration and authentication
- [ ] Upload CV text for analysis
- [ ] Try ATS Analysis with a specific job description
- [ ] Run Skill DNA Analysis to discover professional archetype
- [ ] Generate a Learning Roadmap for career development
- [ ] Create an Interview Gameplan for upcoming interviews

### For HR Teams
- [ ] Set up team accounts and permissions
- [ ] Train team on career tools usage
- [ ] Integrate tools into recruitment workflow
- [ ] Create standard operating procedures for candidate analysis
- [ ] Monitor usage and gather feedback

---

## 📞 Support & Troubleshooting

### Common Issues

**ATS Analysis Issues:**
- Ensure CV text is properly formatted
- Check that job title and industry are specified
- Verify OpenAI API key is configured

**Skill DNA Analysis Issues:**
- Ensure CV contains sufficient skill information
- Check that target role is clearly specified
- Verify database schema is properly set up

**Learning Roadmap Issues:**
- Ensure skill gaps are clearly specified
- Check that course database is populated
- Verify Edge Function is deployed correctly

**Interview Gameplan Issues:**
- Ensure job title and company are specified
- Check that question categories are seeded
- Verify OpenAI integration is working

### Getting Help
- Check Supabase logs for Edge Function errors
- Review browser console for frontend issues
- Verify database migrations are applied
- Test with sample data to isolate issues

---

## 🔄 Future Enhancements

### Planned Features
- **Advanced Analytics**: Detailed usage and performance metrics
- **Team Collaboration**: Shared learning paths and interview preparation
- **Integration APIs**: Connect with external HR systems
- **Mobile App**: Native mobile application for career tools
- **AI Improvements**: Enhanced AI models for better analysis

### Customization Options
- **Custom Archetypes**: Define company-specific professional archetypes
- **Custom Courses**: Add internal training materials
- **Custom Questions**: Create company-specific interview questions
- **Branding**: Customize tool appearance and branding

---

## 📈 Success Metrics

### Key Performance Indicators
- **User Engagement**: Daily/monthly active users
- **Tool Usage**: Analysis completion rates
- **User Satisfaction**: Feedback scores and ratings
- **Career Outcomes**: Job placement and promotion rates
- **Learning Progress**: Course completion rates

### Monitoring & Analytics
- **Usage Tracking**: Track which tools are most popular
- **Performance Monitoring**: Monitor Edge Function performance
- **Error Tracking**: Track and resolve technical issues
- **User Feedback**: Collect and act on user suggestions

---

*This documentation is maintained and updated regularly. For the latest information, please refer to the in-app help sections or contact support.*

