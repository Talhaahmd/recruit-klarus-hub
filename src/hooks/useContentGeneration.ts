import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface PostIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  filter_tags: string[];
  rss_source: string;
  is_copied: boolean;
  created_at: string;
  theme_id: string;
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
  updated_at: string;
  theme_id: string;
  user_id: string;
}

export const useContentGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<PostIdea[]>([]);
  const [posts, setPosts] = useState<AutomatedPost[]>([]);

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
      toast.success("Post ideas generated successfully");
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error("Failed to generate ideas");
    } finally {
      setLoading(false);
    }
  };

  const generateIdeasForAllThemes = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all user themes
      const { data: userThemes, error: themesError } = await supabase
        .from('user_themes')
        .select('theme_id')
        .eq('user_id', user.id);

      if (themesError) throw themesError;

      // Generate ideas for each theme
      const allIdeas: PostIdea[] = [];
      for (const userTheme of userThemes) {
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: {
            action: 'generate_ideas',
            themeId: userTheme.theme_id,
          },
        });

        if (data?.ideas) {
          allIdeas.push(...data.ideas);
        }
      }

      setIdeas(allIdeas);
      toast.success("Post ideas generated for all your themes");
    } catch (error) {
      console.error('Error generating ideas for all themes:', error);
      toast.error("Failed to generate ideas");
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

      toast.success("Post generated successfully");

      return data.post;
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error("Failed to generate post");
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

      toast.success("Post regenerated successfully");

      return data.post;
    } catch (error) {
      console.error('Error regenerating post:', error);
      toast.error("Failed to regenerate post");
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

      toast.success("Post published to LinkedIn successfully");

      return data;
    } catch (error) {
      console.error('Error publishing post:', error);
      toast.error(error.message || "Failed to publish post");
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

      toast.success('Idea copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy idea: ', err);
      toast.error('Failed to copy idea.');
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
      
      // Type assertion to ensure proper typing
      const typedData = (data || []).map(post => ({
        ...post,
        status: post.status as 'draft' | 'reviewing' | 'published'
      }));
      
      setPosts(typedData);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      toast.error('Failed to fetch posts.');
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
      console.error('Error fetching user ideas:', error);
      toast.error('Failed to fetch ideas.');
    }
  };

  return {
    loading,
    ideas,
    posts,
    generateIdeas,
    generateIdeasForAllThemes,
    generatePost,
    regeneratePost,
    publishPost,
    copyIdeaToClipboard,
    fetchUserPosts,
    fetchUserIdeas,
  };
};
