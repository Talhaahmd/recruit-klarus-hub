
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Badge } from '@/components/UI/badge';
import { Plus, Search, Filter, Grid, List, Mail, User, Building, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import { leadsService, type LeadWithLabels, type Label } from '@/services/leadsService';
import { toast } from 'sonner';
import AddLeadModal from './AddLeadModal';
import EmailModal from './EmailModal';
import { useAuth } from '@/contexts/AuthContext';

const Leads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadWithLabels[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emailModal, setEmailModal] = useState<{ isOpen: boolean; lead: LeadWithLabels | null }>({
    isOpen: false,
    lead: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leadsData, labelsData] = await Promise.all([
        leadsService.getLeads(),
        leadsService.getLabels()
      ]);
      setLeads(leadsData);
      setLabels(labelsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load leads data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData: any, labelIds: string[]) => {
    try {
      await leadsService.createLead(leadData, labelIds);
      toast.success('Lead added successfully');
      loadData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadsService.deleteLead(id);
      toast.success('Lead deleted successfully');
      loadData();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLabels = selectedLabels.length === 0 || 
                         selectedLabels.some(labelId => 
                           lead.labels.some(label => label.id === labelId)
                         );
    
    return matchesSearch && matchesLabels;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lead': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Opportunity': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Customer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Leads Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your sales pipeline and track prospects
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['Lead', 'Qualified', 'Opportunity', 'Customer'].map(status => {
          const count = leads.filter(lead => lead.prospect_status === status).length;
          return (
            <Card key={status} className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{status}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex flex-wrap gap-2">
            {labels.map(label => (
              <Badge
                key={label.id}
                variant={selectedLabels.includes(label.id) ? "default" : "outline"}
                className="cursor-pointer"
                style={{ backgroundColor: selectedLabels.includes(label.id) ? label.color : undefined }}
                onClick={() => {
                  setSelectedLabels(prev => 
                    prev.includes(label.id) 
                      ? prev.filter(id => id !== label.id)
                      : [...prev, label.id]
                  );
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Leads Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map(lead => (
            <Card key={lead.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lead.full_name}</CardTitle>
                      <Badge className={getStatusColor(lead.prospect_status)}>
                        {lead.prospect_status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {lead.email && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEmailModal({ isOpen: true, lead })}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteLead(lead.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {lead.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </div>
                )}
                {lead.linkedin_url && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Building className="w-4 h-4" />
                    <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary-100 hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {lead.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {lead.notes}
                  </p>
                )}
                {lead.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {lead.labels.map(label => (
                      <Badge key={label.id} variant="outline" style={{ borderColor: label.color }}>
                        {label.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Labels</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          {lead.full_name}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(lead.prospect_status)}>
                          {lead.prospect_status}
                        </Badge>
                      </td>
                      <td className="p-4">{lead.email || '-'}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {lead.labels.map(label => (
                            <Badge key={label.id} variant="outline" style={{ borderColor: label.color }}>
                              {label.name}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {lead.email && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEmailModal({ isOpen: true, lead })}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || selectedLabels.length > 0 ? 'No leads match your filters' : 'No leads yet. Add your first lead to get started!'}
          </p>
        </div>
      )}

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLead}
        labels={labels}
        onCreateLabel={async (name, color) => {
          const newLabel = await leadsService.createLabel(name, color);
          setLabels(prev => [...prev, newLabel]);
          return newLabel;
        }}
      />

      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, lead: null })}
        lead={emailModal.lead}
        senderName={user?.user_metadata?.full_name || user?.email || 'Klarus HR'}
      />
    </div>
  );
};

export default Leads;
