
import React from 'react';
import { Candidate } from '@/services/candidatesService';
import { Mail, Phone, Edit, Trash2 } from 'lucide-react';

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

  // Convert the 5-scale rating to a 10-scale analysis score
  const analysisScore = candidate.rating * 2;

  return (
    <div 
      className="glass-card p-6 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-text-100">{candidate.name}</h3>
          <p className="text-sm text-text-200 mt-1">
            {jobTitle}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEmail(candidate.email);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Email"
          >
            <Mail size={16} className="text-gray-500" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(candidate.id);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Edit"
          >
            <Edit size={16} className="text-gray-500" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(candidate.id);
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
            title="Delete"
          >
            <Trash2 size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <Mail size={14} />
          <span>{candidate.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <Phone size={14} />
          <span>{candidate.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-200 mt-2">
          <div className={`${getAnalysisColor(analysisScore)} px-2 py-0.5 rounded-full text-xs font-medium`}>
            AI Analysis: {analysisScore}/10
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
