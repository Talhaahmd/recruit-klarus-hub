
import React from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Check } from 'lucide-react';
import { Button } from '@/components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';

interface Theme {
  id: string;
  title: string;
  category: string;
  description: string;
  audience: string;
  objectives: string[];
  postTypes: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  results: {
    revenue: string;
    cac: string;
    churn: string;
  };
  details: {
    background: string;
    purpose: string;
    mainTopic: string;
    targetAudience: string;
    complexityLevel: string;
  };
}

interface ThemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme | null;
}

const ThemeDetailModal: React.FC<ThemeDetailModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  if (!theme) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software Engineers':
        return 'bg-yellow-100 text-yellow-800';
      case 'SaaS Founders':
        return 'bg-yellow-100 text-yellow-800';
      case 'Marketing Leaders':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-2xl font-bold">{theme.title}</DialogTitle>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(theme.category)}`}>
              {theme.category}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-6">
            You'll be able to customize every aspect after adding to your collection
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Theme Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Expandable Sections */}
              <div className="space-y-4">
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">○</span>
                      </div>
                      <span className="font-medium">Background & Offering</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">○</span>
                      </div>
                      <span className="font-medium">Purpose</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Main Topic</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">👥</span>
                      </div>
                      <span className="font-medium">Target Audience</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-t-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⚡</span>
                      </div>
                      <span className="font-medium">Complexity Level</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 pt-4">
                <Check className="h-4 w-4" />
                <span>You'll be able to customize every aspect after adding it to your collection</span>
              </div>
            </div>

            {/* Right Column - Post Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  What type of posts to expect
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>(1/3)</span>
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm mb-3">
                  📈 VCs hate this pricing strategy.
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Just helped a SaaS founder 5x revenue in 60 days.<br />
                  No marketing budget.<br />
                  No growth hacks.
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Just one controversial change:
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Old way (broke):</strong></p>
                  <p>• Freemium tier</p>
                  <p>• $29/mo basic</p>
                  <p>• $99/mo premium</p>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mt-3">
                  <p><strong>New way (money):</strong></p>
                  <p>• $199/mo minimum</p>
                  <p>• 14-day free trial</p>
                  <p>• No freemium</p>
                </div>
                <div className="text-sm text-gray-700 space-y-1 mt-3">
                  <p><strong>Results:</strong></p>
                  <p>• Revenue: <span className="text-green-600">+427%</span></p>
                  <p>• CAC: <span className="text-green-600">-65%</span></p>
                  <p>• Churn: <span className="text-red-600">-83%</span></p>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onClose}>
                  Not right for me
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  + Add to My Themes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeDetailModal;
