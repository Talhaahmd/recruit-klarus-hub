import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

export type SkillAnalysis = Database['public']['Tables']['skill_analyses']['Row'];
export type SkillAnalysisItem = Database['public']['Tables']['skill_analysis_items']['Row'];
export type EmployeeArchetype = Database['public']['Tables']['employee_archetypes']['Row'];
export type SkillCategory = Database['public']['Tables']['skill_categories']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillMap = Database['public']['Tables']['skill_maps']['Row'];

export interface SkillAnalysisRequest {
  cv_text: string;
  job_title?: string;
  industry?: string;
  target_role?: string;
}

export interface SkillAnalysisStats {
  totalAnalyses: number;
  averageOverallScore: number;
  averageTechnicalScore: number;
  averageSoftSkillsScore: number;
  averageLeadershipScore: number;
  averageCreativityScore: number;
  averageAnalyticalScore: number;
  archetypeDistribution: Record<string, number>;
}

export const skillAnalysisService = {
  /**
   * Analyze CV for skills and archetype classification
   */
  async analyzeSkills(request: SkillAnalysisRequest): Promise<SkillAnalysis> {
    try {
      console.log('Submitting CV for skill analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-skills', {
        body: request
      });

      if (error) {
        console.error('Skill analysis error:', error);
        throw new Error(error.message || 'Failed to analyze skills');
      }

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      console.log('Skill analysis completed successfully');
      toast.success('Skill analysis completed successfully!');
      
      return data.analysis;
    } catch (error: any) {
      console.error('Error in skill analysis:', error);
      toast.error('Failed to analyze skills: ' + error.message);
      throw error;
    }
  },

  /**
   * Get all skill analyses for the current user
   */
  async getAnalyses(): Promise<SkillAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('skill_analyses')
        .select(`
          *,
          primary_archetype:employee_archetypes!skill_analyses_primary_archetype_id_fkey(*),
          secondary_archetype:employee_archetypes!skill_analyses_secondary_archetype_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skill analyses:', error);
      toast.error('Failed to fetch skill analyses');
      throw error;
    }
  },

  /**
   * Get a specific skill analysis by ID
   */
  async getAnalysisById(id: string): Promise<SkillAnalysis | null> {
    try {
      const { data, error } = await supabase
        .from('skill_analyses')
        .select(`
          *,
          primary_archetype:employee_archetypes!skill_analyses_primary_archetype_id_fkey(*),
          secondary_archetype:employee_archetypes!skill_analyses_secondary_archetype_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching skill analysis:', error);
      toast.error('Failed to fetch skill analysis');
      throw error;
    }
  },

  /**
   * Get skill analysis items for a specific analysis
   */
  async getAnalysisItems(analysisId: string): Promise<SkillAnalysisItem[]> {
    try {
      const { data, error } = await supabase
        .from('skill_analysis_items')
        .select('*')
        .eq('analysis_id', analysisId)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skill analysis items:', error);
      toast.error('Failed to fetch skill analysis items');
      throw error;
    }
  },

  /**
   * Delete a skill analysis
   */
  async deleteAnalysis(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('skill_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Skill analysis deleted successfully');
    } catch (error) {
      console.error('Error deleting skill analysis:', error);
      toast.error('Failed to delete skill analysis');
      throw error;
    }
  },

  /**
   * Get analysis statistics for the current user
   */
  async getAnalysisStats(): Promise<SkillAnalysisStats> {
    try {
      const { data, error } = await supabase
        .from('skill_analyses')
        .select('*');

      if (error) throw error;

      const analyses = data || [];
      const totalAnalyses = analyses.length;

      if (totalAnalyses === 0) {
        return {
          totalAnalyses: 0,
          averageOverallScore: 0,
          averageTechnicalScore: 0,
          averageSoftSkillsScore: 0,
          averageLeadershipScore: 0,
          averageCreativityScore: 0,
          averageAnalyticalScore: 0,
          archetypeDistribution: {}
        };
      }

      const averageOverallScore = Math.round(
        analyses.reduce((sum, analysis) => sum + (analysis.overall_skill_score || 0), 0) / totalAnalyses
      );

      const averageTechnicalScore = Math.round(
        analyses.reduce((sum, analysis) => sum + (analysis.technical_skills_score || 0), 0) / totalAnalyses
      );

      const averageSoftSkillsScore = Math.round(
        analyses.reduce((sum, analysis) => sum + (analysis.soft_skills_score || 0), 0) / totalAnalyses
      );

      const averageLeadershipScore = Math.round(
        analyses.reduce((sum, analysis) => sum + (analysis.leadership_score || 0), 0) / totalAnalyses
      );

      const averageCreativityScore = Math.round(
        analyses.reduce((sum, analysis) => sum + (analysis.creativity_score || 0), 0) / totalAnalyses
      );

      const averageAnalyticalScore = Math.round(
        analyses.reduce((sum, analysis) => sum + (analysis.analytical_score || 0), 0) / totalAnalyses
      );

      // Calculate archetype distribution
      const archetypeDistribution: Record<string, number> = {};
      analyses.forEach(analysis => {
        if (analysis.primary_archetype_id) {
          archetypeDistribution[analysis.primary_archetype_id] = 
            (archetypeDistribution[analysis.primary_archetype_id] || 0) + 1;
        }
      });

      return {
        totalAnalyses,
        averageOverallScore,
        averageTechnicalScore,
        averageSoftSkillsScore,
        averageLeadershipScore,
        averageCreativityScore,
        averageAnalyticalScore,
        archetypeDistribution
      };
    } catch (error) {
      console.error('Error fetching analysis stats:', error);
      toast.error('Failed to fetch analysis statistics');
      throw error;
    }
  },

  /**
   * Get all employee archetypes
   */
  async getArchetypes(): Promise<EmployeeArchetype[]> {
    try {
      const { data, error } = await supabase
        .from('employee_archetypes')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching archetypes:', error);
      toast.error('Failed to fetch employee archetypes');
      throw error;
    }
  },

  /**
   * Get all skill categories
   */
  async getSkillCategories(): Promise<SkillCategory[]> {
    try {
      const { data, error } = await supabase
        .from('skill_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      toast.error('Failed to fetch skill categories');
      throw error;
    }
  },

  /**
   * Get all skills
   */
  async getSkills(): Promise<Skill[]> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          category:skill_categories(*)
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to fetch skills');
      throw error;
    }
  },

  /**
   * Get skill maps for a specific role and industry
   */
  async getSkillMaps(roleTitle?: string, industry?: string): Promise<SkillMap[]> {
    try {
      let query = supabase.from('skill_maps').select('*');

      if (roleTitle) {
        query = query.eq('role_title', roleTitle);
      }

      if (industry) {
        query = query.eq('industry', industry);
      }

      const { data, error } = await query.order('role_title');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching skill maps:', error);
      toast.error('Failed to fetch skill maps');
      throw error;
    }
  }
};
