
import React from 'react';
import { Job } from '@/services/jobsService';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface JobsTableProps {
  jobs: Job[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (job: Job) => void;
}

const JobsTable: React.FC<JobsTableProps> = ({ jobs, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto w-full glass-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <TableRow key={job.id} className="cursor-pointer" onClick={() => onView(job)}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.type}</TableCell>
                <TableCell>{job.postedDate}</TableCell>
                <TableCell>{job.applicants}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(job);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(job.id);
                      }}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">No jobs found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsTable;
