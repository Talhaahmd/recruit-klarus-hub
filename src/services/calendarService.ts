
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  type: string;
};

type CalendarEventInput = Omit<CalendarEvent, 'id'>;

export const calendarService = {
  // Get all calendar events for the current user
  getEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });
        
      if (error) {
        console.error('Error fetching calendar events:', error);
        toast.error('Failed to load calendar events');
        return [];
      }
      
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.start_date,
        endDate: event.end_date,
        type: event.type
      }));
    } catch (err) {
      console.error('Unexpected error fetching calendar events:', err);
      toast.error('Failed to load calendar events');
      return [];
    }
  },
  
  // Create a new calendar event
  createEvent: async (event: CalendarEventInput): Promise<CalendarEvent | null> => {
    try {
      const { user } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create an event');
        return null;
      }
      
      const eventData = {
        title: event.title,
        description: event.description,
        start_date: typeof event.startDate === 'string' 
          ? event.startDate 
          : format(event.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
        end_date: typeof event.endDate === 'string' 
          ? event.endDate 
          : format(event.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
        type: event.type,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(eventData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating calendar event:', error);
        toast.error('Failed to create event');
        return null;
      }
      
      toast.success('Event created successfully');
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        type: data.type
      };
    } catch (err) {
      console.error('Unexpected error creating calendar event:', err);
      toast.error('Failed to create event');
      return null;
    }
  },
  
  // Delete a calendar event
  deleteEvent: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting calendar event:', error);
        toast.error('Failed to delete event');
        return false;
      }
      
      toast.success('Event deleted successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error deleting calendar event:', err);
      toast.error('Failed to delete event');
      return false;
    }
  },
};
