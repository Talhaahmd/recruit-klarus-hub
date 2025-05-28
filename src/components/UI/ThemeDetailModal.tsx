
import React, { useState } from 'react';
import { X, Check, FileText, ChevronRight, ChevronDown } from 'lucide-react';
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

interface AspectDropdownProps {
  title: string;
  options: string[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
  disabled?: boolean;
}

const AspectDropdown: React.FC<AspectDropdownProps> = ({
  title,
  options,
  selectedOptions,
  onToggleOption,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{title}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">
              {selectedOptions.length > 0 
                ? `${selectedOptions.length} selected` 
                : `Select ${title.toLowerCase()}`
              }
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80">
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
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
    // Only allow customization for custom themes that haven't been added yet
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

  // Parse theme details for display
  const themeQualities = theme.details ? [
    theme.details.background,
    theme.details.purpose,
    theme.details.mainTopic,
    theme.details.targetAudience,
    theme.details.complexityLevel
  ].filter(Boolean) : [];

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Theme Qualities */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Theme Qualities</h3>
                
                <div className="space-y-4">
                  {themeQualities.map((quality, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <div className="text-gray-900 font-medium">{quality}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {theme.description && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Description</h4>
                    <p className="text-blue-700">{theme.description}</p>
                  </div>
                )}

                {theme.objectives && theme.objectives.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Objectives</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      {theme.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column - Aspects Dropdown */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Customize Aspects</h3>
              
              <div className="space-y-4">
                <AspectDropdown
                  title="Background & Offering"
                  options={backgroundOptions}
                  selectedOptions={selectedBackground}
                  onToggleOption={(option) => handleToggleOption('background', option)}
                  disabled={!theme.is_custom}
                />

                <AspectDropdown
                  title="Purpose"
                  options={purposeOptions}
                  selectedOptions={selectedPurpose}
                  onToggleOption={(option) => handleToggleOption('purpose', option)}
                  disabled={!theme.is_custom}
                />

                <AspectDropdown
                  title="Main Topic"
                  options={mainTopicOptions}
                  selectedOptions={selectedMainTopic}
                  onToggleOption={(option) => handleToggleOption('mainTopic', option)}
                  disabled={!theme.is_custom}
                />

                <AspectDropdown
                  title="Target Audience"
                  options={targetAudienceOptions}
                  selectedOptions={selectedTargetAudience}
                  onToggleOption={(option) => handleToggleOption('targetAudience', option)}
                  disabled={!theme.is_custom}
                />

                <AspectDropdown
                  title="Complexity Level"
                  options={complexityOptions}
                  selectedOptions={selectedComplexity}
                  onToggleOption={(option) => handleToggleOption('complexity', option)}
                  disabled={!theme.is_custom}
                />
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="w-full">
                  Not right for me
                </Button>
                <Button 
                  onClick={handleAddTheme}
                  disabled={isAdding}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isAdding ? 'Adding...' : '+ Add to My Themes'}
                </Button>
              </div>
            </div>

            {/* Right Column - Post Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  What type of posts to expect
                </h3>
                {samplePosts.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">({currentPostIndex + 1}/{samplePosts.length})</span>
                    <div className="flex gap-1">
                      {samplePosts.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPostIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentPostIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {currentPost ? (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm max-h-96 overflow-y-auto">
                  <div className="prose prose-sm text-gray-700">
                    {currentPost.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">Sample posts will be generated for custom themes</p>
                </div>
              )}

              {samplePosts.length > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPostIndex(Math.max(0, currentPostIndex - 1))}
                    disabled={currentPostIndex === 0}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                    Previous
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPostIndex(Math.min(samplePosts.length - 1, currentPostIndex + 1))}
                    disabled={currentPostIndex === samplePosts.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDetailModal;
