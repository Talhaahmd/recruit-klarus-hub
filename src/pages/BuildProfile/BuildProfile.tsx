
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Send, Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

type ContentType = 'linkedin' | 'job-description' | 'email';

interface ModelOption {
  id: string;
  name: string;
}

const BuildProfile: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>('linkedin');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  
  const modelOptions: ModelOption[] = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'claude', name: 'Claude' },
    { id: 'gemini', name: 'Gemini' }
  ];
  
  const contentTypeOptions = [
    { id: 'linkedin', label: 'LinkedIn Post', 
      placeholder: 'Describe what you want to post about (e.g., company culture, open positions, industry insights)' },
    { id: 'job-description', label: 'Job Description', 
      placeholder: 'Describe the role, requirements, and company details for a job posting' },
    { id: 'email', label: 'Recruitment Email', 
      placeholder: 'Describe the candidate, position, and key points to include in an outreach email' },
  ];
  
  const handleGenerate = () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI generation (in a real app, this would call an API)
    setTimeout(() => {
      let content = '';
      
      if (contentType === 'linkedin') {
        content = `# Exciting Opportunity at Klarus HR!\n\nWe're revolutionizing the hiring process with our AI-powered platform that reduces screening times by 80% while eliminating unconscious bias.\n\n🚀 We're currently looking for talented individuals to join our growing team!\n\nAt Klarus HR, we believe in:\n- Innovation-driven solutions\n- Inclusive hiring practices\n- Work-life balance\n- Continuous learning\n\nCheck out our open positions and be part of our journey to transform recruitment: [Link]\n\n#KlarusHR #AIRecruitment #Hiring #TechJobs #CareerOpportunities`;
      } else if (contentType === 'job-description') {
        content = `# Senior Frontend Developer\n\n## About Klarus HR\nKlarus HR is an AI-powered hiring platform transforming recruitment through automation, removing bias, and creating equitable opportunities. Our mission is to make hiring fair, efficient, and accessible for all.\n\n## Role Overview\nWe're seeking an experienced Frontend Developer to join our product team. You'll build intuitive interfaces that help recruiters and candidates navigate our platform with ease.\n\n## Responsibilities\n- Develop responsive user interfaces using React and TypeScript\n- Collaborate with designers to implement pixel-perfect UI components\n- Write clean, maintainable code with thorough testing\n- Optimize application performance and user experience\n- Work in an agile environment with cross-functional teams\n\n## Requirements\n- 3+ years experience with modern JavaScript frameworks (React preferred)\n- Strong TypeScript skills and understanding of state management\n- Experience with responsive design and CSS frameworks\n- Passion for creating accessible, user-friendly interfaces\n- Excellent communication and collaboration skills\n\n## Benefits\n- Competitive salary and equity options\n- Remote-first culture with flexible hours\n- Health, dental, and vision insurance\n- Learning and development budget\n- 25 days PTO plus holidays\n\nKlarus HR is an equal opportunity employer committed to building a diverse team.`;
      } else if (contentType === 'email') {
        content = `Subject: Opportunity to Join Klarus HR's Engineering Team\n\nDear [Candidate Name],\n\nI hope this email finds you well. My name is [Your Name], and I'm the [Your Position] at Klarus HR. I recently came across your profile and was impressed by your experience in [specific skill/achievement].\n\nWe're currently building an AI-powered hiring platform that's transforming recruitment by eliminating bias and reducing screening times by over 80%. Given your background in [relevant experience], I believe you could be a fantastic addition to our team.\n\nWe're looking for a [Job Title] who can help us [key responsibility]. Your experience with [specific skill] seems particularly relevant to the challenges we're solving.\n\nIf you're open to exploring this opportunity, I'd love to schedule a brief call to discuss how your skills might align with our mission and what we're building at Klarus HR.\n\nFeel free to check out more about us at [website] or respond with any questions you might have.\n\nLooking forward to potentially connecting!\n\nBest regards,\n[Your Name]\n[Your Position]\nKlarus HR\n[Contact Information]`;
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success('Content generated successfully!');
    }, 2000);
  };
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };
  
  return (
    <div>
      <Header 
        title="Build Profile" 
        subtitle="Create professional content for recruitment and LinkedIn."
      />
      
      <div className="glass-card p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-100 mb-2">
            Content Type
          </label>
          <div className="flex flex-wrap gap-3">
            {contentTypeOptions.map((option) => (
              <button
                key={option.id}
                className={`px-4 py-2 rounded-lg transition-all ${
                  contentType === option.id
                    ? 'bg-primary-100 text-white'
                    : 'bg-white border border-gray-200 hover:border-primary-100'
                }`}
                onClick={() => setContentType(option.id as ContentType)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-100 mb-2">
            AI Model
          </label>
          <div className="flex flex-wrap gap-3">
            {modelOptions.map((option) => (
              <button
                key={option.id}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedModel === option.id
                    ? 'bg-accent-100 text-white'
                    : 'bg-white border border-gray-200 hover:border-accent-100'
                }`}
                onClick={() => setSelectedModel(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-100 mb-2">
            Your Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={contentTypeOptions.find(opt => opt.id === contentType)?.placeholder}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            disabled={isGenerating || !prompt}
            onClick={handleGenerate}
            className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 size={18} />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {generatedContent && (
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Generated Content</h3>
            <button
              onClick={handleCopyContent}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
          </div>
          
          <div className="w-full p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap">
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildProfile;
