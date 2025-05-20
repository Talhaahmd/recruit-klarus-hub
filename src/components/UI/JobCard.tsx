
import React from 'react';
import { Job } from '@/services/jobsService';
import { 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  Users as UsersIcon,
  BadgeCheck
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, onView }) => {
  return (
    <div 
      className="glass-card p-6 cursor-pointer hover:translate-y-[-2px]"
      onClick={onView}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-primary-100">{job.title}</h3>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onEdit(job.id); 
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <Edit size={16} className="text-gray-500" />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(job.id); 
            }}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <Trash2 size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-text-200 text-sm">
        {job.description.substring(0, 100)}...
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <Clock size={14} />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <UsersIcon size={14} />
          <span>{job.applicants} applicants</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-text-200">
          <BadgeCheck size={14} />
          <span>{job.status}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-primary-200">
          Posted: {job.posted_date}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
