import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Theme {
  id: string;
  title: string;
  description: string;
  category: string;
  is_custom: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  details?: any;
  results?: any;
  complexity?: string;
  objectives?: string[];
  audience?: string;
  post_types?: string[];
  sample_posts?: string[];
  purpose_explanation?: string;
  main_topic_explanation?: string;
  background_explanation?: string;
  target_audience_explanation?: string;
  complexity_explanation?: string;
  posts_to_expect_1?: string;
  posts_to_expect_2?: string;
}

// This interface matches the expected input for the Edge Function's themeData
export interface ThemeInputForEdgeFunction {
  title: string;
  description: string;
  category: string;
  audience: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives?: string[];
  post_types?: string[];
  details?: {
    background?: string;
    purpose?: string;
    mainTopic?: string;
    targetAudience?: string;
    complexityLevel?: string;
  };
  background_explanation?: string;
  purpose_explanation?: string;
  main_topic_explanation?: string;
  target_audience_explanation?: string;
  complexity_explanation?: string;
  // user_id will be added by the calling function
}

export interface UserTheme {
  id: string;
  user_id: string;
  theme_id: string;
  added_at: string;
  customization?: any;
  theme: Theme;
}

export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [userThemes, setUserThemes] = useState<UserTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Ensure sample_posts is always an array
      const processedThemes = data?.map(theme => ({
        ...theme,
        sample_posts: Array.isArray(theme.sample_posts) 
          ? theme.sample_posts 
          : typeof theme.sample_posts === 'string' 
            ? [theme.sample_posts] 
            : []
      })) || [];

      setThemes(processedThemes);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to fetch themes');
    }
  };

  const fetchUserThemes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_themes')
        .select(`
          *,
          theme:themes(*)
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (error) throw error;

      // Process the nested theme data to ensure sample_posts is an array
      const processedUserThemes = data?.map(userTheme => ({
        ...userTheme,
        theme: {
          ...userTheme.theme,
          sample_posts: Array.isArray(userTheme.theme.sample_posts) 
            ? userTheme.theme.sample_posts 
            : typeof userTheme.theme.sample_posts === 'string' 
              ? [userTheme.theme.sample_posts] 
              : []
        }
      })) || [];

      setUserThemes(processedUserThemes);
    } catch (error) {
      console.error('Error fetching user themes:', error);
      toast.error('Failed to fetch your themes');
    }
  };

  const addThemeToUser = async (themeId: string, customization?: any): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_themes')
        .upsert(
          {
            user_id: user.id,
            theme_id: themeId,
            customization: customization
          },
          {
            onConflict: 'user_id,theme_id'
          }
        );

      if (error) throw error;

      await fetchUserThemes();
      toast.success('Theme added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding theme:', error);
      toast.error(error.message || 'Failed to add theme');
      return false;
    }
  };

  const removeThemeFromUser = async (userThemeId: string) => {
    try {
      const { error } = await supabase
        .from('user_themes')
        .delete()
        .eq('id', userThemeId);

      if (error) throw error;

      await fetchUserThemes();
      toast.success('Theme removed successfully');
    } catch (error: any) {
      console.error('Error removing theme:', error);
      toast.error(error.message || 'Failed to remove theme');
    }
  };

  const createCustomTheme = async (themeData: Omit<Theme, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('CreateCustomTheme Error: User not authenticated before insert.');
        throw new Error('Not authenticated');
      }

      console.log('CreateCustomTheme: User ID for created_by:', user.id);

      // Convert sample_posts array to proper format for database
      const processedThemeData = {
        title: themeData.title,
        description: themeData.description,
        category: themeData.category,
        complexity: themeData.complexity,
        audience: themeData.audience,
        purpose_explanation: themeData.purpose_explanation,
        main_topic_explanation: themeData.main_topic_explanation,
        background_explanation: themeData.background_explanation,
        target_audience_explanation: themeData.target_audience_explanation,
        complexity_explanation: themeData.complexity_explanation,
        posts_to_expect_1: themeData.posts_to_expect_1,
        posts_to_expect_2: themeData.posts_to_expect_2,
        details: themeData.details,
        results: themeData.results,
        objectives: themeData.objectives,
        post_types: themeData.post_types,
        is_custom: true,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('themes')
        .insert(processedThemeData)
        .select()
        .single();

      if (error) throw error;

      await fetchThemes();
      toast.success('Custom theme created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating custom theme:', error);
      toast.error(error.message || 'Failed to create custom theme');
      throw error;
    }
  };

  const createThemeWithGeneratedPost = async (
    themeDataFromForm: ThemeInputForEdgeFunction
  ): Promise<{ themeId: string; samplePosts: string[] } | null> => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      console.log('[useThemes] User fetched for theme creation:', user);
      console.log('[useThemes] User fetch error (if any): ', userError);

      if (userError || !user) {
        console.error('Error fetching user or user not authenticated:', userError);
        toast.error('You must be logged in to create a theme.');
        return null;
      }
      if (!user.id) { // Explicit check for user.id
        console.error('User object fetched, but user.id is missing or undefined.');
        toast.error('Authentication error: User ID is missing.');
        return null;
      }

      const themeDataForFunction = {
        ...themeDataFromForm,
        user_id: user.id,
      };

      console.log('[useThemes] Payload for generate-theme-post Edge Function:', { themeData: themeDataForFunction });

      const { data, error } = await supabase.functions.invoke('generate-theme-post', {
        body: { themeData: themeDataForFunction },
      });

      if (error) {
        console.error('Error invoking generate-theme-post function:', error);
        toast.error(`Function invocation error: ${error.message}`);
        throw error;
      }

      if (data.error) {
        console.error('Error from generate-theme-post function:', data.error);
        toast.error(`Theme generation error: ${data.error}`);
        throw new Error(data.error);
      }
      
      if (data.themeId && data.samplePosts) {
        toast.success(data.message || 'Theme and post generated successfully!');
        await fetchThemes(); // Refresh the main themes list
        await fetchUserThemes(); // Refresh user-specific themes if applicable
        return { themeId: data.themeId, samplePosts: data.samplePosts };
      } else if (data.theme && data.message) { 
        toast.info(data.message); 
        await fetchThemes();
        await fetchUserThemes();
        return { themeId: data.theme.id, samplePosts: data.theme.sample_posts || [] };
      } else {
        toast.error(data.message || 'Unknown response from theme generation function.');
        throw new Error(data.message || 'Unknown response from function');
      }
    } catch (error: any) {
      console.error('Error in createThemeWithGeneratedPost:', error);
      // Toasting is likely handled by the specific errors above
      // but we ensure an error is thrown to be caught by the calling component.
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchThemes(), fetchUserThemes()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    themes,
    userThemes,
    loading,
    fetchThemes,
    fetchUserThemes,
    addThemeToUser,
    removeThemeFromUser,
    createCustomTheme,
    createThemeWithGeneratedPost
  };
};
