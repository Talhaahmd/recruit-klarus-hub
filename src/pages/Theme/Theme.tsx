
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Eye, Plus, Target, Users, Zap, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
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
  { id: 'all', name: 'All Themes', icon: Sparkles, count: themes.length },
  { id: 'my-themes', name: 'My Themes', icon: Users, count: 0 },
  { id: 'software-engineers', name: 'Software Engineers', icon: Zap, count: 3 },
  { id: 'saas-founders', name: 'SaaS Founders', icon: TrendingUp, count: 2 },
  { id: 'marketing-leaders', name: 'Marketing Leaders', icon: Target, count: 1 },
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

  const getCategoryGradient = (category: string) => {
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 lg:p-8">
        <Header 
          title="Content Themes"
          subtitle="Discover AI-powered themes to supercharge your LinkedIn presence"
        />

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Content Strategy
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your LinkedIn Presence
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from expert-crafted themes designed to boost engagement, build authority, and grow your professional network
            </p>
          </div>

          {/* Category Navigation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className={`h-5 w-5 ${
                        selectedCategory === category.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        selectedCategory === category.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                    <h3 className={`font-medium ${
                      selectedCategory === category.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {category.name}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Custom Theme */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-4">Create Your Unique Theme</h2>
              <p className="text-indigo-100 mb-6">
                Not finding the perfect fit? Design a custom theme tailored to your industry, audience, and goals.
              </p>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Theme
              </Button>
            </div>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map((theme) => (
              <Card key={theme.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className={`h-2 w-full bg-gradient-to-r ${getCategoryGradient(theme.category)} rounded-full mb-4`} />
                  
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {theme.title}
                    </CardTitle>
                    <Badge className={`border ${getComplexityColor(theme.complexity)}`}>
                      {theme.complexity}
                    </Badge>
                  </div>
                  
                  <Badge variant="secondary" className="w-fit bg-gray-100 text-gray-700 border-gray-200">
                    {theme.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{theme.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Target className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Focus:</span>
                      <span className="ml-1">{theme.audience}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">Objective:</span>
                      <span className="ml-1">{theme.objectives[0]}</span>
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Expected Results:</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-green-600">{theme.results.revenue}</div>
                        <div className="text-gray-500">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{theme.results.cac}</div>
                        <div className="text-gray-500">CAC</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{theme.results.churn}</div>
                        <div className="text-gray-500">Churn</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handlePreview(theme)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-700 transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Theme
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredThemes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No themes found</h3>
              <p className="text-gray-600 mb-6">Try selecting a different category or create a custom theme.</p>
              <Button onClick={() => setSelectedCategory('all')} variant="outline">
                View All Themes
              </Button>
            </div>
          )}
        </div>

        {/* Theme Detail Modal */}
        <ThemeDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          theme={selectedTheme}
        />
      </div>
    </div>
  );
};

export default Theme;
