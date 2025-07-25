import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/UI/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/UI/sheet";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Calendar } from "@/components/UI/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/UI/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { interviewService } from '@/services/interviewService';
import { toast } from 'sonner';
import { Textarea } from "@/components/UI/textarea";

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
  // Since we're removing the offer letter option, we don't need the action state
  // We'll directly open the interview scheduling modal
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Interview with {candidateName}</DialogTitle>
          <DialogDescription>
            Send an interview invitation email to {candidateEmail}
            {jobTitle && <span className="block text-sm text-primary-100 mt-1">Position: {jobTitle}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <InterviewScheduleModal 
          candidateId={candidateId}
          candidateName={candidateName} 
          candidateEmail={candidateEmail}
          jobTitle={jobTitle}
          onClose={onClose}
          dialogMode={true}
        />
      </DialogContent>
    </Dialog>
  );
};

type InterviewScheduleModalProps = {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobTitle?: string;
  onClose: () => void;
  dialogMode?: boolean; // To handle different rendering when used inside DialogContent
};

export const InterviewScheduleModal = ({
  candidateId,
  candidateName,
  candidateEmail,
  jobTitle,
  onClose,
  dialogMode = false
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
      // Format date as ISO string for database
      const dateString = date.toISOString();
      
      console.log('📧 Scheduling interview with:', {
        candidateId,
        dateString,
        time,
        notes,
        candidateName,
        candidateEmail,
        jobTitle
      });
      
      // Call the scheduleInterview function with the correct parameters
      const result = await interviewService.scheduleInterview(
        candidateId,
        dateString,
        time,
        notes,
        candidateName,
        candidateEmail,
        jobTitle || ''
      );
      
      if (result) {
        toast.success("Interview scheduled and email sent successfully");
        onClose();
      } else {
        toast.error("Failed to schedule interview");
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview");
    } finally {
      setIsLoading(false);
    }
  };
  
  const content = (
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
  );
  
  if (dialogMode) {
    return (
      <>
        {content}
        <DialogFooter className="flex mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSchedule}
            disabled={isLoading || !date}
            className="ml-2"
          >
            {isLoading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </>
    );
  }
  
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
        
        {content}
        
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
