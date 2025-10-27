import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { interviewPrepService, InterviewGameplan, InterviewQuestionItem, InterviewPracticeSession, InterviewStats, InterviewCategory, InterviewResource } from '@/services/interviewPrepService';
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
import { MessageSquare, Plus, Play, CheckCircle, Clock, Target, TrendingUp, Search, Filter, Star, Award, Users, Calendar, Zap, Brain, BookOpen, ExternalLink } from 'lucide-react';

const InterviewPrep: React.FC = () => {
  const { user } = useAuth();
  const [targetRole, setTargetRole] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [industry, setIndustry] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('mid');
  const [questionCount, setQuestionCount] = useState(5);
  const [focusAreas, setFocusAreas] = useState<string[]>(['behavioral', 'technical']);
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGameplan, setCurrentGameplan] = useState<InterviewGameplan | null>(null);
  const [questionItems, setQuestionItems] = useState<InterviewQuestionItem[]>([]);
  const [interviewGameplans, setInterviewGameplans] = useState<InterviewGameplan[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<InterviewPracticeSession[]>([]);
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [resources, setResources] = useState<InterviewResource[]>([]);
  const [stats, setStats] = useState<InterviewStats | null>(null);
  const [activeTab, setActiveTab] = useState('generate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentSession, setCurrentSession] = useState<InterviewPracticeSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [responseTime, setResponseTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gameplansData, sessionsData, categoriesData, resourcesData, statsData] = await Promise.all([
        interviewPrepService.getInterviewGameplans(),
        interviewPrepService.getPracticeSessions(),
        interviewPrepService.getInterviewCategories(),
        interviewPrepService.getInterviewResources(),
        interviewPrepService.getInterviewStats()
      ]);
      
      setInterviewGameplans(gameplansData);
      setPracticeSessions(sessionsData);
      setCategories(categoriesData);
      setResources(resourcesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddFocusArea = (area: string) => {
    if (!focusAreas.includes(area)) {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleRemoveFocusArea = (area: string) => {
    setFocusAreas(focusAreas.filter(a => a !== area));
  };

  const handleGenerateGameplan = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter a target role');
      return;
    }

    setIsGenerating(true);
    try {
      const gameplan = await interviewPrepService.generateInterviewGameplan({
        target_role: targetRole,
        company_type: companyType || undefined,
        industry: industry || undefined,
        experience_level: experienceLevel,
        question_count: questionCount,
        focus_areas: focusAreas,
        difficulty_level: difficultyLevel,
      });

      setCurrentGameplan(gameplan);
      setActiveTab('gameplan');
      
      // Load question items
      const items = await interviewPrepService.getInterviewQuestionItems(gameplan.id);
      setQuestionItems(items);
      
      // Refresh gameplans list
      await loadData();
    } catch (error) {
      console.error('Gameplan generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewGameplan = async (gameplan: InterviewGameplan) => {
    setCurrentGameplan(gameplan);
    setActiveTab('gameplan');
    
    const items = await interviewPrepService.getInterviewQuestionItems(gameplan.id);
    setQuestionItems(items);
  };

  const handleDeleteGameplan = async (id: string) => {
    try {
      await interviewPrepService.deleteInterviewGameplan(id);
      await loadData();
      
      if (currentGameplan?.id === id) {
        setCurrentGameplan(null);
        setQuestionItems([]);
        setActiveTab('generate');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleStartPractice = async (gameplan: InterviewGameplan) => {
    try {
      const session = await interviewPrepService.createPracticeSession({
        question_set_id: gameplan.id,
        session_name: `Practice Session - ${gameplan.title}`,
        practice_mode: 'self_practice'
      });

      setCurrentSession(session);
      setCurrentQuestionIndex(0);
      setUserResponse('');
      setResponseTime(0);
      setSessionStartTime(new Date());
      setActiveTab('practice');
    } catch (error) {
      console.error('Failed to start practice session:', error);
    }
  };

  const handleSubmitResponse = async () => {
    if (!currentSession || !questionItems[currentQuestionIndex]) return;

    try {
      await interviewPrepService.submitPracticeResponse({
        session_id: currentSession.id,
        question_item_id: questionItems[currentQuestionIndex].id,
        user_response: userResponse,
        response_time_seconds: responseTime,
        self_rating: 4 // Default rating, could be made interactive
      });

      if (currentQuestionIndex < questionItems.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserResponse('');
        setResponseTime(0);
      } else {
        // Session completed
        await interviewPrepService.updatePracticeSession(currentSession.id, {
          status: 'completed',
          completed_at: new Date().toISOString(),
          completed_questions: questionItems.length
        });
        
        toast.success('Practice session completed!');
        setCurrentSession(null);
        setActiveTab('sessions');
        await loadData();
      }
    } catch (error) {
      console.error('Failed to submit response:', error);
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

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'situational': return 'bg-green-100 text-green-800';
      case 'leadership': return 'bg-orange-100 text-orange-800';
      case 'cultural_fit': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            Interview Prep
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate personalized interview questions and practice sessions
          </p>
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{stats.totalGameplans}</div>
            <div className="text-sm text-muted-foreground">Gameplans</div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="gameplan" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            My Gameplan
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Generate Interview Gameplan
              </CardTitle>
              <CardDescription>
                Create a personalized interview preparation plan with targeted questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Role */}
              <div className="space-y-2">
                <Label htmlFor="target-role">Target Role *</Label>
                <Input
                  id="target-role"
                  placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              {/* Company Type and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-type">Company Type (Optional)</Label>
                  <Input
                    id="company-type"
                    placeholder="e.g., Startup, Fortune 500, Non-profit"
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
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

              {/* Experience Level and Question Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <select
                    id="experience"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive Level</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question-count">Number of Questions</Label>
                  <select
                    id="question-count"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={7}>7 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="space-y-4">
                <Label>Focus Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {['behavioral', 'technical', 'situational', 'leadership', 'cultural_fit'].map((area) => (
                    <Button
                      key={area}
                      variant={focusAreas.includes(area) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        focusAreas.includes(area) 
                          ? handleRemoveFocusArea(area)
                          : handleAddFocusArea(area)
                      }
                    >
                      {area.replace('_', ' ').toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <select
                  id="difficulty"
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <Button 
                onClick={handleGenerateGameplan} 
                disabled={isGenerating || !targetRole.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating Interview Gameplan...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate My Interview Gameplan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Gameplan Tab */}
        <TabsContent value="gameplan" className="space-y-6">
          {currentGameplan ? (
            <div className="space-y-6">
              {/* Gameplan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {currentGameplan.title}
                  </CardTitle>
                  <CardDescription>{currentGameplan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {currentGameplan.question_count}
                      </div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {currentGameplan.experience_level}
                      </div>
                      <div className="text-sm text-muted-foreground">Level</div>
                    </div>
                    <div className="text-center">
                      <Badge className={getDifficultyColor(currentGameplan.difficulty_level)}>
                        {currentGameplan.difficulty_level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <Button 
                        onClick={() => handleStartPractice(currentGameplan)}
                        className="w-full"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Practice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interview Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Interview Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {questionItems.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
                      <p className="text-muted-foreground">
                        The interview questions are still being generated. Please refresh the page or try again.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {questionItems.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                                {item.order_index}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-lg">{item.question_text}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={getQuestionTypeColor(item.question_type)}>
                                    {item.question_type.replace('_', ' ')}
                                  </Badge>
                                  <Badge className={getDifficultyColor(item.difficulty_level)}>
                                    {item.difficulty_level}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {item.sample_answer && (
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-medium text-green-800 mb-2">Sample Answer:</h5>
                              <p className="text-green-700">{item.sample_answer}</p>
                            </div>
                          )}

                          {item.answer_explanation && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">Answer Strategy:</h5>
                              <p className="text-blue-700">{item.answer_explanation}</p>
                            </div>
                          )}

                          {item.key_points && item.key_points.length > 0 && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <h5 className="font-medium text-yellow-800 mb-2">Key Points:</h5>
                              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                                {item.key_points.map((point, idx) => (
                                  <li key={idx}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.follow_up_questions && item.follow_up_questions.length > 0 && (
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h5 className="font-medium text-purple-800 mb-2">Follow-up Questions:</h5>
                              <ul className="list-disc list-inside text-purple-700 space-y-1">
                                {item.follow_up_questions.map((question, idx) => (
                                  <li key={idx}>{question}</li>
                                ))}
                              </ul>
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
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Interview Gameplan Selected</h3>
                <p className="text-muted-foreground text-center">
                  Generate a new interview gameplan or select one from your history to view details.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Practice Tab */}
        <TabsContent value="practice" className="space-y-6">
          {currentSession && questionItems.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Practice Session
                </CardTitle>
                <CardDescription>
                  Question {currentQuestionIndex + 1} of {questionItems.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress 
                  value={((currentQuestionIndex + 1) / questionItems.length) * 100} 
                  className="h-2" 
                />
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {questionItems[currentQuestionIndex].question_text}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getQuestionTypeColor(questionItems[currentQuestionIndex].question_type)}>
                      {questionItems[currentQuestionIndex].question_type.replace('_', ' ')}
                    </Badge>
                    <Badge className={getDifficultyColor(questionItems[currentQuestionIndex].difficulty_level)}>
                      {questionItems[currentQuestionIndex].difficulty_level}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response">Your Response</Label>
                    <Textarea
                      id="response"
                      placeholder="Type your answer here..."
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('gameplan')}
                    >
                      Back to Gameplan
                    </Button>
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={!userResponse.trim()}
                    >
                      {currentQuestionIndex < questionItems.length - 1 ? 'Next Question' : 'Complete Session'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Play className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Practice Session</h3>
                <p className="text-muted-foreground text-center">
                  Start a practice session from an interview gameplan to begin practicing.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Practice Sessions
              </CardTitle>
              <CardDescription>
                View and manage your interview practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {practiceSessions.length > 0 ? (
                <div className="space-y-4">
                  {practiceSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{session.session_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {session.completed_questions}/{session.total_questions} questions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{session.time_spent_minutes} min</span>
                        </div>
                        {session.overall_score && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>{session.overall_score}/100</span>
                          </div>
                        )}
                      </div>
                      <Progress value={(session.completed_questions / session.total_questions) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Practice Sessions Yet</h3>
                  <p className="text-muted-foreground">
                    Start practicing with an interview gameplan to see your sessions here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Interview Resources
              </CardTitle>
              <CardDescription>
                Browse and discover resources to enhance your interview skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
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

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium line-clamp-2">{resource.title}</h4>
                        <Badge variant={resource.is_free ? "default" : "secondary"}>
                          {resource.is_free ? "Free" : "Paid"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(resource.difficulty_level || 'intermediate')}>
                          {resource.difficulty_level || 'intermediate'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                          className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Resource
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterviewPrep;
