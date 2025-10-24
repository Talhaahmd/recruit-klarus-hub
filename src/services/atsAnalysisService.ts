import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ATSAnalysis {
  id: string;
  user_id: string;
  cv_text: string;
  job_title?: string;
  industry?: string;
  job_description?: string;
  ats_score: number;
  formatting_score: number;
  keyword_density_score: number;
  grammar_score: number;
  quantifiable_results_score: number;
  overall_compatibility_score: number;
  feedback_summary?: string;
  ai_analysis?: any;
  created_at: string;
  updated_at: string;
}

export interface ATSFeedbackItem {
  id: string;
  analysis_id: string;
  category: string;
  issue: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  priority: number;
  created_at: string;
}

export interface ATSAnalysisWithFeedback extends ATSAnalysis {
  feedback_items: ATSFeedbackItem[];
}

export interface JobDescription {
  id: string;
  user_id: string;
  title: string;
  company?: string;
  industry?: string;
  description: string;
  requirements?: string;
  keywords?: string[];
  created_at: string;
  updated_at: string;
}

export interface ATSAnalysisRequest {
  cvText: string;
  jobTitle?: string;
  industry?: string;
  jobDescription?: string;
}

export const atsAnalysisService = {
  // Submit CV for ATS analysis
  analyzeCV: async (request: ATSAnalysisRequest): Promise<ATSAnalysis> => {
    try {
      console.log('Submitting CV for ATS analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-ats', {
        body: request
      });

      if (error) {
        console.error('ATS analysis error:', error);
        throw new Error(error.message || 'Failed to analyze CV');
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      console.log('ATS analysis completed successfully');
      toast.success('CV analysis completed successfully!');
      
      return data.analysis;
    } catch (error: any) {
      console.error('Error in ATS analysis:', error);
      toast.error('Failed to analyze CV: ' + error.message);
      throw error;
    }
  },

  // Get user's analysis history
  getAnalyses: async (): Promise<ATSAnalysis[]> => {
    try {
      const { data, error } = await supabase
        .from('ats_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        throw new Error('Failed to fetch analyses');
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching analyses:', error);
      toast.error('Failed to fetch analyses');
      throw error;
    }
  },

  // Get detailed analysis with feedback
  getAnalysisById: async (id: string): Promise<ATSAnalysisWithFeedback | null> => {
    try {
      // Get analysis
      const { data: analysis, error: analysisError } = await supabase
        .from('ats_analyses')
        .select('*')
        .eq('id', id)
        .single();

      if (analysisError) {
        console.error('Error fetching analysis:', analysisError);
        throw new Error('Failed to fetch analysis');
      }

      if (!analysis) {
        return null;
      }

      // Get feedback items
      const { data: feedbackItems, error: feedbackError } = await supabase
        .from('ats_feedback_items')
        .select('*')
        .eq('analysis_id', id)
        .order('priority', { ascending: false })
        .order('severity', { ascending: false });

      if (feedbackError) {
        console.error('Error fetching feedback items:', feedbackError);
        // Don't throw error, analysis is still valid without feedback
      }

      return {
        ...analysis,
        feedback_items: feedbackItems || []
      };
    } catch (error: any) {
      console.error('Error fetching analysis details:', error);
      toast.error('Failed to fetch analysis details');
      throw error;
    }
  },

  // Delete analysis
  deleteAnalysis: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('ats_analyses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting analysis:', error);
        throw new Error('Failed to delete analysis');
      }

      toast.success('Analysis deleted successfully');
    } catch (error: any) {
      console.error('Error deleting analysis:', error);
      toast.error('Failed to delete analysis');
      throw error;
    }
  },

  // Save job description for future matching
  saveJobDescription: async (jobDescription: Omit<JobDescription, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<JobDescription> => {
    try {
      const { data, error } = await supabase
        .from('job_descriptions')
        .insert(jobDescription)
        .select()
        .single();

      if (error) {
        console.error('Error saving job description:', error);
        throw new Error('Failed to save job description');
      }

      toast.success('Job description saved successfully');
      return data;
    } catch (error: any) {
      console.error('Error saving job description:', error);
      toast.error('Failed to save job description');
      throw error;
    }
  },

  // Get saved job descriptions
  getJobDescriptions: async (): Promise<JobDescription[]> => {
    try {
      const { data, error } = await supabase
        .from('job_descriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job descriptions:', error);
        throw new Error('Failed to fetch job descriptions');
      }

      return data || [];
    } catch (error: any) {
      console.error('Error fetching job descriptions:', error);
      toast.error('Failed to fetch job descriptions');
      throw error;
    }
  },

  // Get analysis statistics
  getAnalysisStats: async (): Promise<{
    totalAnalyses: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    recentAnalyses: ATSAnalysis[];
  }> => {
    try {
      const { data: analyses, error } = await supabase
        .from('ats_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analysis stats:', error);
        throw new Error('Failed to fetch analysis statistics');
      }

      const totalAnalyses = analyses?.length || 0;
      const scores = analyses?.map(a => a.overall_compatibility_score) || [];
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
      const recentAnalyses = analyses?.slice(0, 5) || [];

      return {
        totalAnalyses,
        averageScore: Math.round(averageScore),
        highestScore,
        lowestScore,
        recentAnalyses
      };
    } catch (error: any) {
      console.error('Error fetching analysis stats:', error);
      toast.error('Failed to fetch analysis statistics');
      throw error;
    }
  }
};
