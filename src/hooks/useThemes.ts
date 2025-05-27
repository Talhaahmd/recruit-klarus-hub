
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
      setThemes(data || []);
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
      setUserThemes(data || []);
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
        if (error.code === '23505') { // Unique constraint violation
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

      const { data, error } = await supabase
        .from('themes')
        .insert({
          ...themeData,
          is_custom: true,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom theme created successfully",
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
