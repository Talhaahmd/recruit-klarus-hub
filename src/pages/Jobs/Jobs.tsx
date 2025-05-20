import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract'];

const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  workplaceType: z.string().min(1, { message: "Workplace type is required" }),
  location: z.string().min(1, { message: "Job location is required" }),
  type: z.enum(['Full-time', 'Part-time', 'Contract'], { message: "Invalid job type" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  activeDays: z.coerce.number().min(1, { message: "Active days must be at least 1" })
});

const technologiesSchema = z.object({
  technologies: z.array(z.string()).min(1, { message: "At least one technology is required" })
});

type JobFormValues = z.infer<typeof jobFormSchema>;
type TechnologiesFormValues = z.infer<typeof technologiesSchema>;
export type NewJobData = JobFormValues & TechnologiesFormValues;

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewJobData) => void;
}

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = React.useState(1);
  const [jobData, setJobData] = React.useState<JobFormValues | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  const jobForm = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      workplaceType: '',
      location: '',
      type: 'Full-time',
      description: '',
      activeDays: 30,
    }
  });

  const technologiesForm = useForm<TechnologiesFormValues>({
    resolver: zodResolver(technologiesSchema),
    defaultValues: {
      technologies: [],
    }
  });

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed !== '' && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      technologiesForm.setValue('technologies', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    technologiesForm.setValue('technologies', newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmitFirstStep = (data: JobFormValues) => {
    setJobData(data);
    setStep(2);
  };

  const onSubmitSecondStep = (data: TechnologiesFormValues) => {
    if (jobData) {
      onSave({ ...jobData, ...data });
      setStep(1);
      setJobData(null);
      setTags([]);
      jobForm.reset();
      technologiesForm.reset();
    }
  };

  const handleClose = () => {
    setStep(1);
    setJobData(null);
    setTags([]);
    jobForm.reset();
    technologiesForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {step === 1 ? (
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job - Basic Details</DialogTitle>
            <DialogDescription>
              Fill in the basic information about the job position.
            </DialogDescription>
          </DialogHeader>

          <Form {...jobForm}>
            <form onSubmit={jobForm.handleSubmit(onSubmitFirstStep)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={jobForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="workplaceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workplace Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Remote, Hybrid, On-site" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={jobForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <FormControl>
                        <select {...field} className="w-full border rounded p-2">
                          <option value="">Select job type</option>
                          {JOB_TYPE_OPTIONS.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={jobForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role, responsibilities, requirements, and any screening questions."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={jobForm.control}
                name="activeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Active Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit">Next</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job - Technologies</DialogTitle>
            <DialogDescription>
              Specify the required technologies for this position.
            </DialogDescription>
          </DialogHeader>

          <Form {...technologiesForm}>
            <form onSubmit={technologiesForm.handleSubmit(onSubmitSecondStep)} className="space-y-4">
              <FormField
                control={technologiesForm.control}
                name="technologies"
                render={() => (
                  <FormItem>
                    <FormLabel>Required Technologies</FormLabel>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-10">
                        {tags.map((tag, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary-200 text-white"
                          >
                            {tag}
                            <X
                              size={14}
                              className="cursor-pointer hover:text-red-500"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type and press Enter to add technology"
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          variant="secondary"
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit">Save Job</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddJobModal;
