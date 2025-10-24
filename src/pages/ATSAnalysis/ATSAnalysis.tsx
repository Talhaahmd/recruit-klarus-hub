import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Textarea } from '@/components/UI/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Badge } from '@/components/UI/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Separator } from '@/components/UI/separator';
import { Loader2, Upload, FileText, Download, Trash2, History, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { atsAnalysisService, ATSAnalysis, ATSAnalysisWithFeedback, ATSAnalysisRequest } from '@/services/atsAnalysisService';
import ATSScoreGauge from '@/components/UI/ATSScoreGauge';
import FeedbackCard from '@/components/UI/FeedbackCard';

const ATSAnalysis: React.FC = () => {
  const [cvText, setCvText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ATSAnalysisWithFeedback | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ATSAnalysis[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('analyze');

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Sales',
    'Engineering',
    'Design',
    'Consulting',
    'Non-profit',
    'Government',
    'Manufacturing',
    'Retail',
    'Hospitality',
    'Other'
  ];

  useEffect(() => {
    loadAnalysisHistory();
    loadStats();
  }, []);

  const loadAnalysisHistory = async () => {
    try {
      const analyses = await atsAnalysisService.getAnalyses();
      setAnalysisHistory(analyses);
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
  };

  const loadStats = async () => {
    try {
      const analysisStats = await atsAnalysisService.getAnalysisStats();
      setStats(analysisStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!cvText.trim()) {
      toast.error('Please enter your CV text');
      return;
    }

    setIsAnalyzing(true);
    try {
      const request: ATSAnalysisRequest = {
        cvText: cvText.trim(),
        jobTitle: jobTitle || undefined,
        industry: industry || undefined,
        jobDescription: jobDescription || undefined
      };

      const analysis = await atsAnalysisService.analyzeCV(request);
      
      // Load full analysis with feedback
      const fullAnalysis = await atsAnalysisService.getAnalysisById(analysis.id);
      setCurrentAnalysis(fullAnalysis);
      
      // Refresh history and stats
      await loadAnalysisHistory();
      await loadStats();
      
      setActiveTab('results');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadAnalysis = async (analysisId: string) => {
    try {
      const analysis = await atsAnalysisService.getAnalysisById(analysisId);
      setCurrentAnalysis(analysis);
      setActiveTab('results');
    } catch (error) {
      console.error('Failed to load analysis:', error);
    }
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    try {
      await atsAnalysisService.deleteAnalysis(analysisId);
      await loadAnalysisHistory();
      await loadStats();
      
      if (currentAnalysis?.id === analysisId) {
        setCurrentAnalysis(null);
        setActiveTab('analyze');
      }
    } catch (error) {
      console.error('Failed to delete analysis:', error);
    }
  };

  const exportAnalysis = () => {
    if (!currentAnalysis) return;
    
    const report = {
      analysis: currentAnalysis,
      generated_at: new Date().toISOString(),
      report_type: 'ATS Analysis Report'
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-analysis-${currentAnalysis.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">ATS Analysis</h1>
          <p className="text-gray-600">
            Get detailed feedback on your CV's ATS compatibility and optimization suggestions
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Analyses</span>
                </div>
                <p className="text-2xl font-bold">{stats.totalAnalyses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Average Score</span>
                </div>
                <p className="text-2xl font-bold">{stats.averageScore}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Highest Score</span>
                </div>
                <p className="text-2xl font-bold">{stats.highestScore}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Lowest Score</span>
                </div>
                <p className="text-2xl font-bold">{stats.lowestScore}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze">Analyze CV</TabsTrigger>
            <TabsTrigger value="results" disabled={!currentAnalysis}>Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Analyze Tab */}
          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>CV Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="cv-text">CV Text *</Label>
                  <Textarea
                    id="cv-text"
                    placeholder="Paste your CV text here or upload a file..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Copy and paste your CV content for analysis
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-title">Job Title (Optional)</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g., Software Engineer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry (Optional)</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind} value={ind}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="job-description">Job Description (Optional)</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description for better keyword matching..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Include the job description for more accurate keyword analysis
                  </p>
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !cvText.trim()}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing CV...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Analyze CV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {currentAnalysis ? (
              <>
                {/* Analysis Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Analysis Results</h2>
                    <p className="text-muted-foreground">
                      Generated on {new Date(currentAnalysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={exportAnalysis}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDeleteAnalysis(currentAnalysis.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Overall ATS Score
                      <Badge className="text-lg px-3 py-1">
                        {currentAnalysis.overall_compatibility_score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className={`text-6xl font-bold ${getScoreColor(currentAnalysis.overall_compatibility_score)}`}>
                        {currentAnalysis.overall_compatibility_score}
                      </div>
                      {currentAnalysis.feedback_summary && (
                        <p className="text-lg text-muted-foreground">
                          {currentAnalysis.feedback_summary}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ATSScoreGauge
                    score={currentAnalysis.ats_score}
                    label="ATS Compatibility"
                    description="Overall ATS system compatibility"
                  />
                  <ATSScoreGauge
                    score={currentAnalysis.formatting_score}
                    label="Formatting"
                    description="Resume structure and formatting"
                  />
                  <ATSScoreGauge
                    score={currentAnalysis.keyword_density_score}
                    label="Keywords"
                    description="Relevant keyword usage"
                  />
                  <ATSScoreGauge
                    score={currentAnalysis.grammar_score}
                    label="Grammar"
                    description="Grammar and clarity"
                  />
                  <ATSScoreGauge
                    score={currentAnalysis.quantifiable_results_score}
                    label="Quantifiable Results"
                    description="Numbers and metrics"
                  />
                </div>

                {/* Feedback Items */}
                {currentAnalysis.feedback_items && currentAnalysis.feedback_items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentAnalysis.feedback_items.map((feedback) => (
                          <FeedbackCard
                            key={feedback.id}
                            feedback={feedback}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
                  <p className="text-muted-foreground">
                    Analyze a CV to see detailed results and feedback
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" />
                  Analysis History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisHistory.length > 0 ? (
                  <div className="space-y-4">
                    {analysisHistory.map((analysis) => (
                      <Card key={analysis.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">
                              {analysis.job_title || 'General Analysis'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {analysis.industry && `${analysis.industry} • `}
                              {new Date(analysis.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getScoreColor(analysis.overall_compatibility_score)}>
                              {analysis.overall_compatibility_score}/100
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoadAnalysis(analysis.id)}
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
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis History</h3>
                    <p className="text-muted-foreground">
                      Your CV analyses will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ATSAnalysis;
