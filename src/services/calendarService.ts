
import { supabase, CalendarEventRow } from '@/lib/supabase';
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';

// Type definition for frontend usage
export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  type: string;
};

// Convert database row to frontend format
const toCalendarEvent = (row: CalendarEventRow): CalendarEvent => ({
  id: row.id,
  title: row.title,
  description: row.description,
  startDate: row.start_date,
  endDate: row.end_date,
  type: row.type,
});

// Convert frontend data to database format
const toCalendarEventRow = (
  event: Omit<CalendarEvent, 'id'>, 
  userId: string
): Omit<CalendarEventRow, 'id' | 'created_at'> => ({
  title: event.title,
  description: event.description,
  start_date: typeof event.startDate === 'string' 
    ? event.startDate 
    : format(event.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
  end_date: typeof event.endDate === 'string' 
    ? event.endDate 
    : format(event.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
  type: event.type,
  user_id: userId,
});

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
      
      return data.map(toCalendarEvent);
    } catch (err) {
      console.error('Unexpected error fetching calendar events:', err);
      toast.error('Failed to load calendar events');
      return [];
    }
  },
  
  // Create a new calendar event
  createEvent: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent | null> => {
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to create an event');
        return null;
      }
      
      const eventData = toCalendarEventRow(event, userData.user.id);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([eventData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating calendar event:', error);
        toast.error('Failed to create event');
        return null;
      }
      
      toast.success('Event created successfully');
      return toCalendarEvent(data);
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
