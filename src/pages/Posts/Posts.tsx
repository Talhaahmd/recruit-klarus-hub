
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Filter, X, Edit, ChevronLeft, ChevronRight, Copy, Sparkles, Target, Users, Plus } from 'lucide-react';
import { Button } from '@/components/UI/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/UI/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import { Textarea } from '@/components/UI/textarea';
import { DraggableCardContainer, DraggableCardBody } from '@/components/UI/draggable-card';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import { useThemes } from '@/hooks/useThemes';
import { useToast } from '@/hooks/use-toast';

const Posts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [additionalContent, setAdditionalContent] = useState('');
  const [showAdditionalContent, setShowAdditionalContent] = useState(false);

  const { ideas, fetchUserIdeas, generatePost, copyIdeaToClipboard, loading, generateIdeasForAllThemes } = useContentGeneration();
  const { userThemes, loading: themesLoading } = useThemes();
  const { toast } = useToast();

  // Get unique themes and categories from user's themes
  const availableThemes = userThemes.map(ut => ut.theme.title);
  const availableCategories = [...new Set(ideas.map(idea => idea.category).filter(Boolean))];

  // Filter ideas based on selected filters
  const filteredIdeas = ideas.filter(idea => {
    const themeMatch = selectedThemes.length === 0 || 
      userThemes.some(ut => selectedThemes.includes(ut.theme.title) && ut.theme_id === idea.theme_id);
    const categoryMatch = selectedCategories.length === 0 || 
      selectedCategories.includes(idea.category);
    return themeMatch && categoryMatch;
  });

  const currentIdea = filteredIdeas[currentIndex];

  useEffect(() => {
    fetchUserIdeas();
  }, []);

  useEffect(() => {
    if (currentIdea) {
      setEditedTitle(currentIdea.title);
      setAdditionalContent('');
      setEditMode(false);
      setShowAdditionalContent(false);
    }
  }, [currentIdea]);

  const handleThemeFilter = (theme: string, checked: boolean) => {
    const newSelectedThemes = checked 
      ? [...selectedThemes, theme]
      : selectedThemes.filter(t => t !== theme);
    
    setSelectedThemes(newSelectedThemes);
    setCurrentIndex(0);
  };

  const handleCategoryFilter = (category: string, checked: boolean) => {
    const newSelectedCategories = checked 
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newSelectedCategories);
    setCurrentIndex(0);
  };

  const clearAllFilters = () => {
    setSelectedThemes([]);
    setSelectedCategories([]);
    setCurrentIndex(0);
  };

  const nextIdea = () => {
    if (currentIndex < filteredIdeas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevIdea = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDismissIdea = () => {
    const newFilteredIdeas = filteredIdeas.filter((_, index) => index !== currentIndex);
    if (newFilteredIdeas.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= newFilteredIdeas.length) {
      setCurrentIndex(newFilteredIdeas.length - 1);
    }
    toast({
      title: "Idea dismissed",
      description: "The idea has been removed from your list",
    });
  };

  const handleGeneratePost = async () => {
    if (!currentIdea) return;

    const userTheme = userThemes.find(ut => ut.theme_id === currentIdea.theme_id);
    if (!userTheme) return;

    const post = await generatePost(
      currentIdea.theme_id,
      additionalContent || undefined,
      userTheme.customization
    );

    if (post) {
      toast({
        title: "Post generated",
        description: "Your post has been generated successfully",
      });
    }
  };

  const handleCopyTitle = async () => {
    if (!currentIdea) return;
    
    try {
      await navigator.clipboard.writeText(editMode ? editedTitle : currentIdea.title);
      toast({
        title: "Title copied",
        description: "The title has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy title to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = () => {
    setEditMode(false);
  };

  const handleGenerateIdeas = async () => {
    await generateIdeasForAllThemes();
    toast({
      title: "Ideas generated",
      description: "New post ideas have been generated for all your themes",
    });
  };

  if (loading || themesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your post ideas...</p>
        </div>
      </div>
    );
  }

  if (!currentIdea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-6 lg:p-8">
          <Header 
            title="Post Ideas"
            subtitle="AI-generated LinkedIn post ideas based on your selected themes"
          />

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Content Ideas
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                No Post Ideas Available
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Generate fresh post ideas from your themes to start creating engaging LinkedIn content
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleGenerateIdeas} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Ideas
                </Button>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{userThemes.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Ideas Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{ideas.length}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedThemes.length + selectedCategories.length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentTheme = userThemes.find(ut => ut.theme_id === currentIdea.theme_id)?.theme;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 lg:p-8">
        <Header 
          title="Post Ideas"
          subtitle="AI-generated LinkedIn post ideas based on your selected themes"
        />

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Content Ideas
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Turn Ideas Into Engaging Posts
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover personalized post ideas crafted from your themes and transform them into compelling LinkedIn content
            </p>
          </div>

          {/* Filter and Generate Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Ideas ({selectedThemes.length + selectedCategories.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-white border shadow-lg">
                  <DropdownMenuLabel>Theme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={selectedThemes.length === 0}
                    onCheckedChange={() => clearAllFilters()}
                  >
                    All Themes
                  </DropdownMenuCheckboxItem>
                  {availableThemes.map((theme) => (
                    <DropdownMenuCheckboxItem
                      key={theme}
                      checked={selectedThemes.includes(theme)}
                      onCheckedChange={(checked) => handleThemeFilter(theme, checked)}
                    >
                      {theme}
                    </DropdownMenuCheckboxItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={selectedCategories.length === 0}
                    onCheckedChange={() => clearAllFilters()}
                  >
                    All Categories
                  </DropdownMenuCheckboxItem>
                  {availableCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryFilter(category, checked)}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-4">
                <Button onClick={handleGenerateIdeas} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New Ideas
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Post Credits:</span>
                  <div className="w-12 h-2 bg-blue-600 rounded"></div>
                  <span>1/3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex items-center justify-center min-h-[600px] relative">
            <DraggableCardContainer>
              <DraggableCardBody className="w-96 bg-white shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {currentTheme?.title || 'Unknown Theme'}
                    </Badge>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditMode(!editMode)}
                      >
                        <Edit className="h-4 w-4" />
                        {editMode ? 'Cancel' : 'Edit'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCopyTitle}
                      >
                        <Copy className="h-4 w-4" />
                        Copy Title
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="text-center space-y-6">
                  {editMode ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-center"
                        rows={3}
                      />
                      <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                      {editedTitle}
                    </h2>
                  )}
                  
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => setShowAdditionalContent(!showAdditionalContent)}
                    >
                      {showAdditionalContent ? 'Hide additional context' : 'Add additional context'}
                    </Button>
                    
                    {showAdditionalContent && (
                      <Textarea
                        placeholder="Add any additional context or specific points you'd like to include in the post..."
                        value={additionalContent}
                        onChange={(e) => setAdditionalContent(e.target.value)}
                        rows={3}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleDismissIdea}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Dismiss Idea
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleGeneratePost}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Generate Post'}
                    </Button>
                  </div>
                </CardContent>
              </DraggableCardBody>
            </DraggableCardContainer>

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-8 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-50"
              onClick={prevIdea}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="absolute right-8 top-1/2 transform -translate-y-1/2 h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-50"
              onClick={nextIdea}
              disabled={currentIndex === filteredIdeas.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Bottom Status */}
          <div className="text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                <span className="font-medium">Ideas {currentIndex + 1} of {filteredIdeas.length}</span>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, filteredIdeas.length) }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentIndex % 5 ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{Math.round(((currentIndex + 1) / filteredIdeas.length) * 100)}% Complete</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / filteredIdeas.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
