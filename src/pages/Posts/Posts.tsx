
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Filter, X, Edit, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
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
import { Card, CardContent, CardHeader } from '@/components/UI/card';
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

  const { ideas, fetchUserIdeas, generatePost, copyIdeaToClipboard, loading } = useContentGeneration();
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
    // Remove the current idea from the list
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
    // Here you could also update the idea in the database if needed
  };

  if (loading || themesLoading) {
    return (
      <div className="p-4 lg:p-8">
        <Header 
          title="Post Ideas"
          subtitle="AI-generated LinkedIn post ideas based on your selected themes"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">Loading your post ideas...</p>
        </div>
      </div>
    );
  }

  if (!currentIdea) {
    return (
      <div className="p-4 lg:p-8">
        <Header 
          title="Post Ideas"
          subtitle="AI-generated LinkedIn post ideas based on your selected themes"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">No post ideas available. Add some themes to your collection to generate ideas.</p>
          <Button onClick={clearAllFilters} className="mt-4">
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

  const currentTheme = userThemes.find(ut => ut.theme_id === currentIdea.theme_id)?.theme;

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gray-50">
      <Header 
        title="Post Ideas"
        subtitle="AI-generated LinkedIn post ideas based on your selected themes"
      />

      {/* Filter Section */}
      <div className="mb-6 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
              <Filter className="h-4 w-4 mr-2" />
              Filter Ideas
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

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Post Credits:</span>
          <div className="w-12 h-2 bg-blue-600 rounded"></div>
          <span>1/3</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[600px] relative">
        <DraggableCardContainer>
          <DraggableCardBody className="w-96 bg-white shadow-lg">
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
                    Edit
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
                  <Button onClick={handleSaveEdit} size="sm">
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
                  className="text-red-500 hover:text-red-600"
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
          size="sm"
          className="absolute left-8 top-1/2 transform -translate-y-1/2"
          onClick={prevIdea}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-8 top-1/2 transform -translate-y-1/2"
          onClick={nextIdea}
          disabled={currentIndex === filteredIdeas.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Status */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
          <span>Ideas {currentIndex + 1} of {filteredIdeas.length}</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, filteredIdeas.length) }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex % 5 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span>{Math.round(((currentIndex + 1) / filteredIdeas.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Posts;
