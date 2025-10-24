import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  category: string;
  issue: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  priority: number;
}

interface FeedbackCardProps {
  feedback: FeedbackItem;
  className?: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  className = ''
}) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'formatting':
        return 'bg-purple-100 text-purple-800';
      case 'keywords':
        return 'bg-green-100 text-green-800';
      case 'grammar':
        return 'bg-blue-100 text-blue-800';
      case 'content':
        return 'bg-orange-100 text-orange-800';
      case 'structure':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getSeverityIcon(feedback.severity)}
            <CardTitle className="text-sm font-medium">
              {feedback.issue}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCategoryColor(feedback.category)}>
              {feedback.category}
            </Badge>
            <Badge variant="outline" className={getSeverityColor(feedback.severity)}>
              {feedback.severity}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Suggestion:</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {feedback.suggestion}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Priority: {feedback.priority}/5</span>
            <span>Category: {feedback.category}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackCard;
