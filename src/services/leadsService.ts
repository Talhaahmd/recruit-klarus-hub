
import { supabase } from '@/integrations/supabase/client';

export interface Lead {
  id: string;
  user_id: string;
  full_name: string;
  prospect_status: 'Lead' | 'Qualified' | 'Opportunity' | 'Customer';
  email?: string;
  linkedin_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface LeadWithLabels extends Lead {
  labels: Label[];
}

export const leadsService = {
  // Leads operations
  async getLeads(): Promise<LeadWithLabels[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        lead_labels!inner(
          labels(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(lead => ({
      ...lead,
      labels: lead.lead_labels?.map((ll: any) => ll.labels) || []
    })) || [];
  },

  async createLead(lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>, labelIds: string[]): Promise<Lead> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...lead,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Add labels
    if (labelIds.length > 0) {
      const labelInserts = labelIds.map(labelId => ({
        lead_id: data.id,
        label_id: labelId
      }));

      const { error: labelError } = await supabase
        .from('lead_labels')
        .insert(labelInserts);

      if (labelError) throw labelError;
    }

    return data;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Labels operations
  async getLabels(): Promise<Label[]> {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createLabel(name: string, color: string): Promise<Label> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('labels')
      .insert({
        name,
        color,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLabel(id: string): Promise<void> {
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
