
import React from 'react';
import { Candidate } from '@/services/candidatesService';
import { Mail, Phone, Edit, Trash2, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CandidateCardProps {
  candidate: Candidate;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEmail: (email: string) => void;
  jobTitle: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  onEdit, 
  onDelete, 
  onView,
  onEmail,
  jobTitle
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as Element).closest('button')) return;
    onView(candidate.id);
  };

  const getAnalysisColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div 
      className="glass-card p-6 cursor-pointer hover:shadow-md transition-all border-none shadow-sm rounded-lg overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-text-100 truncate max-w-[200px]">{candidate.name}</h3>
          <p className="text-sm text-text-200 mt-1 flex items-center gap-1 truncate max-w-[180px]">
            {candidate.current_job_title || jobTitle}
          </p>
        </div>
        <div className="flex gap-1">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onEmail(candidate.email);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Email"
          >
            <Mail size={15} className="text-gray-500" />
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(candidate.id);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Edit"
          >
            <Edit size={15} className="text-gray-500" />
          </Button>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(candidate.id);
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Delete"
          >
            <Trash2 size={15} className="text-gray-500" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <Mail size={14} className="text-gray-400" />
          <span className="truncate max-w-[250px]">{candidate.email}</span>
        </div>
        
        {candidate.phone && (
          <div className="flex items-center gap-1.5 text-sm text-text-200">
            <Phone size={14} className="text-gray-400" />
            <span>{candidate.phone}</span>
          </div>
        )}
        
        {candidate.location && (
          <div className="flex items-center gap-1.5 text-sm text-text-200">
            <MapPin size={14} className="text-gray-400" />
            <span>{candidate.location}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1.5 text-sm mt-3">
          <div className={`${getAnalysisColor(candidate.rating)} px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1`}>
            <Star size={12} /> {candidate.rating}/10
          </div>
          
          {candidate.applied_date && (
            <span className="text-xs text-gray-500 ml-auto">
              Applied: {new Date(candidate.applied_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
