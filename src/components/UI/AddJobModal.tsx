
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Define validation schema for first step
const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  workplaceType: z.string().min(1, { message: "Workplace type is required" }),
  location: z.string().min(1, { message: "Job location is required" }),
  type: z.string().min(1, { message: "Job type is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  activeDays: z.coerce.number().min(1, { message: "Active days must be at least 1" })
});

// Define validation schema for second step
const qualificationFormSchema = z.object({
  qualification: z.string().optional(),
  complexity: z.string().min(1, { message: "Role complexity is required" }),
  technologies: z.array(z.string()).min(1, { message: "At least one technology is required" })
});

// Combine both schemas for the final data
type JobFormValues = z.infer<typeof jobFormSchema>;
type QualificationFormValues = z.infer<typeof qualificationFormSchema>;
export type NewJobData = JobFormValues & QualificationFormValues;

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewJobData) => void;
}

const COMPLEXITY_OPTIONS = ["Intern", "Junior", "Mid Level", "Senior", "Lead"];

const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = React.useState(1);
  const [jobData, setJobData] = React.useState<JobFormValues | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  // First step form
  const jobForm = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      workplaceType: '',
      location: '',
      type: '',
      description: '',
      activeDays: 30,
    }
  });

  // Second step form
  const qualificationForm = useForm<QualificationFormValues>({
    resolver: zodResolver(qualificationFormSchema),
    defaultValues: {
      qualification: '',
      complexity: '',
      technologies: [],
    }
  });

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      qualificationForm.setValue('technologies', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    qualificationForm.setValue('technologies', newTags);
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

  const onSubmitSecondStep = (data: QualificationFormValues) => {
    if (jobData) {
      onSave({ ...jobData, ...data });
      // Reset forms and state
      setStep(1);
      setJobData(null);
      setTags([]);
      jobForm.reset();
      qualificationForm.reset();
    }
  };

  const handleClose = () => {
    // Reset forms and state
    setStep(1);
    setJobData(null);
    setTags([]);
    jobForm.reset();
    qualificationForm.reset();
    onClose();
  };

  // Log form state to help with debugging
  React.useEffect(() => {
    const subscription = qualificationForm.watch((value) => {
      console.log("Form values changed:", value);
    });
    
    return () => subscription.unsubscribe();
  }, [qualificationForm]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {step === 1 ? (
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job - Basic Details</DialogTitle>
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
                        <Input placeholder="e.g. Full-time, Contract, Part-time" {...field} />
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
            <DialogTitle>Add New Job - Qualifications</DialogTitle>
          </DialogHeader>
          
          <Form {...qualificationForm}>
            <form onSubmit={qualificationForm.handleSubmit(onSubmitSecondStep)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={qualificationForm.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Qualification (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bachelor's degree, 3+ years experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
               <FormField
  control={qualificationForm.control}
  name="complexity"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role Complexity</FormLabel>
      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select role complexity" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {COMPLEXITY_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

              </div>
              
              <FormField
                control={qualificationForm.control}
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
