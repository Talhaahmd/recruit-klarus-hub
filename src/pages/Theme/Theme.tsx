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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const count = getCategoryCount(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`theme-card-liquid ripple p-4 transition-all duration-200 text-left ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50/80 shadow-md'
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
                        {count}
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
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Theme
              </Button>
            </div>
          </div>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme) => (
              <div key={theme.id} className="theme-glow group">
                <div className="theme-card-liquid p-6 h-full flex flex-col">
                  {/* Enhanced Header with Floating Elements */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={`border-2 px-3 py-1 text-xs font-semibold ${getComplexityColor(theme.complexity || 'Beginner')} float-animation`}>
                          {theme.complexity || 'Beginner'}
                        </Badge>
                        <Badge variant="secondary" className="px-3 py-1 text-xs font-medium bg-gray-100/80 text-gray-700 border-gray-200/50 backdrop-blur-sm float-animation-delayed">
                          {theme.category}
                        </Badge>
                      </div>

                      <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 leading-tight mb-4">
                        {theme.title}
                      </CardTitle>
                    </div>
                  </div>

                  {/* Enhanced Content Layout */}
                  <div className="flex-1 space-y-6">
                    {/* Description with better typography */}
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed text-base font-medium">
                        {theme.description}
                      </p>
                    </div>

                    {/* Enhanced Information Sections */}
                    <div className="space-y-4">
                      {/* Target Audience */}
                      <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/30">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100/50 rounded-lg">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">Target Audience</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">{theme.audience}</p>
                          </div>
                        </div>
                      </div>

                      {/* Objectives */}
                      {theme.objectives && theme.objectives.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-4 border border-green-100/30">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100/50 rounded-lg">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-green-900 mb-1">Objective</h4>
                              <p className="text-sm text-green-700 leading-relaxed">{theme.objectives[0]}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Results Section */}
                    {theme.results && (
                      <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-4 border border-purple-100/30">
                        <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Expected Results
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-white/50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">{theme.results.revenue}</div>
                            <div className="text-xs text-gray-600 font-medium">Revenue</div>
                          </div>
                          <div className="text-center p-2 bg-white/50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">{theme.results.cac}</div>
                            <div className="text-xs text-gray-600 font-medium">CAC</div>
                          </div>
                          <div className="text-center p-2 bg-white/50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">{theme.results.churn}</div>
                            <div className="text-xs text-gray-600 font-medium">Churn</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Interactive Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200/30">
                    <Button
                      onClick={() => handlePreview(theme)}
                      className="w-full ripple bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
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
