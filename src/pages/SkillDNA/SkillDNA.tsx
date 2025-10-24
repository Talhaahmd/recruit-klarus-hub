import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { skillAnalysisService, SkillAnalysis, SkillAnalysisItem, EmployeeArchetype, SkillAnalysisStats } from '@/services/skillAnalysisService';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Textarea } from '@/components/UI/textarea';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Badge } from '@/components/UI/badge';
import { Progress } from '@/components/UI/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Separator } from '@/components/UI/separator';
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  BarChart3,
  History,
  Download,
  Trash2,
  Star,
  AlertCircle,
  CheckCircle,
  Zap,
  BookOpen,
  Award,
  User
} from 'lucide-react';

const SkillDNA: React.FC = () => {
  const { user } = useAuth();
  const [cvText, setCvText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<SkillAnalysis | null>(null);
  const [analysisItems, setAnalysisItems] = useState<SkillAnalysisItem[]>([]);
  const [analyses, setAnalyses] = useState<SkillAnalysis[]>([]);
  const [archetypes, setArchetypes] = useState<EmployeeArchetype[]>([]);
  const [stats, setStats] = useState<SkillAnalysisStats | null>(null);
  const [activeTab, setActiveTab] = useState('analyze');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analysesData, archetypesData, statsData] = await Promise.all([
        skillAnalysisService.getAnalyses(),
        skillAnalysisService.getArchetypes(),
        skillAnalysisService.getAnalysisStats()
      ]);
      
      setAnalyses(analysesData);
      setArchetypes(archetypesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      toast.error('Please enter CV text');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await skillAnalysisService.analyzeSkills({
        cv_text: cvText,
        job_title: jobTitle || undefined,
        industry: industry || undefined,
        target_role: targetRole || undefined,
      });

      setCurrentAnalysis(analysis);
      setActiveTab('results');
      
      // Load analysis items
      const items = await skillAnalysisService.getAnalysisItems(analysis.id);
      setAnalysisItems(items);
      
      // Refresh analyses list
      await loadData();
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewAnalysis = async (analysis: SkillAnalysis) => {
    setCurrentAnalysis(analysis);
    setActiveTab('results');
    
    const items = await skillAnalysisService.getAnalysisItems(analysis.id);
    setAnalysisItems(items);
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await skillAnalysisService.deleteAnalysis(id);
      await loadData();
      
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
        setAnalysisItems([]);
        setActiveTab('analyze');
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'beginner': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Skill DNA Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover your professional archetype and skill strengths through AI-powered analysis
          </p>
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{stats.totalAnalyses}</div>
            <div className="text-sm text-muted-foreground">Analyses Completed</div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Statistics
          </TabsTrigger>
        </TabsList>

        {/* Analyze Tab */}
        <TabsContent value="analyze" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Analyze Your Skills
              </CardTitle>
              <CardDescription>
                Upload your CV text and get AI-powered skill analysis with archetype classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cv-text">CV Text *</Label>
                <Textarea
                  id="cv-text"
                  placeholder="Paste your CV text here..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title (Optional)</Label>
                  <Input
                    id="job-title"
                    placeholder="e.g., Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry (Optional)</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-role">Target Role (Optional)</Label>
                  <Input
                    id="target-role"
                    placeholder="e.g., Senior Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !cvText.trim()}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing Skills...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze My Skills
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {currentAnalysis ? (
            <div className="space-y-6">
              {/* Overall Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Skill Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className={`font-bold ${getScoreColor(currentAnalysis.overall_skill_score || 0)}`}>
                          {currentAnalysis.overall_skill_score || 0}/100
                        </span>
                      </div>
                      <Progress value={currentAnalysis.overall_skill_score || 0} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {getScoreLabel(currentAnalysis.overall_skill_score || 0)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Technical Skills</span>
                        <span className={`font-bold ${getScoreColor(currentAnalysis.technical_skills_score || 0)}`}>
                          {currentAnalysis.technical_skills_score || 0}/100
                        </span>
                      </div>
                      <Progress value={currentAnalysis.technical_skills_score || 0} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Soft Skills</span>
                        <span className={`font-bold ${getScoreColor(currentAnalysis.soft_skills_score || 0)}`}>
                          {currentAnalysis.soft_skills_score || 0}/100
                        </span>
                      </div>
                      <Progress value={currentAnalysis.soft_skills_score || 0} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Leadership</span>
                        <span className={`font-bold ${getScoreColor(currentAnalysis.leadership_score || 0)}`}>
                          {currentAnalysis.leadership_score || 0}/100
                        </span>
                      </div>
                      <Progress value={currentAnalysis.leadership_score || 0} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Creativity</span>
                        <span className={`font-bold ${getScoreColor(currentAnalysis.creativity_score || 0)}`}>
                          {currentAnalysis.creativity_score || 0}/100
                        </span>
                      </div>
                      <Progress value={currentAnalysis.creativity_score || 0} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Analytical</span>
                        <span className={`font-bold ${getScoreColor(currentAnalysis.analytical_score || 0)}`}>
                          {currentAnalysis.analytical_score || 0}/100
                        </span>
                      </div>
                      <Progress value={currentAnalysis.analytical_score || 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Archetype Classification */}
              {currentAnalysis.primary_archetype && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Your Professional Archetype
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Brain className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {currentAnalysis.primary_archetype.name}
                          </h3>
                          <p className="text-muted-foreground">
                            {currentAnalysis.primary_archetype.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">
                              Confidence: {Math.round((currentAnalysis.archetype_confidence || 0) * 100)}%
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Key Characteristics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.primary_archetype.characteristics?.map((char, index) => (
                            <Badge key={index} variant="outline">{char}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Ideal Roles:</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.primary_archetype.ideal_roles?.map((role, index) => (
                            <Badge key={index} variant="secondary">{role}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Skills */}
              {currentAnalysis.top_skills && currentAnalysis.top_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Top Skills Identified
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.top_skills.map((skill, index) => (
                        <Badge key={index} variant="default" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Missing Skills */}
              {currentAnalysis.missing_skills && currentAnalysis.missing_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Skills to Develop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.missing_skills.map((skill, index) => (
                        <Badge key={index} variant="destructive" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Skill Analysis */}
              {analysisItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Detailed Skill Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisItems.map((item, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.skill_name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getProficiencyColor(item.proficiency_level)}>
                                {item.proficiency_level}
                              </Badge>
                              {item.is_strong_point && (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Strength
                                </Badge>
                              )}
                              {item.is_weak_point && (
                                <Badge variant="destructive">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Weakness
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.evidence}</p>
                          <div className="flex justify-between text-sm">
                            <span>Category: {item.skill_category}</span>
                            <span>Confidence: {item.confidence_score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Selected</h3>
                <p className="text-muted-foreground text-center">
                  Analyze your skills or select an analysis from the history to view results.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Analysis History
              </CardTitle>
              <CardDescription>
                View and manage your previous skill analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyses.length > 0 ? (
                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {analysis.job_title || 'Skill Analysis'} 
                            {analysis.industry && ` - ${analysis.industry}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            Score: {analysis.overall_skill_score || 0}/100
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAnalysis(analysis)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAnalysis(analysis.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {analysis.primary_archetype && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {analysis.primary_archetype.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Confidence: {Math.round((analysis.archetype_confidence || 0) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analyses Yet</h3>
                  <p className="text-muted-foreground">
                    Start by analyzing your skills to see your history here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.averageOverallScore}/100
                  </div>
                  <p className="text-sm text-muted-foreground">Average Overall Score</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Skill Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Technical</span>
                    <span className="font-medium">{stats.averageTechnicalScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Soft Skills</span>
                    <span className="font-medium">{stats.averageSoftSkillsScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Leadership</span>
                    <span className="font-medium">{stats.averageLeadershipScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Creativity</span>
                    <span className="font-medium">{stats.averageCreativityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Analytical</span>
                    <span className="font-medium">{stats.averageAnalyticalScore}/100</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Total Analyses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.totalAnalyses}
                  </div>
                  <p className="text-sm text-muted-foreground">Analyses Completed</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Statistics Available</h3>
                <p className="text-muted-foreground text-center">
                  Complete some skill analyses to see your statistics here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillDNA;
