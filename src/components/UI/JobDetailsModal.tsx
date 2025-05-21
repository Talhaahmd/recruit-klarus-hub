
import React from 'react';
import { Job } from '@/services/jobsService';
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
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobDetailsModalProps {
  job: Job;
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <span className="font-medium">Workplace Type:</span> {job.workplace_type}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-primary-100" />
              <span className="font-medium">Posted Date:</span> {job.posted_date}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-primary-100" />
              <span className="font-medium">Applicants:</span> {job.applicants}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Briefcase size={16} className="text-primary-100" />
              <span className="font-medium">Status:</span> {job.status}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold">Job Description</h3>
            <p className="text-sm text-text-200 whitespace-pre-line">{job.description}</p>
          </div>
          
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

          {job.apply_link && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-primary-100" />
                <h3 className="text-base font-semibold">Application Link</h3>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={job.apply_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-100 hover:underline flex items-center gap-1 text-sm"
                >
                  {job.apply_link}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-primary-100" />
            <span className="font-medium">Active for:</span> {job.active_days} days
          </div>

          {job.apply_link && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
              <Button 
                className="bg-primary-100 hover:bg-primary-100/90"
                onClick={() => window.open(job.apply_link, '_blank')}
              >
                Apply Now
                <ExternalLink size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
