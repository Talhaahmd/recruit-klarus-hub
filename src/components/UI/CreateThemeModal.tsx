
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Textarea } from '@/components/UI/textarea';
import { Label } from '@/components/UI/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';

interface CreateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTheme: (themeData: any) => void;
}

const backgroundOptions = [
  'Launching a New Product',
  'Hiring Announcement', 
  'Company Milestone',
  'Product Update or Feature Release',
  'Event Invitation',
  'Partnership Announcement',
  'Industry Insight or Thought Leadership',
  'Success Story or Case Study'
];

const purposeOptions = [
  'Attract Candidates',
  'Generate Leads',
  'Increase Brand Awareness', 
  'Drive Traffic to Website',
  'Share Insights or Knowledge'
];

const mainTopicOptions = [
  'Careers & Hiring',
  'Innovation & Technology',
  'Company Culture',
  'Product or Service Highlights'
];

const targetAudienceOptions = [
  'Software Engineers',
  'Product Managers',
  'Startup Founders',
  'HR & Recruiters',
  'Designers',
  'Sales & Marketing Professionals',
  'Tech Enthusiasts',
  'Investors'
];

const complexityOptions = [
  'Beginner-Friendly',
  'General Professional',
  'Technical but Accessible',
  'Advanced/Expert-Level'
];

const CreateThemeModal: React.FC<CreateThemeModalProps> = ({
  isOpen,
  onClose,
  onCreateTheme
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    audience: '',
    objectives: [''],
    complexity: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    background: [] as string[],
    purpose: [] as string[],
    mainTopic: [] as string[],
    targetAudience: [] as string[],
    complexityLevel: [] as string[],
    backgroundExplanation: '',
    purposeExplanation: '',
    mainTopicExplanation: '',
    targetAudienceExplanation: '',
    complexityExplanation: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const themeData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      audience: formData.audience,
      objectives: formData.objectives.filter(obj => obj.trim() !== ''),
      post_types: formData.objectives.filter(obj => obj.trim() !== ''),
      complexity: formData.complexity,
      results: {
        revenue: '+0%',
        cac: '0%',
        churn: '0%'
      },
      details: {
        background: formData.background.join(', '),
        purpose: formData.purpose.join(', '),
        mainTopic: formData.mainTopic.join(', '),
        targetAudience: formData.targetAudience.join(', '),
        complexityLevel: formData.complexityLevel.join(', ')
      },
      background_explanation: formData.backgroundExplanation,
      purpose_explanation: formData.purposeExplanation,
      main_topic_explanation: formData.mainTopicExplanation,
      target_audience_explanation: formData.targetAudienceExplanation,
      complexity_explanation: formData.complexityExplanation,
    };

    await onCreateTheme(themeData);
    setLoading(false);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      category: '',
      description: '',
      audience: '',
      objectives: [''],
      complexity: 'Intermediate',
      background: [],
      purpose: [],
      mainTopic: [],
      targetAudience: [],
      complexityLevel: [],
      backgroundExplanation: '',
      purposeExplanation: '',
      mainTopicExplanation: '',
      targetAudienceExplanation: '',
      complexityExplanation: '',
    });
  };

  const toggleOption = (field: string, option: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(option)
        ? (prev[field as keyof typeof prev] as string[]).filter((item: string) => item !== option)
        : [...(prev[field as keyof typeof prev] as string[]), option]
    }));
  };

  const renderOptionsSection = (title: string, field: string, options: string[], explanationField?: string) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{title}</Label>
      {explanationField && (
        <Textarea
          placeholder={`Explain what ${title.toLowerCase()} means for this theme...`}
          value={formData[explanationField as keyof typeof formData] as string}
          onChange={(e) => setFormData(prev => ({ ...prev, [explanationField]: e.target.value }))}
          rows={2}
          className="text-sm"
        />
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggleOption(field, option)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              (formData[field as keyof typeof formData] as string[]).includes(option)
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Custom Theme</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Theme Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter theme title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Software Engineers, Marketing"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the theme"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  value={formData.audience}
                  onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                  placeholder="Who is this theme for?"
                />
              </div>

              <div>
                <Label htmlFor="complexity">Complexity Level</Label>
                <Select value={formData.complexity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, complexity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {renderOptionsSection('Background & Offering', 'background', backgroundOptions, 'backgroundExplanation')}
              {renderOptionsSection('Purpose', 'purpose', purposeOptions, 'purposeExplanation')}
              {renderOptionsSection('Main Topic', 'mainTopic', mainTopicOptions, 'mainTopicExplanation')}
              {renderOptionsSection('Target Audience', 'targetAudience', targetAudienceOptions, 'targetAudienceExplanation')}
              {renderOptionsSection('Complexity Level', 'complexityLevel', complexityOptions, 'complexityExplanation')}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Creating...' : 'Create Theme'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateThemeModal;
