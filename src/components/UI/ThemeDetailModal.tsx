import React, { useState } from 'react';
import { X, Check, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/UI/accordion';
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

interface OptionsSectionProps {
  title: string;
  description: string;
  options: string[];
  selectedOptions: string[];
  onToggleOption: (option: string) => void;
}

const OptionsSection: React.FC<OptionsSectionProps> = ({
  title,
  description,
  options,
  selectedOptions,
  onToggleOption
}) => {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggleOption(option)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              selectedOptions.includes(option)
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

  if (!theme) return null;

  const handleToggleOption = (category: string, option: string) => {
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
    
    const customization = {
      background: selectedBackground,
      purpose: selectedPurpose,
      mainTopic: selectedMainTopic,
      targetAudience: selectedTargetAudience,
      complexity: selectedComplexity,
    };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-blue-700">
              <Check className="h-5 w-5" />
              <span className="font-medium">You'll be able to customize every aspect after adding to your collection</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Customization Options */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Customize Every Aspect</h3>
                
                <Accordion type="multiple" className="space-y-4">
                  <AccordionItem value="background" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">1</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Background & Offering</div>
                          <div className="text-sm text-gray-500">What's the context of your post?</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <OptionsSection
                        title="Background"
                        description="What's the context of your post?"
                        options={backgroundOptions}
                        selectedOptions={selectedBackground}
                        onToggleOption={(option) => handleToggleOption('background', option)}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="purpose" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">2</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Purpose</div>
                          <div className="text-sm text-gray-500">What do you want to achieve with this post?</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <OptionsSection
                        title="Purpose"
                        description="What do you want to achieve with this post?"
                        options={purposeOptions}
                        selectedOptions={selectedPurpose}
                        onToggleOption={(option) => handleToggleOption('purpose', option)}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="main-topic" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Main Topic</div>
                          <div className="text-sm text-gray-500">What is the central theme of your post?</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <OptionsSection
                        title="Main Topic"
                        description="What is the central theme of your post?"
                        options={mainTopicOptions}
                        selectedOptions={selectedMainTopic}
                        onToggleOption={(option) => handleToggleOption('mainTopic', option)}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="target-audience" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 text-sm">👥</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Target Audience</div>
                          <div className="text-sm text-gray-500">Who are you trying to reach?</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <OptionsSection
                        title="Target Audience"
                        description="Who are you trying to reach?"
                        options={targetAudienceOptions}
                        selectedOptions={selectedTargetAudience}
                        onToggleOption={(option) => handleToggleOption('targetAudience', option)}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="complexity" className="border border-gray-200 rounded-lg">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-sm">⚡</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">Complexity Level</div>
                          <div className="text-sm text-gray-500">How technical or detailed is the content?</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <OptionsSection
                        title="Complexity Level"
                        description="How technical or detailed is the content?"
                        options={complexityOptions}
                        selectedOptions={selectedComplexity}
                        onToggleOption={(option) => handleToggleOption('complexity', option)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* Right Column - Post Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  What type of posts to expect
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>(1/3)</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg shadow-sm">
                <p className="text-red-700 text-sm font-semibold mb-3">
                  📈 VCs hate this pricing strategy.
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Just helped a SaaS founder 5x revenue in 60 days.<br />
                  No marketing budget.<br />
                  No growth hacks.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Just one controversial change:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-white/60 p-3 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Old way (broke):</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Freemium tier</p>
                      <p>• $29/mo basic</p>
                      <p>• $99/mo premium</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 p-3 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">New way (money):</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• $199/mo minimum</p>
                      <p>• 14-day free trial</p>
                      <p>• No freemium</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 p-3 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Results:</p>
                    <div className="text-sm space-y-1">
                      <p>• Revenue: <span className="text-green-600 font-semibold">+427%</span></p>
                      <p>• CAC: <span className="text-green-600 font-semibold">-65%</span></p>
                      <p>• Churn: <span className="text-green-600 font-semibold">-83%</span></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDetailModal;
