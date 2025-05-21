
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { candidatesService } from '@/services/candidatesService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Calendar as CalendarIcon, Briefcase, UserPlus, Linkedin, Plus, Info } from "lucide-react"
import AddCandidateModal from '@/components/UI/AddCandidateModal';
import AddJobModal from '@/components/UI/JobsComponents/AddJobModal';
import { InterviewScheduleModal } from '@/components/UI/EmailActionsModals';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    refetchEvents();
  }, []);

  const refetchEvents = async () => {
    setIsLoading(true);
    try {
      const fetchedEvents = await calendarService.getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    document.getElementById('context-menu-trigger')?.click();
  };

  const handleAddJob = () => {
    setShowJobModal(true);
  };

  const handleAddCandidate = () => {
    setShowCandidateModal(true);
  };

  const handleScheduleInterview = () => {
    setShowInterviewModal(true);
  };

  const handlePostLinkedin = () => {
    navigate('/build-profile');
  };

  const closeModals = () => {
    setShowJobModal(false);
    setShowCandidateModal(false);
    setShowInterviewModal(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-100">Recruitment Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage your recruitment activities and events
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full" onClick={refetchEvents}>
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click on any date to add jobs, candidates, or schedule interviews</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <ContextMenu>
          <ContextMenuTrigger id="context-menu-trigger">
            <div className={cn(
              "relative",
              isLoading && "opacity-70 pointer-events-none"
            )}>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                  <div className="animate-pulse text-primary-100">Loading calendar...</div>
                </div>
              )}
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                height="auto"
                aspectRatio={1.8}
                weekends={true}
                events={events.map(event => ({
                  id: event.id,
                  title: event.title,
                  start: event.startDate,
                  end: event.endDate,
                  backgroundColor: '#0077C2',
                  borderColor: '#0077C2'
                }))}
                dateClick={handleDateClick}
                eventContent={(eventInfo) => {
                  return (
                    <div className="p-1 text-xs hover:bg-primary-100/10 rounded transition-colors">
                      <div className="font-semibold">{eventInfo.event.title}</div>
                      <div>{format(eventInfo.event.start!, 'h:mm a')}</div>
                    </div>
                  );
                }}
                dayCellClassNames="hover:bg-primary-100/5 transition-colors cursor-pointer"
                dayCellContent={(info) => {
                  return (
                    <div className="flex flex-col h-full">
                      <span className="text-sm font-medium">{info.dayNumberText}</span>
                    </div>
                  );
                }}
                dayHeaderContent={(info) => {
                  return (
                    <div className="text-xs font-semibold p-1 text-primary-100">
                      {info.text}
                    </div>
                  );
                }}
              />
            </div>
          </ContextMenuTrigger>
          
          <ContextMenuContent className="w-56 bg-white shadow-lg rounded-md border z-50">
            {selectedDate && (
              <div className="px-3 py-2 text-sm font-medium text-primary-100 border-b mb-1">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
            )}
            <ContextMenuItem 
              onClick={handleAddJob}
              className="flex items-center cursor-pointer hover:bg-primary-100/10 hover:text-primary-100 transition-colors"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Add Job</span>
            </ContextMenuItem>
            
            <ContextMenuItem 
              onClick={handleAddCandidate}
              className="flex items-center cursor-pointer hover:bg-primary-100/10 hover:text-primary-100 transition-colors"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add Candidate</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem 
              onClick={handleScheduleInterview}
              className="flex items-center cursor-pointer hover:bg-primary-100/10 hover:text-primary-100 transition-colors"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Schedule Interview</span>
            </ContextMenuItem>
            
            <ContextMenuItem 
              onClick={handlePostLinkedin}
              className="flex items-center cursor-pointer hover:bg-primary-100/10 hover:text-primary-100 transition-colors"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              <span>Post on LinkedIn</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <AddJobModal 
          isOpen={showJobModal} 
          onClose={closeModals} 
          onSave={() => {
            closeModals();
            toast.success('Job added successfully');
            refetchEvents();
          }} 
        />
      )}

      {/* Candidate Modal */}
      {showCandidateModal && (
        <AddCandidateModal 
          isOpen={showCandidateModal} 
          onClose={closeModals} 
          onSave={() => {
            closeModals();
            toast.success('Candidate added successfully');
            refetchEvents();
          }} 
        />
      )}

      {/* Interview Schedule Modal */}
      {showInterviewModal && (
        <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule an Interview</DialogTitle>
              <DialogDescription>
                Please select a candidate from the candidates page to schedule an interview.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-6">
              <Button onClick={() => navigate('/candidates')} variant="default" className="bg-primary-100 hover:bg-primary-100/90">
                Go to Candidates
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarPage;
