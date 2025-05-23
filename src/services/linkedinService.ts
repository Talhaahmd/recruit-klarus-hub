
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type LinkedInPost = {
  id: string;
  content: string;
  scheduled_date: Date | string | null;
  scheduled_time: string | null;
  posted: boolean;
  niche: string;
  tone: string;
  user_id?: string;
  created_by?: string;
};

type LinkedInPostInput = Omit<LinkedInPost, 'id' | 'posted'>;

export const linkedinService = {
  // Get all LinkedIn posts for the current user - RLS will filter automatically
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
      
      return data.map(post => ({
        id: post.id,
        content: post.content,
        scheduled_date: post.scheduled_date,
        scheduled_time: post.scheduled_time,
        posted: post.posted,
        niche: post.niche,
        tone: post.tone || 'Professional',
        user_id: post.user_id,
        created_by: post.created_by
      }));
    } catch (err) {
      console.error('Unexpected error fetching LinkedIn posts:', err);
      toast.error('Failed to load LinkedIn posts');
      return [];
    }
  },
  
  // Create a new LinkedIn post
  createPost: async (post: LinkedInPostInput): Promise<LinkedInPost | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create a post');
        return null;
      }
      
      const postData = {
        content: post.content,
        scheduled_date: post.scheduled_date ? 
          (typeof post.scheduled_date === 'string' ? post.scheduled_date : post.scheduled_date.toISOString().split('T')[0]) : 
          null,
        scheduled_time: post.scheduled_time,
        niche: post.niche,
        tone: post.tone || 'Professional',
        user_id: user.id, 
        created_by: user.id, // Add created_by field for RLS
        posted: false
      };
      
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
      return {
        id: data.id,
        content: data.content,
        scheduled_date: data.scheduled_date,
        scheduled_time: data.scheduled_time,
        posted: data.posted,
        niche: data.niche,
        tone: data.tone,
        user_id: data.user_id,
        created_by: data.created_by
      };
    } catch (err) {
      console.error('Unexpected error creating LinkedIn post:', err);
      toast.error('Failed to create LinkedIn post');
      return null;
    }
  },
  
  // Mark a LinkedIn post as posted - RLS will ensure users can only update their own posts
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
  }
};
