import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { Linkedin, X } from 'lucide-react';

interface LinkedInPromptModalProps {
  isOpen: boolean;
  onConnect: () => void;
  onDismiss: () => void;
}

const LinkedInPromptModal: React.FC<LinkedInPromptModalProps> = ({
  isOpen,
  onConnect,
  onDismiss
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onDismiss}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Linkedin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">Connect LinkedIn</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Enable job posting to LinkedIn
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-700 mb-4">
            To enable automatic job posting to LinkedIn, we need to connect your LinkedIn account. 
            This will allow you to share job opportunities directly from Klarus HR.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h4 className="font-medium text-blue-900 mb-1">What we'll access:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your basic profile information</li>
              <li>• Email address</li>
              <li>• Permission to post on your behalf</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onConnect}
            className="flex-1 bg-[#0077B5] hover:bg-[#005885] text-white"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Connect LinkedIn
          </Button>
          <Button
            variant="outline"
            onClick={onDismiss}
            className="px-4"
          >
            Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkedInPromptModal;
