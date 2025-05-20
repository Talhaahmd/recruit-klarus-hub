
import React from 'react';
import { JobType } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Briefcase, 
  Tag, 
  Building, 
  GraduationCap 
} from 'lucide-react';

interface JobDetailsModalProps {
  job: JobType;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary-100">{job.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-primary-100" />
              <span className="font-medium">Location:</span> {job.location}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-primary-100" />
              <span className="font-medium">Job Type:</span> {job.type}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Building size={16} className="text-primary-100" />
              <span className="font-medium">Workplace Type:</span> {job.workplaceType}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-primary-100" />
              <span className="font-medium">Posted Date:</span> {job.postedDate}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-primary-100" />
              <span className="font-medium">Applicants:</span> {job.applicants}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Briefcase size={16} className="text-primary-100" />
              <span className="font-medium">Complexity:</span> {job.complexity}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Job Description</h3>
            <p className="text-sm text-text-200 whitespace-pre-line">{job.description}</p>
          </div>
          
          {job.qualification && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-primary-100" />
                <h3 className="text-base font-semibold">Qualification</h3>
              </div>
              <p className="text-sm text-text-200">{job.qualification}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-primary-100" />
              <h3 className="text-base font-semibold">Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-primary-100/20 text-primary-100 rounded-md text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-primary-100" />
            <span className="font-medium">Active for:</span> {job.activeDays} days
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
