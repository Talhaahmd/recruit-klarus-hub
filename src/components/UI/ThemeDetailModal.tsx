import React, { useState } from 'react';
import { X, Check, FileText, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/UI/dropdown-menu';
import { Theme } from '@/hooks/useThemes';

interface ThemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme | null;
  onAddTheme: (themeId: string, customization?: any) => Promise<boolean>;
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

interface AspectSectionProps {
  title: string;
  explanation: string;
  options: string[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  disabled?: boolean;
}

const AspectSection: React.FC<AspectSectionProps> = ({
  title,
  explanation,
  options,
  selectedOptions,
  onToggleOption,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 w-6 p-0"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 leading-relaxed">{explanation}</p>
      
      {isExpanded && !disabled && (
        <div className="pt-2 border-t border-gray-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between" size="sm">
                <span className="truncate">
                  {selectedOptions.length > 0 
                    ? `${selectedOptions.length} selected` 
                    : `Customize ${title.toLowerCase()}`
                  }
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel>Select {title}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {options.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onToggleOption(option)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{option}</span>
                  {selectedOptions.includes(option) && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

const ThemeDetailModal: React.FC<ThemeDetailModalProps> = ({
  isOpen,
  onClose,
  theme,
  onAddTheme
}) => {
  const [selectedBackground, setSelectedBackground] = useState<string[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>([]);
  const [selectedMainTopic, setSelectedMainTopic] = useState<string[]>([]);
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string[]>([]);
  const [selectedComplexity, setSelectedComplexity] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  if (!theme) return null;

  const handleToggleOption = (category: string, option: string) => {
    if (!theme.is_custom) return;

    const setters = {
      background: setSelectedBackground,
      purpose: setSelectedPurpose,
      mainTopic: setSelectedMainTopic,
      targetAudience: setSelectedTargetAudience,
      complexity: setSelectedComplexity
    };

    const getters = {
      background: selectedBackground,
      purpose: selectedPurpose,
      mainTopic: selectedMainTopic,
      targetAudience: selectedTargetAudience,
      complexity: selectedComplexity
    };

    const currentSelected = getters[category as keyof typeof getters];
    const setter = setters[category as keyof typeof setters];

    if (currentSelected.includes(option)) {
      setter(currentSelected.filter(item => item !== option));
    } else {
      setter([...currentSelected, option]);
    }
  };

  const handleAddTheme = async () => {
    setIsAdding(true);
    
    const customization = theme.is_custom ? {
      background: selectedBackground,
      purpose: selectedPurpose,
      mainTopic: selectedMainTopic,
      targetAudience: selectedTargetAudience,
      complexity: selectedComplexity,
    } : undefined;

    const success = await onAddTheme(theme.id, customization);
    
    if (success) {
      onClose();
      // Reset selections
      setSelectedBackground([]);
      setSelectedPurpose([]);
      setSelectedMainTopic([]);
      setSelectedTargetAudience([]);
      setSelectedComplexity([]);
    }
    
    setIsAdding(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software Engineers':
        return 'from-blue-500 to-purple-600';
      case 'SaaS Founders':
        return 'from-green-500 to-emerald-600';
      case 'Marketing Leaders':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const samplePosts = theme.sample_posts || [];
  const currentPost = samplePosts[currentPostIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold text-gray-900">{theme.title}</DialogTitle>
              <div className={`h-1 w-24 bg-gradient-to-r ${getCategoryColor(theme.category)} rounded-full`} />
            </div>
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
              {theme.category}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Overview Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Theme Overview</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Description</h4>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </div>
                  {theme.objectives && theme.objectives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Objectives</h4>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {theme.objectives.map((obj, index) => (
                          <li key={index} className="text-sm text-gray-600">{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {theme.audience && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Target Audience</h4>
                      <p className="text-sm text-gray-600">{theme.audience}</p>
                    </div>
                  )}
                  {theme.complexity && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Complexity Level</h4>
                      <p className="text-sm text-gray-600">{theme.complexity}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Removed Theme Aspects Column entirely */}

            {/* What type of posts to expect / Sample Posts Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <FileText className="h-5 w-5 text-blue-600" />
                What type of posts to expect
              </h3>

              {/* LinkedIn-style post preview */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start space-x-3">
                  {/* Circular image placeholder */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                  
                  {/* Post content area */}
                  <div className="flex-1">
                    {currentPost ? (
                      <div className="prose prose-sm max-w-none text-gray-700 min-h-[150px] p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 overflow-y-auto max-h-80" style={{ whiteSpace: 'pre-line' }}>
                        {currentPost} 
                      </div>
                    ) : (
                      <div className="min-h-[150px] p-3 border border-gray-300 rounded-md flex items-center justify-center text-gray-400">
                        <p>Sample post content will appear here.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination for multiple sample posts (if any) */}
              {samplePosts.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-sm text-gray-500">({currentPostIndex + 1}/{samplePosts.length})</span>
                  <div className="flex gap-1">
                    {samplePosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPostIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentPostIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to sample post ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons - Moved here */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                  Not right for me
                </Button>
                <Button 
                  onClick={handleAddTheme}
                  disabled={isAdding}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isAdding ? 'Adding...' : '+ Add to My Themes'}
                </Button>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDetailModal;
