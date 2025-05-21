
import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// Rename the import to prevent naming conflict
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CandidateFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;
  currentJobTitle?: string;
  skills?: string;
  experienceLevel?: string;
  linkedin?: string;
  reset?: () => void;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [range, setRange] = useState<Date | undefined>();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CandidateFormValues>();

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
    setDate(arg.date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const onSubmit = async (formData: CandidateFormValues) => {
    await createCandidate(formData);
  };

  const createCandidate = async (formData: any) => {
    try {
      // Create a complete candidate object with all required properties
      const candidateData: CandidateInput = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        location: formData.location || '',
        current_job_title: formData.currentJobTitle || '',
        skills: formData.skills || '',
        experience_level: formData.experienceLevel || '',
        linkedin: formData.linkedin || '',
        source: 'Calendar',
        // Add all the required properties with default values
        years_experience: '',
        certifications: '',
        companies: '',
        job_titles: '',
        degrees: '',
        graduation_years: '',
        institutions: '',
        ai_rating: 0,
        ai_content: '',
        ai_summary: '',
        suitable_role: '',
        name: `${formData.firstName} ${formData.lastName}`,
        rating: 0,
        notes: '',
        status: 'New',
        applied_date: new Date().toISOString(),
        resume_url: ''
      };

      const savedCandidate = await candidatesService.createCandidate(candidateData);
      
      if (savedCandidate) {
        toast.success('Candidate created successfully');
        // Reset form and close modal
        reset();
        closeModal();
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
      toast.error('Failed to create candidate');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        weekends={true}
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.startDate,
          end: event.endDate,
        }))}
        dateClick={handleDateClick}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              {date ? format(date, "PPP") : 'No date selected'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input id="firstName"  className="col-span-3" {...register("firstName", { required: true })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input id="lastName"  className="col-span-3" {...register("lastName", { required: true })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" className="col-span-3" {...register("email", { required: true })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" type="tel" className="col-span-3" {...register("phone", { required: true })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input id="location" className="col-span-3" {...register("location")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentJobTitle" className="text-right">
                Current Job Title
              </Label>
              <Input id="currentJobTitle" className="col-span-3" {...register("currentJobTitle")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input id="skills" className="col-span-3" {...register("skills")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experienceLevel" className="text-right">
                Experience Level
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select experience level" {...register("experienceLevel")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level</SelectItem>
                  <SelectItem value="Mid Level">Mid Level</SelectItem>
                  <SelectItem value="Senior Level">Senior Level</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                  <SelectItem value="Executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkedin" className="text-right">
                LinkedIn
              </Label>
              <Input id="linkedin" type="url" className="col-span-3" {...register("linkedin")} />
            </div>
            <Button type="submit">Add Candidate</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
