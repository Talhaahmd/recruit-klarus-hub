import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Textarea } from '@/components/UI/textarea';
import { Label } from '@/components/UI/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Badge } from '@/components/UI/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Label as LabelType } from '@/services/leadsService';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: any, labelIds: string[]) => Promise<void>;
  labels: LabelType[];
  onCreateLabel: (name: string, color: string) => Promise<LabelType>;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  labels,
  onCreateLabel
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    prospect_status: 'Lead' as const,
    email: '',
    linkedin_url: '',
    notes: ''
  });
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData, selectedLabels);
      setFormData({
        full_name: '',
        prospect_status: 'Lead',
        email: '',
        linkedin_url: '',
        notes: ''
      });
      setSelectedLabels([]);
    } catch (error) {
      console.error('Error submitting lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) {
      toast.error('Label name is required');
      return;
    }

    try {
      const newLabel = await onCreateLabel(newLabelName.trim(), newLabelColor);
      setSelectedLabels(prev => [...prev, newLabel.id]);
      setNewLabelName('');
      setNewLabelColor('#3B82F6');
      toast.success('Label created successfully');
    } catch (error) {
      console.error('Error creating label:', error);
      toast.error('Failed to create label');
    }
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="prospect_status">Prospect Status</Label>
            <Select
              value={formData.prospect_status}
              onValueChange={(value) => setFormData({ ...formData, prospect_status: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Opportunity">Opportunity</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this lead..."
              rows={3}
            />
          </div>

          <div>
            <Label>Labels</Label>
            <div className="space-y-3">
              {/* Existing Labels */}
              <div className="flex flex-wrap gap-2">
                {labels.map(label => (
                  <Badge
                    key={label.id}
                    variant={selectedLabels.includes(label.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    style={{ 
                      backgroundColor: selectedLabels.includes(label.id) ? label.color : undefined,
                      borderColor: label.color 
                    }}
                    onClick={() => toggleLabel(label.id)}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>

              {/* Create New Label */}
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    placeholder="New label name"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateLabel())}
                  />
                </div>
                <div className="flex gap-1">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-6 h-6 rounded-full border-2 ${
                        newLabelColor === color ? 'border-gray-800 dark:border-white' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewLabelColor(color)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateLabel}
                  disabled={!newLabelName.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadModal;
