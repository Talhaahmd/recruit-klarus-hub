import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Theme {
  id: string;
  title: string;
  category: string;
  description: string;
  audience: string;
  objectives: string[];
  post_types: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  results: {
    revenue: string;
    cac: string;
    churn: string;
  };
  details: {
    background: string;
    purpose: string;
    mainTopic: string;
    targetAudience: string;
    complexityLevel: string;
  };
  is_custom: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  sample_posts?: string[]; // Add sample posts for custom themes
}

export interface UserTheme {
  id: string;
  theme_id: string;
  customization?: any;
  added_at: string;
  theme: Theme;
}

export const useThemes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [userThemes, setUserThemes] = useState<UserTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedData = (data || []).map(theme => ({
        ...theme,
        complexity: theme.complexity as 'Beginner' | 'Intermediate' | 'Advanced',
        results: theme.results as { revenue: string; cac: string; churn: string; },
        details: theme.details as { background: string; purpose: string; mainTopic: string; targetAudience: string; complexityLevel: string; }
      }));
      
      setThemes(typedData);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch themes",
        variant: "destructive",
      });
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
      
      // Type assertion to ensure proper typing
      const typedData = (data || []).map(userTheme => ({
        ...userTheme,
        theme: {
          ...userTheme.theme,
          complexity: userTheme.theme.complexity as 'Beginner' | 'Intermediate' | 'Advanced',
          results: userTheme.theme.results as { revenue: string; cac: string; churn: string; },
          details: userTheme.theme.details as { background: string; purpose: string; mainTopic: string; targetAudience: string; complexityLevel: string; }
        }
      }));
      
      setUserThemes(typedData);
    } catch (error) {
      console.error('Error fetching user themes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your themes",
        variant: "destructive",
      });
    }
  };

  const addThemeToCollection = async (themeId: string, customization?: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add themes to your collection",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('user_themes')
        .insert({
          user_id: user.id,
          theme_id: themeId,
          customization: customization || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Theme already added",
            description: "This theme is already in your collection",
            variant: "destructive",
          });
          return false;
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Theme added to your collection",
      });

      await fetchUserThemes();
      return true;
    } catch (error) {
      console.error('Error adding theme:', error);
      toast({
        title: "Error",
        description: "Failed to add theme to collection",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeThemeFromCollection = async (userThemeId: string) => {
    try {
      const { error } = await supabase
        .from('user_themes')
        .delete()
        .eq('id', userThemeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Theme removed from your collection",
      });

      await fetchUserThemes();
      return true;
    } catch (error) {
      console.error('Error removing theme:', error);
      toast({
        title: "Error",
        description: "Failed to remove theme",
        variant: "destructive",
      });
      return false;
    }
  };

  const createCustomTheme = async (themeData: Partial<Theme>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create custom themes",
          variant: "destructive",
        });
        return false;
      }

      // Generate sample posts using ChatGPT
      const { data: samplePostsData, error: postsError } = await supabase.functions.invoke('generate-content', {
        body: {
          action: 'generate_sample_posts',
          themeData: themeData,
        },
      });

      if (postsError) {
        console.error('Error generating sample posts:', postsError);
      }

      const { data, error } = await supabase
        .from('themes')
        .insert({
          title: themeData.title || '',
          category: themeData.category || '',
          description: themeData.description,
          audience: themeData.audience,
          objectives: themeData.objectives,
          post_types: themeData.post_types,
          complexity: themeData.complexity,
          results: themeData.results,
          details: themeData.details,
          is_custom: true,
          created_by: user.id,
          sample_posts: samplePostsData?.posts || [],
        })
        .select()
        .single();

      if (error) throw error;

      // Automatically add the custom theme to user's collection
      await addThemeToCollection(data.id);

      toast({
        title: "Success",
        description: "Custom theme created and added to your collection",
      });

      await fetchThemes();
      return data;
    } catch (error) {
      console.error('Error creating theme:', error);
      toast({
        title: "Error",
        description: "Failed to create custom theme",
        variant: "destructive",
      });
      return false;
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
    addThemeToCollection,
    removeThemeFromCollection,
    createCustomTheme,
    refreshThemes: fetchThemes,
    refreshUserThemes: fetchUserThemes,
  };
};
