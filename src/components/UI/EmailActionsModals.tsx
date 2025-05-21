
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Upload, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { submissionService } from '@/services/submissionService';
import { toast } from 'sonner';

type EmailActionsModalProps = {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  open: boolean;
  onClose: () => void;
  jobTitle?: string;
};

export const EmailActionsModal = ({ 
  candidateId, 
  candidateName, 
  candidateEmail, 
  open, 
  onClose,
  jobTitle
}: EmailActionsModalProps) => {
  const [action, setAction] = useState<'none' | 'interview' | 'offer'>('none');
  
  const handleAction = (type: 'interview' | 'offer') => {
    setAction(type);
  };
  
  const handleClose = () => {
    setAction('none');
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email {candidateName}</DialogTitle>
          <DialogDescription>
            Choose an action to proceed with {candidateEmail}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-auto py-4 border-2 hover:border-primary"
            onClick={() => handleAction('interview')}
          >
            <CalendarIcon className="h-6 w-6 mb-2" />
            <span className="font-medium">Schedule Interview</span>
            <span className="text-xs text-gray-500 mt-1">Send invitation email</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 border-2 hover:border-primary"
            onClick={() => handleAction('offer')}
          >
            <Upload className="h-6 w-6 mb-2" />
            <span className="font-medium">Send Offer Letter</span>
            <span className="text-xs text-gray-500 mt-1">Upload document</span>
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
      
      {action === 'interview' && (
        <InterviewScheduleModal 
          candidateId={candidateId}
          candidateName={candidateName} 
          candidateEmail={candidateEmail}
          jobTitle={jobTitle}
          onClose={() => {
            setAction('none');
            onClose();
          }}
        />
      )}
      
      {action === 'offer' && (
        <OfferLetterModal 
          candidateId={candidateId}
          candidateName={candidateName} 
          candidateEmail={candidateEmail}
          jobTitle={jobTitle}
          onClose={() => {
            setAction('none');
            onClose();
          }}
        />
      )}
    </Dialog>
  );
};

type InterviewScheduleModalProps = {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle?: string;
  onClose: () => void;
};

export const InterviewScheduleModal = ({
  candidateId,
  candidateName,
  candidateEmail,
  jobTitle,
  onClose
}: InterviewScheduleModalProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('09:00');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSchedule = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    setIsLoading(true);
    try {
      // Combine date and time
      const [hours, minutes] = time.split(':').map(Number);
      const interviewDate = new Date(date);
      interviewDate.setHours(hours, minutes);
      
      const success = await submissionService.scheduleInterview(
        candidateId,
        interviewDate,
        notes,
        candidateName,
        candidateEmail,
        jobTitle
      );
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Schedule Interview</SheetTitle>
          <SheetDescription>
            Send an interview invitation email to {candidateName} ({candidateEmail})
            {jobTitle && <span className="block text-sm text-primary-100 mt-1">Position: {jobTitle}</span>}
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-5">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Interview Date</h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Interview Time</h4>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              <Input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Additional Notes</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional information to include in the email..."
              className="w-full min-h-[100px] p-3 border rounded-md"
            />
          </div>
        </div>
        
        <SheetFooter className="flex mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSchedule}
            disabled={isLoading || !date}
            className="ml-2"
          >
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

type OfferLetterModalProps = {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle?: string;
  onClose: () => void;
};

export const OfferLetterModal = ({
  candidateId,
  candidateName,
  candidateEmail,
  jobTitle,
  onClose
}: OfferLetterModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const url = await submissionService.uploadOfferDocument(file);
      if (url) {
        setUploadedUrl(url);
        toast.success("Document uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSendOffer = async () => {
    setIsLoading(true);
    try {
      const success = await submissionService.sendOfferLetter(
        candidateId,
        uploadedUrl || undefined,
        file?.name,
        candidateName,
        candidateEmail,
        jobTitle
      );
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Error sending offer letter:", error);
      toast.error("Failed to send offer letter");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Send Offer Letter</SheetTitle>
          <SheetDescription>
            Upload an offer letter to send to {candidateName} ({candidateEmail})
            {jobTitle && <span className="block text-sm text-primary-100 mt-1">Position: {jobTitle}</span>}
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-5">
          {!uploadedUrl ? (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="mb-4">
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm font-medium">Upload offer letter document</p>
                <p className="text-xs text-gray-500">PDF, DOC or DOCX up to 10MB</p>
              </div>
              
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button 
                  variant="outline" 
                  className="mr-2" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse Files
                </Button>
              </label>
              
              {file && (
                <div className="mt-4 flex items-center justify-between p-2 border rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <div className="ml-2 text-sm text-left">
                      <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleUpload} 
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="font-medium text-sm">Document uploaded successfully</p>
                  <p className="text-xs text-gray-500 truncate">{file?.name}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto h-8 w-8 p-0" 
                  onClick={() => {
                    setUploadedUrl(null);
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Email Message (Optional)</h4>
            <textarea
              placeholder="Enter a personalized message to include with the offer letter..."
              className="w-full min-h-[100px] p-3 border rounded-md"
            />
          </div>
        </div>
        
        <SheetFooter className="flex mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSendOffer}
            disabled={isLoading || isUploading}
            className="ml-2"
          >
            {isLoading ? "Sending..." : "Send Offer Letter"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
