import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Lock, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RestrictedAccessProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const RestrictedAccess: React.FC<RestrictedAccessProps> = ({
  title = "Access Restricted",
  message = "This feature is currently unavailable. Please contact support for more information.",
  showBackButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Recruitment features are temporarily disabled</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
          {showBackButton && (
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RestrictedAccess;
