
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { candidatesService, CandidateInput } from '@/services/candidatesService';
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
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Calendar as CalendarIcon, Briefcase, UserPlus, Linkedin, Plus } from "lucide-react"
import AddCandidateModal from '@/components/UI/AddCandidateModal';
import AddJobModal from '@/components/UI/JobsComponents/AddJobModal';
import { InterviewScheduleModal } from '@/components/UI/EmailActionsModals';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
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
    setActionMenuOpen(true);
  };

  const handleAddJob = () => {
    setShowJobModal(true);
    setActionMenuOpen(false);
  };

  const handleAddCandidate = () => {
    setShowCandidateModal(true);
    setActionMenuOpen(false);
  };

  const handleScheduleInterview = () => {
    setShowInterviewModal(true);
    setActionMenuOpen(false);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-2">
          Manage your recruitment activities and events
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <ContextMenu>
          <ContextMenuTrigger>
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
                  <div className="p-1 text-xs">
                    <div className="font-semibold">{eventInfo.event.title}</div>
                    <div>{format(eventInfo.event.start!, 'h:mm a')}</div>
                  </div>
                );
              }}
              dayCellContent={(info) => {
                return (
                  <div className="flex flex-col h-full">
                    <span className="text-sm font-medium">{info.dayNumberText}</span>
                  </div>
                );
              }}
              dayHeaderContent={(info) => {
                return (
                  <div className="text-xs font-semibold p-1">
                    {info.text}
                  </div>
                );
              }}
            />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56 bg-white shadow-lg rounded-md border z-50">
            {selectedDate && (
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground border-b mb-1">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
            )}
            <ContextMenuItem 
              onClick={handleAddJob}
              className="flex items-center cursor-pointer"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Add Job</span>
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={handleAddCandidate}
              className="flex items-center cursor-pointer"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Add Candidate</span>
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={handleScheduleInterview}
              className="flex items-center cursor-pointer"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Schedule Interview</span>
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={handlePostLinkedin}
              className="flex items-center cursor-pointer"
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
          }} 
        />
      )}

      {/* Interview Schedule Modal - This is a placeholder since we don't have candidate data yet */}
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
              <Button onClick={() => navigate('/candidates')}>
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
