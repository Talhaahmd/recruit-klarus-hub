import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Eye, Plus, Target, Users, Zap, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import ThemeDetailModal from '@/components/UI/ThemeDetailModal';
import CreateThemeModal from '@/components/UI/CreateThemeModal';
import { useThemes, type Theme as ThemeType } from '@/hooks/useThemes';

const categories = [
  { id: 'all', name: 'All Themes', icon: Sparkles },
  { id: 'my-themes', name: 'My Themes', icon: Users },
  { id: 'software-engineers', name: 'Software Engineers', icon: Zap },
  { id: 'saas-founders', name: 'SaaS Founders', icon: TrendingUp },
  { id: 'marketing-leaders', name: 'Marketing Leaders', icon: Target },
];

const ThemePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { 
    themes, 
    userThemes, 
    loading, 
    addThemeToUser, 
  } = useThemes();

  const getFilteredThemes = () => {
    if (selectedCategory === 'all') return themes;
    if (selectedCategory === 'my-themes') return userThemes.map(ut => ut.theme);
    
    return themes.filter(theme => 
      theme.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
    );
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return themes.length;
    if (categoryId === 'my-themes') return userThemes.length;
    
    return themes.filter(theme => 
      theme.category.toLowerCase().replace(/\s+/g, '-') === categoryId
    ).length;
  };

  const handlePreview = (theme: ThemeType) => {
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

  const filteredThemes = getFilteredThemes();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading themes...</p>
        </div>
      </div>
    );
  }

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
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100/80 p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const count = getCategoryCount(category.id);
                const isSelected = selectedCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`theme-card-liquid ripple p-4 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border border-blue-200 shadow-md'
                        : 'border border-transparent hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-md ${isSelected ? 'bg-blue-100/80' : 'bg-gray-100/80'}`}>
                        <IconComponent className={`h-4 w-4 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-blue-100/90 text-blue-700' 
                          : 'bg-gray-100/80 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </div>
                    <h3 className={`text-sm font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-800'
                    }`}>
                      {category.name}
                    </h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Create Custom Theme */}
          <div className="theme-card-liquid overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-indigo-500/90 to-purple-600/90 p-6 lg:p-8 text-white relative">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium mb-4">
                  <Plus className="h-3.5 w-3.5" />
                  Custom Creation
                </div>
                <h2 className="text-2xl font-bold mb-3">Create Your Unique Theme</h2>
                <p className="text-indigo-100/90 mb-6 leading-relaxed">
                  Not finding the perfect fit? Design a custom theme tailored to your industry, audience, and goals.
                </p>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium shadow-lg shadow-indigo-600/20 ripple"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Theme
                </Button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            </div>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="theme-glow group">
                <div className="theme-card-liquid p-0 h-full flex flex-col overflow-hidden">
                  {/* Professional header with accent line and category badge */}
                  <div className="relative">
                    {/* Top accent line with gradient based on category */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${getCategoryGradient(theme.category)}`}></div>
                    
                    {/* Header content with improved spacing */}
                    <div className="px-6 pt-5 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={`border px-3 py-1 text-xs font-medium ${getComplexityColor(theme.complexity || 'Beginner')} float-animation`}>
                          {theme.complexity || 'Beginner'}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1 text-xs font-medium bg-gray-100/90 text-gray-700 border-gray-200/50 backdrop-blur-sm">
                          {theme.category}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight mt-3 mb-1">
                        {theme.title}
                      </CardTitle>
                    </div>
                  </div>
                  
                  {/* Main content with improved visual separation */}
                  <div className="px-6 py-4 flex-1 space-y-5 border-t border-gray-100/30">
                    {/* Description with professional typography */}
                    <p className="text-gray-700 leading-relaxed text-base">
                      {theme.description}
                    </p>

                    {/* Professional information sections with consistent design */}
                    <div className="space-y-4">
                      {/* Target Audience - more professional styling */}
                      <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-lg p-3.5 border border-blue-100/40 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 bg-blue-100/80 rounded-md flex items-center justify-center">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-0.5">Target Audience</h4>
                            <p className="text-sm text-blue-800/80 leading-relaxed">{theme.audience}</p>
                          </div>
                        </div>
                      </div>

                      {/* Objectives - matching professional style */}
                      {theme.objectives && theme.objectives.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50/70 to-emerald-50/70 rounded-lg p-3.5 border border-green-100/40 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-green-100/80 rounded-md flex items-center justify-center">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-green-900 mb-0.5">Objective</h4>
                              <p className="text-sm text-green-800/80 leading-relaxed">{theme.objectives[0]}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Results - professional metrics display */}
                      {theme.results && (
                        <div className="bg-gradient-to-r from-purple-50/70 to-pink-50/70 rounded-lg p-3.5 border border-purple-100/40 shadow-sm">
                          <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <div className="p-1 bg-purple-100/80 rounded-md flex items-center justify-center">
                              <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                            </div>
                            <span>Expected Results</span>
                          </h4>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="text-center p-2 bg-white/70 rounded-md shadow-sm">
                              <div className="text-base font-bold text-green-600">{theme.results.revenue}</div>
                              <div className="text-xs text-gray-600 font-medium">Revenue</div>
                            </div>
                            <div className="text-center p-2 bg-white/70 rounded-md shadow-sm">
                              <div className="text-base font-bold text-blue-600">{theme.results.cac}</div>
                              <div className="text-xs text-gray-600 font-medium">CAC</div>
                            </div>
                            <div className="text-center p-2 bg-white/70 rounded-md shadow-sm">
                              <div className="text-base font-bold text-purple-600">{theme.results.churn}</div>
                              <div className="text-xs text-gray-600 font-medium">Churn</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional footer with improved button */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/40">
                    <Button
                      onClick={() => handlePreview(theme)}
                      className="w-full ripple bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 group-hover:shadow-md"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Preview Theme</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
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

        {/* Modals */}
        <ThemeDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          theme={selectedTheme}
          onAddTheme={addThemeToUser}
        />

        <CreateThemeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ThemePage;
