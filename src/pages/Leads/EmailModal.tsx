
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Textarea } from '@/components/UI/textarea';
import { Label } from '@/components/UI/label';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { LeadWithLabels } from '@/services/leadsService';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadWithLabels | null;
  senderName: string;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  lead,
  senderName
}) => {
  const [emailData, setEmailData] = useState({
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead?.email) {
      toast.error('No email address available for this lead');
      return;
    }

    if (!emailData.subject.trim() || !emailData.content.trim()) {
      toast.error('Subject and content are required');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-lead-email', {
        body: {
          to: lead.email,
          subject: emailData.subject,
          content: emailData.content,
          senderName
        }
      });

      if (error) throw error;

      toast.success('Email sent successfully!');
      setEmailData({ subject: '', content: '' });
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmailData({ subject: '', content: '' });
    onClose();
  };

  const templates = [
    {
      name: 'Introduction',
      subject: `Introduction from ${senderName}`,
      content: `Hi ${lead?.full_name},\n\nI hope this email finds you well. I came across your profile and was impressed by your background.\n\nI'd love to connect and discuss potential opportunities that might align with your experience.\n\nWould you be available for a brief call this week?\n\nBest regards,\n${senderName}`
    },
    {
      name: 'Follow Up',
      subject: 'Following up on our conversation',
      content: `Hi ${lead?.full_name},\n\nI wanted to follow up on our previous conversation and see if you had any questions about the opportunities we discussed.\n\nI'm here to help with any additional information you might need.\n\nLooking forward to hearing from you.\n\nBest regards,\n${senderName}`
    },
    {
      name: 'Job Opportunity',
      subject: 'Exciting opportunity that matches your profile',
      content: `Hi ${lead?.full_name},\n\nI have an exciting opportunity that I believe would be a perfect match for your skills and experience.\n\nWould you be interested in learning more? I'd be happy to schedule a call to discuss the details.\n\nBest regards,\n${senderName}`
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Email to {lead?.full_name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient">To:</Label>
            <Input
              id="recipient"
              value={lead?.email || ''}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              placeholder="Enter email subject"
              required
            />
          </div>

          <div>
            <Label>Email Templates</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {templates.map((template, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmailData({
                    subject: template.subject,
                    content: template.content
                  })}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={emailData.content}
              onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
              placeholder="Enter your email content..."
              rows={8}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
