import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Link as LinkIcon, BriefcaseIcon, MapPinIcon, ClockIcon, CalendarIcon, Tags } from 'lucide-react';
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
} from '@/components/UI/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/UI/button";
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/UI/tabs";
import { toast } from "sonner";

const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract'];
const WORKPLACE_TYPE_OPTIONS = ['Remote', 'Hybrid', 'On-site'];

const jobFormSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  workplaceType: z.string().min(1, { message: "Workplace type is required" }),
  location: z.string().min(1, { message: "Job location is required" }),
  type: z.enum(['Full-time', 'Part-time', 'Contract'], { message: "Invalid job type" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  activeDays: z.coerce.number().min(1, { message: "Active days must be at least 1" }),
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
  const [jobData, setJobData] = useState<JobFormValues | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const jobForm = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      workplaceType: 'Remote',
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

  const onSubmitFirstTab = (data: JobFormValues) => {
    setJobData(data);
    setActiveTab('technologies');
  };

  const onSubmitSecondTab = (data: TechnologiesFormValues) => {
    if (jobData) {
      onSave({ 
        ...jobData, 
        ...data 
      });
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setActiveTab('details');
    setJobData(null);
    setTags([]);
    jobForm.reset();
    technologiesForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary-100 flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6" />
            Create Job Posting
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Create a compelling job description to attract the best candidates
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="details" className="text-sm font-medium">
              Basic Information
            </TabsTrigger>
            <TabsTrigger value="technologies" className="text-sm font-medium">
              Required Skills
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-2">
            <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Job Posting Preview</h3>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-primary-100">
                  {jobForm.watch('title') || 'Job Title'}
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100/10 text-primary-100">
                    <MapPinIcon className="w-3 h-3 mr-1" />
                    {jobForm.watch('location') || 'Location'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {jobForm.watch('type') || 'Job Type'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {jobForm.watch('workplaceType') || 'Workplace Type'}
                  </span>
                </div>
              </div>
            </div>

            <Form {...jobForm}>
              <form onSubmit={jobForm.handleSubmit(onSubmitFirstTab)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={jobForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <BriefcaseIcon className="h-4 w-4 text-primary-100" />
                          Job Title
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Senior Frontend Developer" 
                            className="border-gray-300 focus:border-primary-100 focus:ring-primary-100" 
                            {...field} 
                          />
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
                        <FormLabel className="font-medium">Workplace Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-primary-100">
                              <SelectValue placeholder="Select workplace type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {WORKPLACE_TYPE_OPTIONS.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={jobForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-primary-100" />
                          Job Location
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. New York, NY" 
                            className="border-gray-300 focus:border-primary-100 focus:ring-primary-100" 
                            {...field} 
                          />
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
                        <FormLabel className="font-medium flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-primary-100" />
                          Job Type
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:ring-primary-100">
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JOB_TYPE_OPTIONS.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <FormLabel className="font-medium">Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role, responsibilities, requirements, and any screening questions."
                          className="min-h-[150px] border-gray-300 focus:border-primary-100 focus:ring-primary-100"
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
                      <FormLabel className="font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary-100" />
                        Job Active Duration (days)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          className="border-gray-300 focus:border-primary-100 focus:ring-primary-100" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetAndClose}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary-100 hover:bg-primary-100/90"
                  >
                    Next: Add Technologies
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="technologies" className="mt-2">
            <div className="bg-gray-50 p-5 rounded-lg mb-6 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Required Technologies Preview</h3>
              <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold text-primary-100 mb-2">
                  {jobData?.title || 'Job Title'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100/20 text-primary-100"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 italic">No technologies added yet</span>
                  )}
                </div>
              </div>
            </div>

            <Form {...technologiesForm}>
              <form onSubmit={technologiesForm.handleSubmit(onSubmitSecondTab)} className="space-y-5">
                <FormField
                  control={technologiesForm.control}
                  name="technologies"
                  render={() => (
                    <FormItem>
                      <FormLabel className="font-medium flex items-center gap-2">
                        <Tags className="h-4 w-4 text-primary-100" />
                        Required Technologies
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 p-3 border rounded-md border-gray-300 bg-background min-h-20">
                          {tags.length > 0 ? (
                            tags.map((tag, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-full bg-primary-100 text-white"
                              >
                                {tag}
                                <X
                                  size={14}
                                  className="cursor-pointer hover:text-red-200 ml-1"
                                  onClick={() => handleRemoveTag(tag)}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center w-full h-16 text-gray-400">
                              <p className="text-sm">Add technologies required for this position</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type and press Enter to add technology"
                            className="flex-grow border-gray-300 focus:border-primary-100 focus:ring-primary-100"
                          />
                          <Button
                            type="button"
                            onClick={handleAddTag}
                            variant="secondary"
                            size="sm"
                            className="whitespace-nowrap"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                          {['React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'SQL'].map((suggestion) => (
                            <Button
                              key={suggestion}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                if (!tags.includes(suggestion)) {
                                  const newTags = [...tags, suggestion];
                                  setTags(newTags);
                                  technologiesForm.setValue('technologies', newTags);
                                }
                              }}
                            >
                              + {suggestion}
                            </Button>
                          ))}
                        </div>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="mt-8">
                  <img 
                    src="/placeholder.svg"
                    alt="Job Search Illustration" 
                    className="mx-auto h-32 opacity-70 mb-4"
                  />
                  <p className="text-center text-sm text-gray-500">
                    Specifying required technologies helps candidates understand if they're a good fit for the role.
                  </p>
                </div>

                <DialogFooter className="pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab('details')}
                    className="border-gray-300"
                  >
                    Back to Details
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary-100 hover:bg-primary-100/90"
                  >
                    Create Job Posting
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobModal;
