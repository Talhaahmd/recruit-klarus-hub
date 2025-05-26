
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Phone, 
  Star, 
  Calendar, 
  User, 
  TrendingUp,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type AIInterview = {
  id: string;
  candidate_name: string;
  candidate_phone: string;
  role: string;
  call_status: string;
  ai_rating: number;
  communication_score: number;
  cultural_fit_score: number;
  recommendation: string;
  created_at: string;
  updated_at: string;
};

const AIInterviews: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<AIInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_interviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInterviews(data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="container mx-auto p-4">
      <Header 
        title="AI Interviews" 
        subtitle="View and manage AI-conducted candidate interviews"
      />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Interview Results ({interviews.length})</h2>
          <p className="text-sm text-gray-500">AI-powered technical interviews and assessments</p>
        </div>
        <Button onClick={fetchInterviews} variant="outline" size="sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {interviews.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Phone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No AI Interviews Yet</h3>
            <p className="text-gray-500 mb-4">
              Start conducting AI interviews from the candidate profiles
            </p>
            <Button onClick={() => navigate('/candidates')} variant="outline">
              Go to Candidates
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <Card 
              key={interview.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/ai-interviews/${interview.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary-100" />
                      {interview.candidate_name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{interview.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(interview.call_status)}
                    <Badge className={getStatusColor(interview.call_status)}>
                      {interview.call_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {interview.call_status === 'completed' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getRatingColor(interview.ai_rating)}`} />
                        <span className={`font-bold ${getRatingColor(interview.ai_rating)}`}>
                          {interview.ai_rating}/10
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Communication</span>
                        <div className="font-medium">{interview.communication_score}/10</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Cultural Fit</span>
                        <div className="font-medium">{interview.cultural_fit_score}/10</div>
                      </div>
                    </div>

                    {interview.recommendation && (
                      <Badge className={`w-full justify-center ${getRecommendationColor(interview.recommendation)}`}>
                        {interview.recommendation}
                      </Badge>
                    )}
                  </>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(interview.created_at), 'MMM dd, yyyy')}
                  </div>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInterviews;
