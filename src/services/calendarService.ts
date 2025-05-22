
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  // Get all events for the current user - RLS will filter automatically
  getEvents: async (): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      return data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: event.start_date,
        endDate: event.end_date,
        type: event.type
      }));
    } catch (err: any) {
      console.error('Error fetching events:', err.message);
      toast.error('Failed to load calendar events');
      return [];
    }
  },
  
  // Create a new event
  createEvent: async (event: CalendarEventInput): Promise<CalendarEvent | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create an event');
        return null;
      }
      
      const eventData = {
        title: event.title,
        description: event.description,
        start_date: typeof event.startDate === 'string' 
          ? event.startDate 
          : event.startDate.toISOString(),
        end_date: typeof event.endDate === 'string' 
          ? event.endDate 
          : event.endDate.toISOString(),
        type: event.type,
        user_id: user.id // This is mapped to created_by via RLS
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([eventData])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        startDate: data.start_date,
        endDate: data.end_date,
        type: data.type
      };
    } catch (err: any) {
      console.error('Error creating event:', err.message);
      toast.error('Failed to create calendar event');
      return null;
    }
  },
  
  // Delete an event - RLS will ensure users can only delete their own events
  deleteEvent: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err: any) {
      console.error('Error deleting event:', err.message);
      toast.error('Failed to delete calendar event');
      return false;
    }
  }
};
