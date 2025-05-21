
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100/10 text-primary-100">
              {job.workplace_type}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {job.type}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {job.status}
            </span>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-primary-100" />
                  <h3 className="font-medium">Location</h3>
                </div>
                <p className="text-sm text-gray-700">{job.location}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-primary-100" />
                  <h3 className="font-medium">Job Type</h3>
                </div>
                <p className="text-sm text-gray-700">{job.type}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Building size={18} className="text-primary-100" />
                  <h3 className="font-medium">Workplace Type</h3>
                </div>
                <p className="text-sm text-gray-700">{job.workplace_type}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-primary-100" />
                  <h3 className="font-medium">Posted Date</h3>
                </div>
                <p className="text-sm text-gray-700">{job.posted_date}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={18} className="text-primary-100" />
                  <h3 className="font-medium">Applicants</h3>
                </div>
                <p className="text-sm text-gray-700">{job.applicants}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={18} className="text-primary-100" />
                  <h3 className="font-medium">Status</h3>
                </div>
                <p className="text-sm text-gray-700">{job.status}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={18} className="text-primary-100" />
                <h3 className="font-medium">Technologies</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="px-2.5 py-1 bg-primary-100/20 text-primary-100 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Calendar size={18} className="text-primary-100" />
              <span className="font-medium">Active for:</span> {job.active_days} days
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-4 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-base font-semibold mb-3">Job Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
            
            {job.apply_link && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={18} className="text-primary-100" />
                  <h3 className="font-medium">Application Link</h3>
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
          </TabsContent>
        </Tabs>

        {job.apply_link && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
            <Button 
              className="bg-primary-100 hover:bg-primary-100/90 flex items-center gap-2"
              onClick={() => window.open(job.apply_link, '_blank')}
            >
              Apply Now
              <ExternalLink size={16} />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
