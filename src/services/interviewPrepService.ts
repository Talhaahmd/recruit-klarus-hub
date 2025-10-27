import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface InterviewGameplan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_role: string;
  company_type?: string;
  industry?: string;
  experience_level: string;
  question_count: number;
  difficulty_level: string;
  focus_areas: string[];
  ai_analysis?: any;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestionItem {
  id: string;
  question_set_id: string;
  question_text: string;
  question_type: string;
  difficulty_level: string;
  order_index: number;
  sample_answer: string;
  answer_explanation: string;
  key_points: string[];
  follow_up_questions: string[];
  created_at: string;
}

export interface InterviewPracticeSession {
  id: string;
  user_id: string;
  question_set_id: string;
  session_name?: string;
  practice_mode: string;
  total_questions: number;
  completed_questions: number;
  time_spent_minutes: number;
  overall_score?: number;
  feedback_summary?: string;
  strengths?: string[];
  improvement_areas?: string[];
  status: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewPracticeResponse {
  id: string;
  session_id: string;
  question_item_id: string;
  user_response?: string;
  response_time_seconds?: number;
  self_rating?: number;
  ai_feedback?: string;
  strengths_identified?: string[];
  improvement_suggestions?: string[];
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface InterviewCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  created_at: string;
}

export interface InterviewResource {
  id: string;
  title: string;
  description?: string;
  url: string;
  resource_type: string;
  category_id?: string;
  difficulty_level?: string;
  duration_minutes?: number;
  is_free: boolean;
  skills_covered?: string[];
  target_roles?: string[];
  created_at: string;
}

export interface InterviewStats {
  totalGameplans: number;
  totalSessions: number;
  averageScore: number;
  completedSessions: number;
}

class InterviewPrepService {
  // Generate Interview Gameplan
  async generateInterviewGameplan(data: {
    target_role: string;
    company_type?: string;
    industry?: string;
    experience_level?: string;
    question_count?: number;
    focus_areas?: string[];
    difficulty_level?: string;
  }): Promise<InterviewGameplan> {
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-interview-gameplan', {
        body: data
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate interview gameplan');
      }

      toast.success('Interview gameplan generated successfully!');
      return result.interview_gameplan;
    } catch (error) {
      console.error('Interview gameplan generation error:', error);
      toast.error('Failed to generate interview gameplan');
      throw error;
    }
  }

  // Get Interview Gameplans
  async getInterviewGameplans(): Promise<InterviewGameplan[]> {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching interview gameplans:', error);
      throw error;
    }
  }

  // Get Interview Gameplan by ID
  async getInterviewGameplanById(id: string): Promise<InterviewGameplan> {
    try {
      const { data, error } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching interview gameplan:', error);
      throw error;
    }
  }

  // Get Interview Question Items
  async getInterviewQuestionItems(gameplanId: string): Promise<InterviewQuestionItem[]> {
    try {
      const { data, error } = await supabase
        .from('interview_question_items')
        .select('*')
        .eq('question_set_id', gameplanId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching interview question items:', error);
      throw error;
    }
  }

  // Create Practice Session
  async createPracticeSession(data: {
    question_set_id: string;
    session_name?: string;
    practice_mode?: string;
  }): Promise<InterviewPracticeSession> {
    try {
      const { data: result, error } = await supabase
        .from('interview_practice_sessions')
        .insert({
          question_set_id: data.question_set_id,
          session_name: data.session_name,
          practice_mode: data.practice_mode || 'self_practice',
          total_questions: 0, // Will be updated when questions are loaded
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating practice session:', error);
      throw error;
    }
  }

  // Get Practice Sessions
  async getPracticeSessions(): Promise<InterviewPracticeSession[]> {
    try {
      const { data, error } = await supabase
        .from('interview_practice_sessions')
        .select(`
          *,
          interview_questions (
            title,
            target_role,
            difficulty_level
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
      throw error;
    }
  }

  // Update Practice Session
  async updatePracticeSession(id: string, updates: Partial<InterviewPracticeSession>): Promise<void> {
    try {
      const { error } = await supabase
        .from('interview_practice_sessions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating practice session:', error);
      throw error;
    }
  }

  // Submit Practice Response
  async submitPracticeResponse(data: {
    session_id: string;
    question_item_id: string;
    user_response: string;
    response_time_seconds: number;
    self_rating: number;
  }): Promise<InterviewPracticeResponse> {
    try {
      const { data: result, error } = await supabase
        .from('interview_practice_responses')
        .insert({
          session_id: data.session_id,
          question_item_id: data.question_item_id,
          user_response: data.user_response,
          response_time_seconds: data.response_time_seconds,
          self_rating: data.self_rating,
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error submitting practice response:', error);
      throw error;
    }
  }

  // Get Practice Responses
  async getPracticeResponses(sessionId: string): Promise<InterviewPracticeResponse[]> {
    try {
      const { data, error } = await supabase
        .from('interview_practice_responses')
        .select(`
          *,
          interview_question_items (
            question_text,
            question_type,
            difficulty_level
          )
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching practice responses:', error);
      throw error;
    }
  }

  // Delete Interview Gameplan
  async deleteInterviewGameplan(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('interview_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Interview gameplan deleted successfully');
    } catch (error) {
      console.error('Error deleting interview gameplan:', error);
      toast.error('Failed to delete interview gameplan');
      throw error;
    }
  }

  // Get Interview Stats
  async getInterviewStats(): Promise<InterviewStats> {
    try {
      const { data: gameplans } = await supabase
        .from('interview_questions')
        .select('id');

      const { data: sessions } = await supabase
        .from('interview_practice_sessions')
        .select('overall_score, status');

      const completedSessions = sessions?.filter(s => s.status === 'completed') || [];
      const averageScore = completedSessions.length > 0 
        ? completedSessions.reduce((sum, s) => sum + (s.overall_score || 0), 0) / completedSessions.length
        : 0;

      return {
        totalGameplans: gameplans?.length || 0,
        totalSessions: sessions?.length || 0,
        averageScore: Math.round(averageScore),
        completedSessions: completedSessions.length
      };
    } catch (error) {
      console.error('Error fetching interview stats:', error);
      throw error;
    }
  }

  // Get Interview Categories
  async getInterviewCategories(): Promise<InterviewCategory[]> {
    try {
      const { data, error } = await supabase
        .from('interview_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching interview categories:', error);
      throw error;
    }
  }

  // Get Interview Resources
  async getInterviewResources(): Promise<InterviewResource[]> {
    try {
      const { data, error } = await supabase
        .from('interview_resources')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching interview resources:', error);
      throw error;
    }
  }

  // Search Interview Content
  async searchInterviewContent(query: string): Promise<{
    gameplans: InterviewGameplan[];
    resources: InterviewResource[];
  }> {
    try {
      const [gameplans, resources] = await Promise.all([
        supabase
          .from('interview_questions')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,target_role.ilike.%${query}%`)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('interview_resources')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .order('title', { ascending: true })
      ]);

      return {
        gameplans: gameplans.data || [],
        resources: resources.data || []
      };
    } catch (error) {
      console.error('Error searching interview content:', error);
      throw error;
    }
  }
}

export const interviewPrepService = new InterviewPrepService();
