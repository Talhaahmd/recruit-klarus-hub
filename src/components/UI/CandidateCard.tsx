
import React from 'react';
import { CandidateType } from '@/data/mockData';
import { Mail, Phone, Edit, Trash2, Star, FileText } from 'lucide-react';

interface CandidateCardProps {
  candidate: CandidateType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onEmail: (email: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  onEdit, 
  onDelete, 
  onView,
  onEmail
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Screening': return 'bg-purple-100 text-purple-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Assessment': return 'bg-orange-100 text-orange-800';
      case 'Offer': return 'bg-green-100 text-green-800';
      case 'Hired': return 'bg-green-200 text-green-900';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-text-100">{candidate.name}</h3>
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(candidate.status)}`}>
            {candidate.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onView(candidate.id)}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <FileText size={16} className="text-primary-100" />
          </button>
          <button 
            onClick={() => onEmail(candidate.email)}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <Mail size={16} className="text-gray-500" />
          </button>
          <button 
            onClick={() => onEdit(candidate.id)}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <Edit size={16} className="text-gray-500" />
          </button>
          <button 
            onClick={() => onDelete(candidate.id)}
            className="p-1.5 rounded-full hover:bg-gray-100"
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
        <div className="flex items-center gap-1.5 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < candidate.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-primary-200">
          Applied: {candidate.appliedDate}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
