
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Eye, Plus, Target, Users, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import ThemeDetailModal from '@/components/UI/ThemeDetailModal';

interface Theme {
  id: string;
  title: string;
  category: string;
  description: string;
  audience: string;
  objectives: string[];
  postTypes: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  results: {
    revenue: string;
    cac: string;
    churn: string;
  };
  details: {
    background: string;
    purpose: string;
    mainTopic: string;
    targetAudience: string;
    complexityLevel: string;
  };
}

const themes: Theme[] = [
  {
    id: '1',
    title: '10x or Die Trying',
    category: 'Software Engineers',
    description: 'Master organizational dynamics',
    audience: 'Build exponential career moats',
    objectives: ['10x impact without burning out'],
    postTypes: ['Master organizational dynamics', 'Build exponential career moats', '10x impact without burning out'],
    complexity: 'Advanced',
    results: {
      revenue: '+427%',
      cac: '-65%',
      churn: '-83%'
    },
    details: {
      background: 'High-performance software engineering strategies',
      purpose: 'Help engineers achieve exponential growth',
      mainTopic: 'Career acceleration and technical excellence',
      targetAudience: 'Ambitious software engineers',
      complexityLevel: 'Advanced - requires deep technical knowledge'
    }
  },
  {
    id: '2',
    title: 'Legacy Code Rebel',
    category: 'Software Engineers',
    description: 'Master legacy system politics',
    audience: 'Turn maintenance into promotion',
    objectives: ['Build power through constraints'],
    postTypes: ['Master legacy system politics', 'Turn maintenance into promotion', 'Build power through constraints'],
    complexity: 'Intermediate',
    results: {
      revenue: '+385%',
      cac: '-72%',
      churn: '-68%'
    },
    details: {
      background: 'Legacy system modernization strategies',
      purpose: 'Transform legacy work into career opportunities',
      mainTopic: 'Legacy code management and career growth',
      targetAudience: 'Software engineers working with legacy systems',
      complexityLevel: 'Intermediate - some experience required'
    }
  },
  {
    id: '3',
    title: 'Code Under Chaos',
    category: 'Software Engineers',
    description: 'Master high-stakes engineering',
    audience: 'Turn chaos into leverage',
    objectives: ['Scale through crisis'],
    postTypes: ['Master high-stakes engineering', 'Turn chaos into leverage', 'Scale through crisis'],
    complexity: 'Advanced',
    results: {
      revenue: '+512%',
      cac: '-58%',
      churn: '-91%'
    },
    details: {
      background: 'Crisis management in software development',
      purpose: 'Excel in high-pressure engineering environments',
      mainTopic: 'Crisis management and technical leadership',
      targetAudience: 'Senior engineers and tech leads',
      complexityLevel: 'Advanced - leadership experience needed'
    }
  },
  {
    id: '4',
    title: 'Profit Over Hype',
    category: 'SaaS Founders',
    description: 'Master profitable SaaS growth',
    audience: 'Build wealth without VC',
    objectives: ['Scale through real revenue'],
    postTypes: ['Master profitable SaaS growth', 'Build wealth without VC', 'Scale through real revenue'],
    complexity: 'Advanced',
    results: {
      revenue: '+627%',
      cac: '-45%',
      churn: '-76%'
    },
    details: {
      background: 'Sustainable SaaS business models',
      purpose: 'Build profitable companies without external funding',
      mainTopic: 'Bootstrapped SaaS growth strategies',
      targetAudience: 'SaaS founders and entrepreneurs',
      complexityLevel: 'Advanced - business experience required'
    }
  },
  {
    id: '5',
    title: 'Pricing Psychology',
    category: 'SaaS Founders',
    description: 'Master pricing psychology',
    audience: 'Maximize revenue ethically',
    objectives: ['Win through strategic pricing'],
    postTypes: ['Master pricing psychology', 'Maximize revenue ethically', 'Win through strategic pricing'],
    complexity: 'Intermediate',
    results: {
      revenue: '+394%',
      cac: '-52%',
      churn: '-64%'
    },
    details: {
      background: 'Psychological pricing strategies',
      purpose: 'Optimize pricing for maximum revenue',
      mainTopic: 'Pricing psychology and revenue optimization',
      targetAudience: 'SaaS founders and product managers',
      complexityLevel: 'Intermediate - basic business knowledge needed'
    }
  },
  {
    id: '6',
    title: 'Break The Algorithm',
    category: 'Marketing Leaders',
    description: 'Decode & exploit social algorithms',
    audience: 'Engineer systematic virality',
    objectives: ['Scale growth without ads'],
    postTypes: ['Decode & exploit social algorithms', 'Engineer systematic virality', 'Scale growth without ads'],
    complexity: 'Advanced',
    results: {
      revenue: '+445%',
      cac: '-78%',
      churn: '-82%'
    },
    details: {
      background: 'Social media algorithm optimization',
      purpose: 'Master organic social media growth',
      mainTopic: 'Algorithm hacking and viral content',
      targetAudience: 'Marketing leaders and content creators',
      complexityLevel: 'Advanced - deep marketing experience required'
    }
  }
];

const categories = [
  { id: 'all', name: 'All', icon: Plus },
  { id: 'my-themes', name: 'My Themes', icon: Users },
  { id: 'drafts', name: 'Drafts', icon: Eye },
  { id: 'software-engineers', name: 'Software Engineers', icon: Zap },
  { id: 'saas-founders', name: 'SaaS Founders', icon: TrendingUp },
  { id: 'marketing-leaders', name: 'Marketing Leaders', icon: Target },
  { id: 'product-leaders', name: 'Product Leaders', icon: Target },
  { id: 'msp-support', name: 'MSP Support Professionals', icon: Users },
  { id: 'msp-sales', name: 'MSP Sales Professionals', icon: TrendingUp },
  { id: 'sales-professionals', name: 'Sales Professionals', icon: TrendingUp }
];

const Theme: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => 
        theme.category.toLowerCase().replace(' ', '-') === selectedCategory
      );

  const handlePreview = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsDetailModalOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software Engineers':
        return 'bg-yellow-100 text-yellow-800';
      case 'SaaS Founders':
        return 'bg-yellow-100 text-yellow-800';
      case 'Marketing Leaders':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <Header 
        title="Content Themes"
        subtitle="Discover and create themes for your LinkedIn content strategy"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Create Your Own Theme */}
        <div className="lg:w-80 flex-shrink-0">
          <Card className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <CardTitle className="text-lg mb-2">Create Your Own Theme</CardTitle>
            <CardDescription className="text-sm text-gray-600 mb-4">
              Not seeing what fits? Start from scratch - your audience, your tone, your goals.
            </CardDescription>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Create Theme
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1 h-auto p-1 bg-gray-100">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs px-2 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredThemes.map((theme) => (
                  <Card key={theme.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-semibold text-blue-600">
                          {theme.title}
                        </CardTitle>
                      </div>
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(theme.category)}`}>
                        {theme.category}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="h-4 w-4 mr-2" />
                          {theme.description}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {theme.audience}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Zap className="h-4 w-4 mr-2" />
                          {theme.objectives[0]}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => handlePreview(theme)}
                        >
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Theme Detail Modal */}
      <ThemeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        theme={selectedTheme}
      />
    </div>
  );
};

export default Theme;
