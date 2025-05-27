
import React, { useState } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Filter, X, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { DraggableCardContainer, DraggableCardBody } from '@/components/UI/draggable-card';

interface PostIdea {
  id: string;
  title: string;
  theme: string;
  category: string;
  description?: string;
  index: number;
  total: number;
}

const mockPostIdeas: PostIdea[] = [
  {
    id: '1',
    title: 'Future-Proofing Project Management: The Role of AI in Predictive Decision-Making',
    theme: 'AI-Driven Project Management Insights',
    category: 'Analysis',
    description: 'Explore how artificial intelligence is revolutionizing project management through predictive analytics and data-driven decision making.',
    index: 1,
    total: 29
  },
  {
    id: '2',
    title: 'Breaking Down Silos: How Cross-Functional Teams Drive Innovation',
    theme: 'Collaborative Leadership',
    category: 'Case Study',
    description: 'Learn how breaking organizational barriers can lead to breakthrough innovations and improved team performance.',
    index: 2,
    total: 29
  },
  {
    id: '3',
    title: 'The Psychology of Remote Team Management',
    theme: 'Remote Work Excellence',
    category: 'Deep Dive',
    description: 'Understanding the psychological aspects of managing remote teams for maximum productivity and engagement.',
    index: 3,
    total: 29
  }
];

const themes = [
  'AI-Driven Project Management Insights',
  'Collaborative Leadership', 
  'Remote Work Excellence',
  'Digital Transformation',
  'Agile Methodologies'
];

const categories = [
  'Analysis',
  'Case Study', 
  'Deep Dive',
  'Educational Insights',
  'Future Trends',
  'How-To'
];

const Posts: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostIdea[]>(mockPostIdeas);

  const currentPost = filteredPosts[currentIndex];

  const handleThemeFilter = (theme: string, checked: boolean) => {
    const newSelectedThemes = checked 
      ? [...selectedThemes, theme]
      : selectedThemes.filter(t => t !== theme);
    
    setSelectedThemes(newSelectedThemes);
    applyFilters(newSelectedThemes, selectedCategories);
  };

  const handleCategoryFilter = (category: string, checked: boolean) => {
    const newSelectedCategories = checked 
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newSelectedCategories);
    applyFilters(selectedThemes, newSelectedCategories);
  };

  const applyFilters = (themeFilters: string[], categoryFilters: string[]) => {
    let filtered = mockPostIdeas;

    if (themeFilters.length > 0) {
      filtered = filtered.filter(post => themeFilters.includes(post.theme));
    }

    if (categoryFilters.length > 0) {
      filtered = filtered.filter(post => categoryFilters.includes(post.category));
    }

    setFilteredPosts(filtered);
    setCurrentIndex(0);
  };

  const clearAllFilters = () => {
    setSelectedThemes([]);
    setSelectedCategories([]);
    setFilteredPosts(mockPostIdeas);
    setCurrentIndex(0);
  };

  const nextPost = () => {
    if (currentIndex < filteredPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPost = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDismissIdea = () => {
    console.log('Dismissing idea:', currentPost?.id);
    // Logic to dismiss the current idea
  };

  const handleGeneratePost = () => {
    console.log('Generating post for:', currentPost?.id);
    // Logic to generate a full post
  };

  if (!currentPost) {
    return (
      <div className="p-4 lg:p-8">
        <Header 
          title="Post Ideas"
          subtitle="AI-generated LinkedIn post ideas based on your selected themes"
        />
        <div className="text-center py-12">
          <p className="text-gray-500">No post ideas match your current filters.</p>
          <Button onClick={clearAllFilters} className="mt-4">
            Clear All Filters
          </Button>
        </div>
      </div>
    );
  }

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
            {themes.map((theme) => (
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
            {categories.map((category) => (
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
      <div className="flex items-center justify-center min-h-[600px]">
        <DraggableCardContainer>
          <DraggableCardBody className="w-96 bg-white shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {currentPost.theme}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {currentPost.title}
              </h2>
              
              {currentPost.description && (
                <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                  Add additional context
                </p>
              )}

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
                >
                  Generate Post
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
          onClick={prevPost}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-8 top-1/2 transform -translate-y-1/2"
          onClick={nextPost}
          disabled={currentIndex === filteredPosts.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Status */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
          <span>Ideas {currentIndex + 1} of {filteredPosts.length}</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, filteredPosts.length) }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentIndex % 5 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span>{Math.round(((currentIndex + 1) / filteredPosts.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Posts;
