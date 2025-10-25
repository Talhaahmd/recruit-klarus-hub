import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { learningPathService, LearningPath, LearningPathItem, Course, CourseCategory, LearningPathStats } from '@/services/learningPathService';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Badge } from '@/components/UI/badge';
import { Progress } from '@/components/UI/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Separator } from '@/components/UI/separator';
import { BookOpen, Plus, Play, CheckCircle, Clock, Target, TrendingUp, Search, Filter, Star, Award, Users, Calendar, Zap, ExternalLink } from 'lucide-react';

const LearningPath: React.FC = () => {
  const { user } = useAuth();
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [newSkillGap, setNewSkillGap] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [timeCommitment, setTimeCommitment] = useState('5-10');
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [pathItems, setPathItems] = useState<LearningPathItem[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [stats, setStats] = useState<LearningPathStats | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pathsData, coursesData, categoriesData, statsData] = await Promise.all([
        learningPathService.getLearningPaths(),
        learningPathService.getCourses(),
        learningPathService.getCourseCategories(),
        learningPathService.getLearningPathStats()
      ]);
      
      setLearningPaths(pathsData);
      setCourses(coursesData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddSkillGap = () => {
    if (newSkillGap.trim() && !skillGaps.includes(newSkillGap.trim())) {
      setSkillGaps([...skillGaps, newSkillGap.trim()]);
      setNewSkillGap('');
    }
  };

  const handleRemoveSkillGap = (skill: string) => {
    setSkillGaps(skillGaps.filter(s => s !== skill));
  };

  const handleAddGoal = () => {
    if (newGoal.trim() && !learningGoals.includes(newGoal.trim())) {
      setLearningGoals([...learningGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (goal: string) => {
    setLearningGoals(learningGoals.filter(g => g !== goal));
  };

  const handleGeneratePath = async () => {
    if (skillGaps.length === 0) {
      toast.error('Please add at least one skill gap');
      return;
    }

    setIsGenerating(true);
    try {
      const path = await learningPathService.generateLearningPath({
        skill_gaps: skillGaps,
        target_role: targetRole || undefined,
        industry: industry || undefined,
        experience_level: experienceLevel,
        time_commitment: timeCommitment,
        learning_goals: learningGoals.length > 0 ? learningGoals : undefined,
      });

      setCurrentPath(path);
      setActiveTab('path');
      
      // Load path items
      console.log('Loading path items for path ID:', path.id);
      const items = await learningPathService.getLearningPathItems(path.id);
      console.log('Path items loaded:', items);
      setPathItems(items);
      
      // Refresh paths list
      await loadData();
    } catch (error) {
      console.error('Path generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPath = async (path: LearningPath) => {
    setCurrentPath(path);
    setActiveTab('path');
    
    console.log('Viewing path:', path.id, path.title);
    const items = await learningPathService.getLearningPathItems(path.id);
    console.log('Path items for viewing:', items);
    setPathItems(items);
  };

  const handleDeletePath = async (id: string) => {
    try {
      await learningPathService.deleteLearningPath(id);
      await loadData();
      
      if (currentPath?.id === id) {
        setCurrentPath(null);
        setPathItems([]);
        setActiveTab('generate');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewCourse = (course: Course) => {
    if (course.url) {
      window.open(course.url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('Course URL not available');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Learning Path
          </h1>
          <p className="text-muted-foreground mt-2">
            Create personalized learning roadmaps to bridge your skill gaps
          </p>
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{stats.totalPaths}</div>
            <div className="text-sm text-muted-foreground">Learning Paths</div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="path" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            My Path
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Generate Learning Path
              </CardTitle>
              <CardDescription>
                Create a personalized learning roadmap based on your skill gaps and career goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skill Gaps */}
              <div className="space-y-4">
                <Label>Skill Gaps to Address *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., React, Data Analysis, Leadership"
                    value={newSkillGap}
                    onChange={(e) => setNewSkillGap(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkillGap()}
                  />
                  <Button onClick={handleAddSkillGap} disabled={!newSkillGap.trim()}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => handleRemoveSkillGap(skill)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Target Role and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-role">Target Role (Optional)</Label>
                  <Input
                    id="target-role"
                    placeholder="e.g., Senior Developer, Data Scientist"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry (Optional)</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
              </div>

              {/* Experience Level and Time Commitment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <select
                    id="experience"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time Commitment (hours/week)</Label>
                  <select
                    id="time"
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="1-3">1-3 hours</option>
                    <option value="3-5">3-5 hours</option>
                    <option value="5-10">5-10 hours</option>
                    <option value="10+">10+ hours</option>
                  </select>
                </div>
              </div>

              {/* Learning Goals */}
              <div className="space-y-4">
                <Label>Learning Goals (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Get promoted, Change careers, Learn new technology"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                  />
                  <Button onClick={handleAddGoal} disabled={!newGoal.trim()}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {learningGoals.map((goal, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {goal}
                      <button
                        onClick={() => handleRemoveGoal(goal)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleGeneratePath} 
                disabled={isGenerating || skillGaps.length === 0}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating Learning Path...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate My Learning Path
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Path Tab */}
        <TabsContent value="path" className="space-y-6">
          {currentPath ? (
            <div className="space-y-6">
              {/* Path Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {currentPath.title}
                  </CardTitle>
                  <CardDescription>{currentPath.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {currentPath.progress_percentage || 0}%
                        </span>
                      </div>
                      <Progress value={currentPath.progress_percentage || 0} className="h-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentPath.estimated_duration_weeks}
                      </div>
                      <div className="text-sm text-muted-foreground">Weeks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {currentPath.total_hours}
                      </div>
                      <div className="text-sm text-muted-foreground">Hours</div>
                    </div>
                    <div className="text-center">
                      <Badge className={getDifficultyColor(currentPath.difficulty_level || 'intermediate')}>
                        {currentPath.difficulty_level}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Path Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Learning Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pathItems.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Learning Items Found</h3>
                      <p className="text-muted-foreground">
                        The learning path items are still being generated. Please refresh the page or try again.
                      </p>
                      <Button 
                        onClick={() => handleViewPath(currentPath)} 
                        className="mt-4"
                        variant="outline"
                      >
                        Refresh Items
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pathItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                              {item.order_index}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.item_type}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {item.estimated_hours}h
                            </div>
                            {item.is_required && (
                              <Badge variant="secondary">Required</Badge>
                            )}
                          </div>
                        </div>
                        {item.notes && (
                          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Learning Path Selected</h3>
                <p className="text-muted-foreground text-center">
                  Generate a new learning path or select one from your history to view details.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Available Courses
              </CardTitle>
              <CardDescription>
                Browse and discover courses to enhance your skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium line-clamp-2">{course.title}</h4>
                        <Badge className={getDifficultyColor(course.difficulty_level)}>
                          {course.difficulty_level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{course.rating}</span>
                          <span className="text-muted-foreground">
                            ({course.enrollment_count} enrolled)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration_hours}h</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={course.is_free ? "default" : "secondary"}>
                          {course.is_free ? "Free" : "Paid"}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewCourse(course)}
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Path History
              </CardTitle>
              <CardDescription>
                View and manage your previous learning paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              {learningPaths.length > 0 ? (
                <div className="space-y-4">
                  {learningPaths.map((path) => (
                    <div key={path.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{path.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(path.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(path.status || 'active')}>
                            {path.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {path.progress_percentage || 0}% complete
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPath(path)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePath(path.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{path.estimated_duration_weeks} weeks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{path.total_hours} hours</span>
                        </div>
                        <Badge className={getDifficultyColor(path.difficulty_level || 'intermediate')}>
                          {path.difficulty_level}
                        </Badge>
                      </div>
                      <Progress value={path.progress_percentage || 0} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Learning Paths Yet</h3>
                  <p className="text-muted-foreground">
                    Generate your first learning path to see it here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPath;
