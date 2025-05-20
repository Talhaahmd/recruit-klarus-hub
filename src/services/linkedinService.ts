
import { supabase, LinkedInPostRow } from '@/lib/supabase';
import { toast } from "sonner";

// Type definition for frontend usage
export type LinkedInPost = {
  id: string;
  content: string;
  scheduledDate: Date | string | null;
  scheduledTime: string | null;
  posted: boolean;
  niche: string;
};

// Convert database row to frontend format
const toLinkedInPost = (row: LinkedInPostRow): LinkedInPost => ({
  id: row.id,
  content: row.content,
  scheduledDate: row.scheduled_date,
  scheduledTime: row.scheduled_time,
  posted: row.posted,
  niche: row.niche,
});

// Convert frontend data to database format
const toLinkedInPostRow = (
  post: Omit<LinkedInPost, 'id'>, 
  userId: string
): Omit<LinkedInPostRow, 'id' | 'created_at'> => ({
  content: post.content,
  scheduled_date: post.scheduledDate ? 
    (typeof post.scheduledDate === 'string' ? post.scheduledDate : post.scheduledDate.toISOString().split('T')[0]) : 
    null,
  scheduled_time: post.scheduledTime,
  posted: post.posted || false,
  niche: post.niche,
  user_id: userId,
});

export const linkedinService = {
  // Get all LinkedIn posts for the current user
  getPosts: async (): Promise<LinkedInPost[]> => {
    try {
      const { data, error } = await supabase
        .from('linkedin_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching LinkedIn posts:', error);
        toast.error('Failed to load LinkedIn posts');
        return [];
      }
      
      return data.map(toLinkedInPost);
    } catch (err) {
      console.error('Unexpected error fetching LinkedIn posts:', err);
      toast.error('Failed to load LinkedIn posts');
      return [];
    }
  },
  
  // Create a new LinkedIn post
  createPost: async (post: Omit<LinkedInPost, 'id'>): Promise<LinkedInPost | null> => {
    try {
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to create a LinkedIn post');
        return null;
      }
      
      const postData = toLinkedInPostRow(post, userData.user.id);
      
      const { data, error } = await supabase
        .from('linkedin_posts')
        .insert([postData])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating LinkedIn post:', error);
        toast.error('Failed to create LinkedIn post');
        return null;
      }
      
      toast.success('LinkedIn post created successfully');
      return toLinkedInPost(data);
    } catch (err) {
      console.error('Unexpected error creating LinkedIn post:', err);
      toast.error('Failed to create LinkedIn post');
      return null;
    }
  },
  
  // Mark a LinkedIn post as posted
  markAsPosted: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('linkedin_posts')
        .update({ posted: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating LinkedIn post:', error);
        toast.error('Failed to update LinkedIn post');
        return false;
      }
      
      toast.success('LinkedIn post updated successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error updating LinkedIn post:', err);
      toast.error('Failed to update LinkedIn post');
      return false;
    }
  },
};
