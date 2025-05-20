
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Calendar as CalendarIcon, Send, Copy, Wand2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { linkedinService } from '@/services/linkedinService';
import { calendarService } from '@/services/calendarService';

type NicheType = 'tech' | 'hr' | 'marketing' | 'finance' | 'healthcare';

interface TrendingTopic {
  id: string;
  title: string;
}

const BuildProfile: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState<NicheType>('tech');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('12:00 PM');
  const [showSchedule, setShowSchedule] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const niches = [
    { id: 'tech', label: 'Technology' },
    { id: 'hr', label: 'Human Resources' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'finance', label: 'Finance' },
    { id: 'healthcare', label: 'Healthcare' }
  ];
  
  const trendingTopics: Record<NicheType, TrendingTopic[]> = {
    tech: [
      { id: 'ai', title: 'AI and Machine Learning Trends' },
      { id: 'remote', title: 'Remote Work Tools for Tech Teams' },
      { id: 'cloud', title: 'Cloud Computing Innovations' }
    ],
    hr: [
      { id: 'hiring', title: 'Innovative Hiring Practices' },
      { id: 'retention', title: 'Employee Retention Strategies' },
      { id: 'dei', title: 'Diversity and Inclusion Initiatives' }
    ],
    marketing: [
      { id: 'social', title: 'Social Media Marketing Strategies' },
      { id: 'content', title: 'Content Marketing Tips' },
      { id: 'seo', title: 'SEO Best Practices' }
    ],
    finance: [
      { id: 'crypto', title: 'Cryptocurrency Trends' },
      { id: 'investing', title: 'Investment Strategies' },
      { id: 'fintech', title: 'Fintech Innovations' }
    ],
    healthcare: [
      { id: 'telehealth', title: 'Telehealth Solutions' },
      { id: 'wellness', title: 'Workplace Wellness Programs' },
      { id: 'tech', title: 'Healthcare Technology Advancements' }
    ]
  };
  
  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in a real app, this would call an API)
      setTimeout(async () => {
        let content = `# Exciting Opportunity at Klarus HR!\n\nWe're revolutionizing the hiring process with our AI-powered platform that reduces screening times by 80% while eliminating unconscious bias.\n\n🚀 We're currently looking for talented individuals to join our growing team!\n\nAt Klarus HR, we believe in:\n- Innovation-driven solutions\n- Inclusive hiring practices\n- Work-life balance\n- Continuous learning\n\nCheck out our open positions and be part of our journey to transform recruitment: [Link]\n\n#KlarusHR #AIRecruitment #Hiring #TechJobs #CareerOpportunities`;
        
        setGeneratedContent(content);
        
        // Save to database based on schedule settings
        if (showSchedule && date && time) {
          const linkedInPost = await linkedinService.createPost({
            content: content,
            scheduledDate: date,
            scheduledTime: time,
            posted: false,
            niche: selectedNiche
          });
          
          // Create a calendar event for the scheduled post
          if (linkedInPost) {
            await calendarService.createEvent({
              title: 'LinkedIn Post: ' + prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''),
              description: 'Scheduled LinkedIn post about: ' + prompt,
              startDate: date,
              endDate: date,
              type: 'LinkedIn Post'
            });
            
            toast.success(`Content scheduled for ${format(date, 'PPP')} at ${time}`);
          }
          
          setShowSchedule(false);
        } else {
          // Immediate post (just save to database)
          await linkedinService.createPost({
            content: content,
            scheduledDate: null,
            scheduledTime: null,
            posted: true,
            niche: selectedNiche
          });
          
          setShowSuccessDialog(true);
        }
        
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
      setIsGenerating(false);
    }
  };
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard');
  };
  
  const handleSelectTopic = (title: string) => {
    setPrompt(title);
  };
  
  const selectTime = (timeString: string) => {
    setTime(timeString);
  };
  
  return (
    <div>
      <Header 
        title="Build Profile" 
        subtitle="Create professional content for LinkedIn."
      />
      
      <div className="glass-card p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-100 mb-2">
            LinkedIn Post
          </label>
          <p className="text-sm text-text-200 mb-4">
            Create engaging LinkedIn content to showcase your recruitment expertise, company culture, and job opportunities.
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-100 mb-2">
            Select Your Niche
          </label>
          <div className="flex flex-wrap gap-3">
            {niches.map((niche) => (
              <button
                key={niche.id}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedNiche === niche.id as NicheType
                    ? 'bg-primary-100 text-white'
                    : 'bg-white border border-gray-200 hover:border-primary-100'
                }`}
                onClick={() => setSelectedNiche(niche.id as NicheType)}
              >
                {niche.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-100 mb-2">
            AI Suggestions Based on Your Niche
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {trendingTopics[selectedNiche].map((topic) => (
              <button
                key={topic.id}
                className="px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary-100 text-left transition-all"
                onClick={() => handleSelectTopic(topic.title)}
              >
                <p className="text-sm font-medium">{topic.title}</p>
                <p className="text-xs text-text-200 mt-1">Trending in {niches.find(n => n.id === selectedNiche)?.label}</p>
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
            placeholder="Describe what you want to post about (e.g., company culture, open positions, industry insights)"
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors ${
              showSchedule 
                ? 'bg-accent-100 text-white border-accent-100' 
                : 'bg-white border-gray-200 hover:border-accent-100'
            }`}
          >
            <Clock size={18} />
            <span>Schedule Post</span>
          </button>
          
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
                <span>{showSchedule ? 'Schedule Content' : 'Generate Content'}</span>
              </>
            )}
          </button>
        </div>
        
        {showSchedule && (
          <div className="mt-6 p-4 bg-bg-200 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-100 mb-2">
                  Select Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200 bg-white"
                    >
                      <span>{date ? format(date, 'PPP') : 'Select a date'}</span>
                      <CalendarIcon size={18} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-100 mb-2">
                  Select Time
                </label>
                <select 
                  value={time}
                  onChange={(e) => selectTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  {Array.from({ length: 24 }).map((_, hour) => {
                    const h = hour % 12 === 0 ? 12 : hour % 12;
                    const ampm = hour < 12 ? 'AM' : 'PM';
                    return [
                      <option key={`${hour}:00`} value={`${h}:00 ${ampm}`}>{`${h}:00 ${ampm}`}</option>,
                      <option key={`${hour}:30`} value={`${h}:30 ${ampm}`}>{`${h}:30 ${ampm}`}</option>
                    ];
                  }).flat()}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {generatedContent && !showSuccessDialog && (
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
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Content Generated Successfully</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Your LinkedIn post has been generated and is ready to be shared.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
            <Button 
              variant="default" 
              className="bg-primary-100 hover:bg-primary-100/90"
              onClick={() => {
                window.open('https://linkedin.com/feed', '_blank');
                setShowSuccessDialog(false);
              }}
            >
              <Send className="mr-2 h-4 w-4" />
              View on LinkedIn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildProfile;
