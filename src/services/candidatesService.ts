
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  current_job_title: string;
  linkedin: string;
  years_experience: string;
  skills: string;
  certifications: string;
  companies: string;
  job_titles: string;
  degrees: string;
  graduation_years: string;
  institutions: string;
  ai_rating: number;
  ai_content: string;
  ai_summary: string;
  experience_level: string;
  suitable_role: string;
  timestamp: string;
  source: string;
};

export type CandidateInput = Omit<Candidate, 'id' | 'timestamp'>;

export const candidatesService = {
  // Get all candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching candidates:', err.message);
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Get a candidate by ID
  getCandidateById: async (id: string): Promise<Candidate | null> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching candidate:', err.message);
      toast.error('Failed to load candidate');
      return null;
    }
  },
  
  // Create a new candidate
  createCandidate: async (candidate: CandidateInput): Promise<Candidate | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const candidateData = {
        ...candidate,
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Candidate created successfully');
      return data;
    } catch (err: any) {
      console.error('Error creating candidate:', err.message);
      toast.error('Failed to create candidate');
      return null;
    }
  },
  
  // Update a candidate
  updateCandidate: async (id: string, updates: Partial<Candidate>): Promise<Candidate | null> => {
    try {      
      const candidateData = {
        ...updates,
      };
      
      const { data, error } = await supabase
        .from('candidates')
        .update(candidateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast.success('Candidate updated successfully');
      return data;
    } catch (err: any) {
      console.error('Error updating candidate:', err.message);
      toast.error('Failed to update candidate');
      return null;
    }
  },
  
  // Delete a candidate
  deleteCandidate: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Candidate deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting candidate:', err.message);
      toast.error('Failed to delete candidate');
      return false;
    }
  },
  
  // Upload a resume file
  uploadResume: async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      
      const { error } = await supabase.storage
        .from('cvs')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      const { data } = supabase.storage
        .from('cvs')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (err: any) {
      console.error('Error uploading resume:', err.message);
      toast.error('Failed to upload resume');
      return null;
    }
  },
  
  // Filter candidates by skills
  filterCandidatesBySkills: async (skills: string[]): Promise<Candidate[]> => {
    try {
      // Convert skills array to lowercase for case-insensitive comparison
      const lowercaseSkills = skills.map(skill => skill.toLowerCase());
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Filter candidates whose skills include any of the requested skills (case-insensitive)
      const filteredCandidates = data.filter(candidate => {
        if (!candidate.skills) return false;
        
        const candidateSkills = candidate.skills.toLowerCase();
        return lowercaseSkills.some(skill => candidateSkills.includes(skill));
      });
      
      return filteredCandidates;
    } catch (err: any) {
      console.error('Error filtering candidates:', err.message);
      toast.error('Failed to filter candidates');
      return [];
    }
  },
  
  // Search candidates by name
  searchCandidatesByName: async (query: string): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .ilike('full_name', `%${query}%`);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error searching candidates:', err.message);
      toast.error('Failed to search candidates');
      return [];
    }
  },
  
  // Get candidates by experience level
  getCandidatesByExperience: async (experienceLevel: string): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('experience_level', experienceLevel);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching candidates by experience:', err.message);
      toast.error('Failed to load candidates');
      return [];
    }
  },
  
  // Get top rated candidates
  getTopRatedCandidates: async (limit = 5): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('ai_rating', { ascending: false })
        .limit(limit);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching top rated candidates:', err.message);
      toast.error('Failed to load top candidates');
      return [];
    }
  },
  
  // Get recently added candidates
  getRecentCandidates: async (limit = 5): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
        
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (err: any) {
      console.error('Error fetching recent candidates:', err.message);
      toast.error('Failed to load recent candidates');
      return [];
    }
  }
};
