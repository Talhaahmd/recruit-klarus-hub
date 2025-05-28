export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_interviews: {
        Row: {
          ai_rating: number | null
          call_status: string | null
          candidate_id: string
          candidate_name: string
          candidate_phone: string
          communication_score: number | null
          created_at: string | null
          cultural_fit_score: number | null
          id: string
          interview_summary: string | null
          recommendation: string | null
          recording_url: string | null
          role: string
          technical_skills: Json | null
          transcript: string | null
          updated_at: string | null
          vapi_call_id: string | null
        }
        Insert: {
          ai_rating?: number | null
          call_status?: string | null
          candidate_id: string
          candidate_name: string
          candidate_phone: string
          communication_score?: number | null
          created_at?: string | null
          cultural_fit_score?: number | null
          id?: string
          interview_summary?: string | null
          recommendation?: string | null
          recording_url?: string | null
          role: string
          technical_skills?: Json | null
          transcript?: string | null
          updated_at?: string | null
          vapi_call_id?: string | null
        }
        Update: {
          ai_rating?: number | null
          call_status?: string | null
          candidate_id?: string
          candidate_name?: string
          candidate_phone?: string
          communication_score?: number | null
          created_at?: string | null
          cultural_fit_score?: number | null
          id?: string
          interview_summary?: string | null
          recommendation?: string | null
          recording_url?: string | null
          role?: string
          technical_skills?: Json | null
          transcript?: string | null
          updated_at?: string | null
          vapi_call_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          is_active: boolean | null
          key_name: string
          last_used: string | null
          permissions: string[] | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name: string
          last_used?: string | null
          permissions?: string[] | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string
          last_used?: string | null
          permissions?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      automated_posts: {
        Row: {
          additional_content: string | null
          content: string | null
          created_at: string | null
          id: string
          max_regenerations: number | null
          published_at: string | null
          regeneration_count: number | null
          status: string | null
          theme_id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_content?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          max_regenerations?: number | null
          published_at?: string | null
          regeneration_count?: number | null
          status?: string | null
          theme_id: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_content?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          max_regenerations?: number | null
          published_at?: string | null
          regeneration_count?: number | null
          status?: string | null
          theme_id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automated_posts_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string | null
          description: string
          end_date: string
          id: string
          start_date: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          start_date: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          start_date?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      candidate_applications: {
        Row: {
          created_at: string | null
          created_by: string | null
          cv_url: string
          id: string
          job_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cv_url: string
          id?: string
          job_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cv_url?: string
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_cvs: {
        Row: {
          applicant_email: string | null
          applicant_name: string | null
          application_date: string | null
          created_at: string | null
          cv_file_name: string
          cv_file_size: number | null
          cv_file_type: string | null
          cv_file_url: string
          id: string
          job_id: string
          notes: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applicant_email?: string | null
          applicant_name?: string | null
          application_date?: string | null
          created_at?: string | null
          cv_file_name: string
          cv_file_size?: number | null
          cv_file_type?: string | null
          cv_file_url: string
          id?: string
          job_id: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applicant_email?: string | null
          applicant_name?: string | null
          application_date?: string | null
          created_at?: string | null
          cv_file_name?: string
          cv_file_size?: number | null
          cv_file_type?: string | null
          cv_file_url?: string
          id?: string
          job_id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_cvs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_interviews: {
        Row: {
          candidate_email: string | null
          candidate_id: string
          candidate_name: string | null
          created_at: string | null
          created_by: string | null
          email_sent: boolean | null
          id: string
          interview_date: string
          interview_notes: string | null
          interview_time: string | null
          job_name: string | null
        }
        Insert: {
          candidate_email?: string | null
          candidate_id: string
          candidate_name?: string | null
          created_at?: string | null
          created_by?: string | null
          email_sent?: boolean | null
          id?: string
          interview_date: string
          interview_notes?: string | null
          interview_time?: string | null
          job_name?: string | null
        }
        Update: {
          candidate_email?: string | null
          candidate_id?: string
          candidate_name?: string | null
          created_at?: string | null
          created_by?: string | null
          email_sent?: boolean | null
          id?: string
          interview_date?: string
          interview_notes?: string | null
          interview_time?: string | null
          job_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          ai_content: string | null
          ai_rating: number | null
          ai_summary: string | null
          certifications: string | null
          companies: string | null
          current_job_title: string | null
          degrees: string | null
          email: string | null
          experience_level: string | null
          full_name: string | null
          graduation_years: string | null
          id: string
          institutions: string | null
          job_id: string | null
          job_titles: string | null
          linkedin: string | null
          location: string | null
          phone: string | null
          skills: string | null
          source: string | null
          suitable_role: string | null
          timestamp: string | null
          years_experience: string | null
        }
        Insert: {
          ai_content?: string | null
          ai_rating?: number | null
          ai_summary?: string | null
          certifications?: string | null
          companies?: string | null
          current_job_title?: string | null
          degrees?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          graduation_years?: string | null
          id?: string
          institutions?: string | null
          job_id?: string | null
          job_titles?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          skills?: string | null
          source?: string | null
          suitable_role?: string | null
          timestamp?: string | null
          years_experience?: string | null
        }
        Update: {
          ai_content?: string | null
          ai_rating?: number | null
          ai_summary?: string | null
          certifications?: string | null
          companies?: string | null
          current_job_title?: string | null
          degrees?: string | null
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          graduation_years?: string | null
          id?: string
          institutions?: string | null
          job_id?: string | null
          job_titles?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          skills?: string | null
          source?: string | null
          suitable_role?: string | null
          timestamp?: string | null
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          created_at: string | null
          created_by: string | null
          cv_link: string | null
          id: string
          job_id: string | null
          job_name: string | null
          link_for_cv: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cv_link?: string | null
          id?: string
          job_id?: string | null
          job_name?: string | null
          link_for_cv?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cv_link?: string | null
          id?: string
          job_id?: string | null
          job_name?: string | null
          link_for_cv?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          active_days: number
          applicants: number
          created_at: string | null
          created_by: string | null
          description: string
          id: string
          location: string
          posted_date: string
          status: string
          technologies: string[]
          title: string
          type: string
          user_id: string | null
          workplace_type: string
        }
        Insert: {
          active_days?: number
          applicants?: number
          created_at?: string | null
          created_by?: string | null
          description: string
          id?: string
          location: string
          posted_date?: string
          status?: string
          technologies?: string[]
          title: string
          type: string
          user_id?: string | null
          workplace_type: string
        }
        Update: {
          active_days?: number
          applicants?: number
          created_at?: string | null
          created_by?: string | null
          description?: string
          id?: string
          location?: string
          posted_date?: string
          status?: string
          technologies?: string[]
          title?: string
          type?: string
          user_id?: string | null
          workplace_type?: string
        }
        Relationships: []
      }
      labels: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_labels: {
        Row: {
          id: string
          label_id: string
          lead_id: string
        }
        Insert: {
          id?: string
          label_id: string
          lead_id: string
        }
        Update: {
          id?: string
          label_id?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_labels_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_labels_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          notes: string | null
          prospect_status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          prospect_status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          prospect_status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      linkedin_posts: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          niche: string
          posted: boolean | null
          scheduled_date: string | null
          scheduled_time: string | null
          tone: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          niche: string
          posted?: boolean | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          tone?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          niche?: string
          posted?: boolean | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          tone?: string
          user_id?: string
        }
        Relationships: []
      }
      linkedin_tokens: {
        Row: {
          access_token: string
          expires_at: string | null
          linkedin_id: string
          user_id: string
        }
        Insert: {
          access_token: string
          expires_at?: string | null
          linkedin_id: string
          user_id: string
        }
        Update: {
          access_token?: string
          expires_at?: string | null
          linkedin_id?: string
          user_id?: string
        }
        Relationships: []
      }
      post_ideas: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          filter_tags: string[] | null
          id: string
          is_copied: boolean | null
          rss_source: string | null
          theme_id: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          filter_tags?: string[] | null
          id?: string
          is_copied?: boolean | null
          rss_source?: string | null
          theme_id: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          filter_tags?: string[] | null
          id?: string
          is_copied?: boolean | null
          rss_source?: string | null
          theme_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_ideas_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      post_ideas_enhanced: {
        Row: {
          content_type: string | null
          created_at: string | null
          generated_post: string | null
          id: string
          theme_id: string
          title: string
          tone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          generated_post?: string | null
          id?: string
          theme_id: string
          title: string
          tone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          generated_post?: string | null
          id?: string
          theme_id?: string
          title?: string
          tone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_insights: Json | null
          ai_suggestions: Json | null
          ai_summary: string | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          company_contact: string | null
          connection_count: number | null
          created_at: string | null
          current_position: string | null
          engagement_score: number | null
          experience_years: number | null
          follower_count: number | null
          full_name: string | null
          header_image_url: string | null
          headline: string | null
          id: string
          industry: string | null
          last_analysis_date: string | null
          network_score: number | null
          phone: string | null
          profile_strength_score: number | null
          profile_url: string | null
          skills: string[] | null
          updated_at: string | null
        }
        Insert: {
          ai_insights?: Json | null
          ai_suggestions?: Json | null
          ai_summary?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          company_contact?: string | null
          connection_count?: number | null
          created_at?: string | null
          current_position?: string | null
          engagement_score?: number | null
          experience_years?: number | null
          follower_count?: number | null
          full_name?: string | null
          header_image_url?: string | null
          headline?: string | null
          id: string
          industry?: string | null
          last_analysis_date?: string | null
          network_score?: number | null
          phone?: string | null
          profile_strength_score?: number | null
          profile_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ai_insights?: Json | null
          ai_suggestions?: Json | null
          ai_summary?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          company_contact?: string | null
          connection_count?: number | null
          created_at?: string | null
          current_position?: string | null
          engagement_score?: number | null
          experience_years?: number | null
          follower_count?: number | null
          full_name?: string | null
          header_image_url?: string | null
          headline?: string | null
          id?: string
          industry?: string | null
          last_analysis_date?: string | null
          network_score?: number | null
          phone?: string | null
          profile_strength_score?: number | null
          profile_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      themes: {
        Row: {
          audience: string | null
          background_explanation: string | null
          category: string
          complexity: string | null
          complexity_explanation: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          details: Json | null
          id: string
          is_custom: boolean | null
          main_topic_explanation: string | null
          objectives: string[] | null
          post_types: string[] | null
          posts_to_expect_1: string | null
          posts_to_expect_2: string | null
          purpose_explanation: string | null
          results: Json | null
          sample_posts: string | null
          target_audience_explanation: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          audience?: string | null
          background_explanation?: string | null
          category: string
          complexity?: string | null
          complexity_explanation?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          is_custom?: boolean | null
          main_topic_explanation?: string | null
          objectives?: string[] | null
          post_types?: string[] | null
          posts_to_expect_1?: string | null
          posts_to_expect_2?: string | null
          purpose_explanation?: string | null
          results?: Json | null
          sample_posts?: string | null
          target_audience_explanation?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          audience?: string | null
          background_explanation?: string | null
          category?: string
          complexity?: string | null
          complexity_explanation?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          details?: Json | null
          id?: string
          is_custom?: boolean | null
          main_topic_explanation?: string | null
          objectives?: string[] | null
          post_types?: string[] | null
          posts_to_expect_1?: string | null
          posts_to_expect_2?: string | null
          purpose_explanation?: string | null
          results?: Json | null
          sample_posts?: string | null
          target_audience_explanation?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_themes: {
        Row: {
          added_at: string | null
          customization: Json | null
          id: string
          theme_id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          customization?: Json | null
          id?: string
          theme_id: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          customization?: Json | null
          id?: string
          theme_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      decrement_job_applicants: {
        Args: { job_id: string }
        Returns: undefined
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: unknown
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: unknown
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: unknown
      }
      http_head: {
        Args: { uri: string }
        Returns: unknown
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: unknown
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: unknown
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: unknown
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      increment_job_applicants: {
        Args: { job_id: string }
        Returns: undefined
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
