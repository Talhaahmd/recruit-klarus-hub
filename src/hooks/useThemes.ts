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
        .insert({
          user_id: user.id,
          theme_id: themeId,
          customization: customization
        });

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
      if (!user) throw new Error('Not authenticated');

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
    createCustomTheme
  };
};
