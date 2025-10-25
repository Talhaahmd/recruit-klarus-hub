import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

export type LearningPath = Database['public']['Tables']['learning_paths']['Row'];
export type LearningPathItem = Database['public']['Tables']['learning_path_items']['Row'];
export type LearningProgress = Database['public']['Tables']['learning_progress']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type CourseCategory = Database['public']['Tables']['course_categories']['Row'];
export type LearningResource = Database['public']['Tables']['learning_resources']['Row'];

export interface LearningPathRequest {
  skill_gaps: string[];
  target_role?: string;
  industry?: string;
  experience_level?: string;
  time_commitment?: string;
  learning_goals?: string[];
}

export interface LearningPathStats {
  totalPaths: number;
  completedPaths: number;
  inProgressPaths: number;
  totalHoursCompleted: number;
  averageProgress: number;
  topSkillsLearned: string[];
}

export const learningPathService = {
  /**
   * Generate a personalized learning path based on skill gaps
   */
  async generateLearningPath(request: LearningPathRequest): Promise<LearningPath> {
    try {
      console.log('Generating learning path...');
      console.log('Request:', request);
      
      const { data, error } = await supabase.functions.invoke('generate-learning-path', {
        body: request
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Learning path generation error:', error);
        const errorMessage = error.message || error.toString() || 'Failed to generate learning path';
        toast.error('Generation error: ' + errorMessage);
        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error('No data received from function');
      }

      if (!data.success) {
        const errorMsg = data.error || 'Learning path generation failed';
        console.error('Generation not successful:', errorMsg);
        toast.error('Generation failed: ' + errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Learning path generated successfully');
      toast.success('Learning path generated successfully!');
      
      return data.learning_path;
    } catch (error: any) {
      console.error('Error in learning path generation:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast.error('Failed to generate learning path: ' + (error.message || 'Unknown error'));
      throw error;
    }
  },

  /**
   * Get all learning paths for the current user
   */
  async getLearningPaths(): Promise<LearningPath[]> {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      toast.error('Failed to fetch learning paths');
      throw error;
    }
  },

  /**
   * Get a specific learning path by ID
   */
  async getLearningPathById(id: string): Promise<LearningPath | null> {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          *,
          learning_path_items(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching learning path:', error);
      toast.error('Failed to fetch learning path');
      throw error;
    }
  },

  /**
   * Get learning path items for a specific path
   */
  async getLearningPathItems(pathId: string): Promise<LearningPathItem[]> {
    try {
      const { data, error } = await supabase
        .from('learning_path_items')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('path_id', pathId)
        .order('order_index');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning path items:', error);
      toast.error('Failed to fetch learning path items');
      throw error;
    }
  },

  /**
   * Update learning path progress
   */
  async updateProgress(
    pathId: string, 
    itemId: string, 
    progress: Partial<LearningProgress>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          path_id: pathId,
          item_id: itemId,
          ...progress
        });

      if (error) throw error;
      toast.success('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
      throw error;
    }
  },

  /**
   * Delete a learning path
   */
  async deleteLearningPath(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('learning_paths')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Learning path deleted successfully');
    } catch (error) {
      console.error('Error deleting learning path:', error);
      toast.error('Failed to delete learning path');
      throw error;
    }
  },

  /**
   * Get learning path statistics
   */
  async getLearningPathStats(): Promise<LearningPathStats> {
    try {
      const { data: paths, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*');

      if (pathsError) throw pathsError;

      const { data: progress, error: progressError } = await supabase
        .from('learning_progress')
        .select('*');

      if (progressError) throw progressError;

      const totalPaths = paths?.length || 0;
      const completedPaths = paths?.filter(p => p.status === 'completed').length || 0;
      const inProgressPaths = paths?.filter(p => p.status === 'active').length || 0;
      
      const totalHoursCompleted = progress?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) / 60 || 0;
      const averageProgress = totalPaths > 0 ? 
        Math.round(paths.reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / totalPaths) : 0;

      // Extract top skills learned from completed items
      const topSkillsLearned = progress
        ?.filter(p => p.completed_at)
        .flatMap(p => p.feedback?.split(',').map(s => s.trim()) || [])
        .filter(Boolean) || [];

      return {
        totalPaths,
        completedPaths,
        inProgressPaths,
        totalHoursCompleted: Math.round(totalHoursCompleted),
        averageProgress,
        topSkillsLearned: [...new Set(topSkillsLearned)].slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching learning path stats:', error);
      toast.error('Failed to fetch learning path statistics');
      throw error;
    }
  },

  /**
   * Get all courses
   */
  async getCourses(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          category:course_categories(*)
        `)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
      throw error;
    }
  },

  /**
   * Get courses by category
   */
  async getCoursesByCategory(categoryId: string): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          category:course_categories(*)
        `)
        .eq('category_id', categoryId)
        .order('rating', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      toast.error('Failed to fetch courses by category');
      throw error;
    }
  },

  /**
   * Get all course categories
   */
  async getCourseCategories(): Promise<CourseCategory[]> {
    try {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching course categories:', error);
      toast.error('Failed to fetch course categories');
      throw error;
    }
  },

  /**
   * Get learning resources
   */
  async getLearningResources(): Promise<LearningResource[]> {
    try {
      const { data, error } = await supabase
        .from('learning_resources')
        .select(`
          *,
          category:course_categories(*)
        `)
        .order('title');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      toast.error('Failed to fetch learning resources');
      throw error;
    }
  },

  /**
   * Search courses and resources
   */
  async searchLearningContent(query: string): Promise<{
    courses: Course[];
    resources: LearningResource[];
  }> {
    try {
      const [coursesResult, resourcesResult] = await Promise.all([
        supabase
          .from('courses')
          .select(`
            *,
            category:course_categories(*)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,skills_covered.cs.{${query}}`)
          .order('rating', { ascending: false }),
        
        supabase
          .from('learning_resources')
          .select(`
            *,
            category:course_categories(*)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,skills_covered.cs.{${query}}`)
          .order('title')
      ]);

      if (coursesResult.error) throw coursesResult.error;
      if (resourcesResult.error) throw resourcesResult.error;

      return {
        courses: coursesResult.data || [],
        resources: resourcesResult.data || []
      };
    } catch (error) {
      console.error('Error searching learning content:', error);
      toast.error('Failed to search learning content');
      throw error;
    }
  }
};
