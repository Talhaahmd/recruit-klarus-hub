
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Star, 
  User, 
  Phone, 
  Briefcase,
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Award,
  Loader2,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

type InterviewDetail = {
  id: string;
  candidate_name: string;
  candidate_phone: string;
  role: string;
  call_status: string;
  transcript: string;
  interview_summary: string;
  ai_rating: number;
  communication_score: number;
  cultural_fit_score: number;
  technical_skills: any;
  recommendation: string;
  recording_url: string;
  created_at: string;
  updated_at: string;
};

const InterviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInterviewDetail();
    }
  }, [id]);

  const fetchInterviewDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_interviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setInterview(data);
    } catch (error) {
      console.error('Error fetching interview detail:', error);
      toast.error('Failed to load interview details');
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation?.toLowerCase().includes('hire') && !recommendation?.toLowerCase().includes('reject')) {
      return 'bg-green-100 text-green-800';
    }
    if (recommendation?.toLowerCase().includes('reject')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Interview Not Found</h2>
          <p className="text-gray-500 mb-4">The requested interview could not be found.</p>
          <Button onClick={() => navigate('/ai-interviews')} variant="outline">
            Back to Interviews
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button 
          onClick={() => navigate('/ai-interviews')} 
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Interviews
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6 text-primary-100" />
              {interview.candidate_name}
            </h1>
            <p className="text-gray-500 mt-1">{interview.role} Interview</p>
          </div>
          {interview.recording_url && (
            <Button variant="outline" onClick={() => window.open(interview.recording_url, '_blank')}>
              <Download className="h-4 w-4 mr-2" />
              Download Recording
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scores Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Interview Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className={`h-6 w-6 ${getRatingColor(interview.ai_rating)}`} />
                  <span className={`text-3xl font-bold ${getRatingColor(interview.ai_rating)}`}>
                    {interview.ai_rating}
                  </span>
                  <span className="text-gray-500">/10</span>
                </div>
                <p className="text-sm text-gray-500">Overall Rating</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Communication</span>
                  </div>
                  <span className="font-medium">{interview.communication_score}/10</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Cultural Fit</span>
                  </div>
                  <span className="font-medium">{interview.cultural_fit_score}/10</span>
                </div>
              </div>

              {interview.recommendation && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Recommendation</p>
                    <Badge className={`w-full justify-center ${getRecommendationColor(interview.recommendation)}`}>
                      {interview.recommendation}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Technical Skills */}
          {interview.technical_skills && Object.keys(interview.technical_skills).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(interview.technical_skills).map(([skill, level]) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{skill}</span>
                      <Badge variant="outline">{String(level)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interview Info */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{interview.candidate_phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span>{interview.role}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{format(new Date(interview.created_at), 'PPpp')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary and Transcript */}
        <div className="lg:col-span-2 space-y-6">
          {interview.interview_summary && (
            <Card>
              <CardHeader>
                <CardTitle>AI Assessment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{interview.interview_summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {interview.transcript && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {interview.transcript}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail;
