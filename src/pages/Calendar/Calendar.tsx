
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/MainLayout';
import { Calendar as CalendarIcon, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddJobModal, { NewJobData } from '@/components/UI/AddJobModal';
import AddCandidateModal from '@/components/UI/AddCandidateModal';
import { useNavigate } from 'react-router-dom';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { jobsService } from '@/services/jobsService';
import { candidatesService } from '@/services/candidatesService';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventTypeDialogOpen, setIsEventTypeDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  
  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await calendarService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const handleAddEvent = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    } else {
      setSelectedDate(new Date());
    }
    setIsEventTypeDialogOpen(true);
  };
  
  const handleEventTypeSelection = (type: string) => {
    setIsEventTypeDialogOpen(false);
    
    switch(type) {
      case 'job':
        setShowAddJobModal(true);
        break;
      case 'candidate':
        setShowAddCandidateModal(true);
        break;
      case 'linkedin':
        navigate('/build-profile');
        break;
      default:
        break;
    }
  };

  const handleSaveNewJob = async (jobData: NewJobData) => {
    try {
      // First create the job
      const newJob = await jobsService.createJob({
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        type: jobData.type,
        status: 'Active',
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
        technologies: jobData.technologies,
        workplaceType: jobData.workplaceType,
        complexity: jobData.complexity,
        qualification: jobData.qualification || 'None',
        activeDays: jobData.activeDays
      });
      
      if (!newJob) {
        toast.error('Failed to create job');
        setShowAddJobModal(false);
        return;
      }
      
      // Then add calendar event
      const eventDate = selectedDate || new Date();
      
      const newEvent = await calendarService.createEvent({
        title: jobData.title,
        description: jobData.description,
        startDate: eventDate,
        endDate: eventDate,
        type: 'Job Posting',
      });
      
      if (newEvent) {
        setEvents([...events, newEvent]);
      }
      
      setShowAddJobModal(false);
      toast.success(`Job posting scheduled for ${format(eventDate, 'MMMM d, yyyy')}`);
    } catch (error) {
      console.error('Error creating job and event:', error);
      toast.error('Failed to create job posting');
    }
  };
  
  const handleSaveCandidate = async (candidateData: any) => {
    try {
      setShowAddCandidateModal(false);
      
      // Add new calendar event for the candidate interview
      const eventDate = selectedDate || new Date();
      
      // Create calendar event
      const newEvent = await calendarService.createEvent({
        title: `New ${candidateData.type === 'cv' ? 'Candidate Interview' : 'Bulk Candidates'}`,
        description: `${candidateData.type === 'cv' ? 'Interview with candidate' : 'Process multiple candidates'} from ${candidateData.file.name}`,
        startDate: eventDate,
        endDate: eventDate,
        type: 'Interview',
      });
      
      if (newEvent) {
        setEvents([...events, newEvent]);
        toast.success(`Candidate ${candidateData.type === 'cv' ? 'interview' : 'processing'} scheduled for ${format(eventDate, 'MMMM d, yyyy')}`);
      }
      
      // Process the candidate files (in a real app, this would involve parsing the CV)
      if (candidateData.type === 'cv' && candidateData.file) {
        // Upload the resume
        const resumeUrl = await candidatesService.uploadResume(candidateData.file);
        
        if (resumeUrl) {
          // Get the first job for demo purposes (in a real app, you'd select a specific job)
          const jobs = await jobsService.getJobs();
          if (jobs.length > 0) {
            const newCandidate = await candidatesService.createCandidate({
              jobId: jobs[0].id,
              name: candidateData.file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              email: `candidate${Date.now()}@example.com`,
              phone: '000-000-0000',
              resumeUrl: resumeUrl,
              appliedDate: new Date().toISOString().split('T')[0],
              status: 'Interview',
              notes: `Uploaded via calendar on ${format(eventDate, 'MMMM d, yyyy')}`,
              rating: 3
            });
            
            if (newCandidate) {
              toast.success('Candidate record created');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing candidate:', error);
      toast.error('Failed to process candidate');
    }
  };
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      // Handle the case where event.startDate might be a string
      const eventDate = typeof event.startDate === 'string' 
        ? parseISO(event.startDate) 
        : event.startDate;
      return isSameDay(eventDate, date);
    });
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'Interview': return 'bg-amber-500 border-amber-600';
      case 'Job Posting': return 'bg-green-500 border-green-600';
      case 'LinkedIn Post': return 'bg-blue-500 border-blue-600';
      case 'Meeting': return 'bg-purple-500 border-purple-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <Header 
          title="Calendar" 
          subtitle="Loading calendar data..."
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary-100 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Header 
        title="Calendar" 
        subtitle="Schedule interviews, job postings, and LinkedIn updates."
      />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <button
          onClick={() => handleAddEvent()}
          className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20"
        >
          <PlusCircle size={18} />
          <span>Add Event</span>
        </button>
      </div>
      
      <div className="glass-card p-6">
        <div className="grid grid-cols-7 gap-4 mb-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="font-medium text-text-100">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day, i) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={i}
                className={`min-h-[100px] p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'border-primary-100 bg-primary-100/5' : 'border-gray-200'}`}
                onClick={() => handleAddEvent(day)}
              >
                <div className="text-right mb-1">
                  <span className={`text-sm ${isToday ? 'font-bold text-primary-100' : 'text-text-200'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div 
                      key={event.id}
                      className={`px-2 py-1 text-xs text-white rounded truncate ${getEventColor(event.type)}`}
                      title={event.title}
                    >
                      {format(
                        typeof event.startDate === 'string' ? parseISO(event.startDate) : event.startDate, 
                        'h:mm a'
                      )} - {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-medium mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events
            .filter(event => {
              const eventDate = typeof event.startDate === 'string' 
                ? parseISO(event.startDate) 
                : event.startDate;
              return eventDate >= new Date();
            })
            .sort((a, b) => {
              const aDate = typeof a.startDate === 'string' ? parseISO(a.startDate) : a.startDate;
              const bDate = typeof b.startDate === 'string' ? parseISO(b.startDate) : b.startDate;
              return aDate.getTime() - bDate.getTime();
            })
            .slice(0, 5)
            .map((event) => (
              <div key={event.id} className="glass-card p-4 flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${getEventColor(event.type)} text-white`}>
                  <CalendarIcon size={20} />
                </div>
                
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="text-sm text-text-200 mt-1">
                    {format(
                      typeof event.startDate === 'string' ? parseISO(event.startDate) : event.startDate, 
                      'MMM d, yyyy - h:mm a'
                    )}
                  </div>
                  <div className="text-sm mt-1">{event.description}</div>
                </div>
              </div>
            ))}
            
          {events.length === 0 && (
            <div className="text-center py-8 text-text-200">
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Event Type Selection Dialog */}
      <Dialog open={isEventTypeDialogOpen} onOpenChange={setIsEventTypeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <Card 
              className="cursor-pointer hover:border-primary-100 transition-colors"
              onClick={() => handleEventTypeSelection('job')}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Add Job Posting</CardTitle>
                <CardDescription>Create a new job posting for your career page</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary-100 transition-colors"
              onClick={() => handleEventTypeSelection('candidate')}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Add Candidate Interview</CardTitle>
                <CardDescription>Schedule an interview with a candidate</CardDescription>
              </CardHeader>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary-100 transition-colors"
              onClick={() => handleEventTypeSelection('linkedin')}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Add LinkedIn Post</CardTitle>
                <CardDescription>Schedule a LinkedIn post to promote your brand</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={showAddJobModal}
        onClose={() => setShowAddJobModal(false)}
        onSave={handleSaveNewJob}
      />

      {/* Add Candidate Modal */}
      <AddCandidateModal
        isOpen={showAddCandidateModal}
        onClose={() => setShowAddCandidateModal(false)}
        onSave={handleSaveCandidate}
      />
    </div>
  );
};

export default Calendar;
