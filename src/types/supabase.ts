export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          headline: string | null;
          bio: string | null;
          avatar_url: string | null;
          header_image_url: string | null;
          company: string | null;
          current_position: string | null;
          phone: string | null;
          profile_url: string | null;
          connection_count: number | null;
          follower_count: number | null;
          profile_strength_score: number | null;
          network_score: number | null;
          engagement_score: number | null;
          updated_at: string | null;
          created_at: string | null;
          skills: string[] | null;
          industry: string | null;
          experience_years: number | null;
          ai_summary: string | null;
          ai_insights: Json | null;
          ai_suggestions: Json | null;
          last_analysis_date: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          header_image_url?: string | null;
          company?: string | null;
          current_position?: string | null;
          phone?: string | null;
          profile_url?: string | null;
          connection_count?: number | null;
          follower_count?: number | null;
          profile_strength_score?: number | null;
          network_score?: number | null;
          engagement_score?: number | null;
          updated_at?: string | null;
          created_at?: string | null;
          skills?: string[] | null;
          industry?: string | null;
          experience_years?: number | null;
          ai_summary?: string | null;
          ai_insights?: Json | null;
          ai_suggestions?: Json | null;
          last_analysis_date?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          header_image_url?: string | null;
          company?: string | null;
          current_position?: string | null;
          phone?: string | null;
          profile_url?: string | null;
          connection_count?: number | null;
          follower_count?: number | null;
          profile_strength_score?: number | null;
          network_score?: number | null;
          engagement_score?: number | null;
          updated_at?: string | null;
          skills?: string[] | null;
          industry?: string | null;
          experience_years?: number | null;
          ai_summary?: string | null;
          ai_insights?: Json | null;
          ai_suggestions?: Json | null;
          last_analysis_date?: string | null;
        };
      };
      linkedin_organizations: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          name: string;
          vanity_name: string | null;
          website: string | null;
          description: string | null;
          logo_url: string | null;
          follower_count: number;
          created_at: string;
          last_updated: string;
        };
        Insert: Omit<Database['public']['Tables']['linkedin_organizations']['Row'], 'id' | 'created_at' | 'last_updated'>;
        Update: Partial<Database['public']['Tables']['linkedin_organizations']['Insert']>;
      };
      linkedin_ad_accounts: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          organization_id: string;
          name: string;
          status: string;
          type: string;
          reference: string | null;
          currency: string | null;
          created_at: string;
          last_updated: string;
        };
        Insert: Omit<Database['public']['Tables']['linkedin_ad_accounts']['Row'], 'id' | 'created_at' | 'last_updated'>;
        Update: Partial<Database['public']['Tables']['linkedin_ad_accounts']['Insert']>;
      };
      linkedin_ad_analytics: {
        Row: {
          id: string;
          ad_account_id: string;
          date: string;
          impressions: number;
          clicks: number;
          spend: number;
          conversions: number;
          engagement_rate: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['linkedin_ad_analytics']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['linkedin_ad_analytics']['Insert']>;
      };
      linkedin_organization_analytics: {
        Row: {
          id: string;
          organization_id: string;
          date: string;
          follower_count: number;
          engagement_rate: number;
          post_impressions: number;
          unique_visitors: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['linkedin_organization_analytics']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['linkedin_organization_analytics']['Insert']>;
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string;
          location: string;
          type: string;
          status: string;
          applicants: number;
          posted_date: string;
          technologies: string[];
          workplace_type: string;
          complexity: string;
          qualification: string;
          active_days: number;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      candidates: {
        Row: {
          id: string;
          job_id: string;
          name: string;
          email: string;
          phone: string;
          resume_url: string;
          applied_date: string;
          status: string;
          notes: string;
          rating: number;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['candidates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['candidates']['Insert']>;
      };
      calendar_events: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_date: string;
          end_date: string;
          type: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['calendar_events']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>;
      };
      linkedin_posts: {
        Row: {
          id: string;
          content: string;
          scheduled_date: string | null;
          scheduled_time: string | null;
          posted: boolean;
          niche: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['linkedin_posts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['linkedin_posts']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

export type Json = | string | number | boolean | null | { [key: string]: Json } | Json[]; 