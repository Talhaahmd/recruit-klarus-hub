
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PostIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  filter_tags: string[];
  rss_source: string;
  is_copied: boolean;
  created_at: string;
}

export interface AutomatedPost {
  id: string;
  title: string;
  content: string;
  additional_content?: string;
  status: 'draft' | 'reviewing' | 'published';
  regeneration_count: number;
  max_regenerations: number;
  published_at?: string;
  created_at: string;
}

export const useContentGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [posts, setPosts] = useState<AutomatedPost[]>([]);
  const { toast } = useToast();

  const generateIdeas = async (themeId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          action: 'generate_ideas',
          themeId: themeId,
        },
      });

      if (error) throw error;

      setIdeas(data.ideas || []);
      toast({
        title: "Success",
        description: "Post ideas generated successfully",
      });
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Error",
        description: "Failed to generate ideas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePost = async (themeId: string, additionalContent?: string, customization?: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          action: 'generate_post',
          themeId: themeId,
          additionalContent: additionalContent,
          customization: customization,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post generated successfully",
      });

      return data.post;
    } catch (error) {
      console.error('Error generating post:', error);
      toast({
        title: "Error",
        description: "Failed to generate post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const regeneratePost = async (postId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          action: 'regenerate_post',
          postId: postId,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post regenerated successfully",
      });

      return data.post;
    } catch (error) {
      console.error('Error regenerating post:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async (postId: string, content: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('publish-post', {
        body: {
          postId: postId,
          content: content,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post published to LinkedIn successfully",
      });

      return data;
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish post",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const copyIdeaToClipboard = async (idea: PostIdea) => {
    try {
      await navigator.clipboard.writeText(idea.title);
      
      // Mark as copied in database
      await supabase
        .from('post_ideas')
        .update({ is_copied: true })
        .eq('id', idea.id);

      toast({
        title: "Copied",
        description: "Idea copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy idea",
        variant: "destructive",
      });
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('automated_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUserIdeas = async (themeId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('post_ideas')
        .select('*')
        .eq('user_id', user.id);

      if (themeId) {
        query = query.eq('theme_id', themeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  return {
    loading,
    ideas,
    posts,
    generateIdeas,
    generatePost,
    regeneratePost,
    publishPost,
    copyIdeaToClipboard,
    fetchUserPosts,
    fetchUserIdeas,
  };
};
