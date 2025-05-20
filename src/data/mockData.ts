// Job Types
export interface JobType {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  status: string;
  applicants: number;
  postedDate: string;
  // New fields
  workplaceType: string;
  technologies: string[];
  complexity: string;
  qualification: string;
  activeDays?: number;
}

// Candidate Types
export type CandidateType = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  appliedDate: string;
  status: 'New' | 'Screening' | 'Interview' | 'Assessment' | 'Offer' | 'Hired' | 'Rejected';
  notes: string;
  rating: number;
};

// Calendar Event Types
export type CalendarEventType = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  type: 'Interview' | 'Job Posting' | 'LinkedIn Post' | 'Meeting' | 'Other';
  participants?: string[];
};

// Mock Jobs Data
export const mockJobs: JobType[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for a talented Frontend Developer to join our team. You will be responsible for building user interfaces using React and TypeScript.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'Active',
    applicants: 12,
    postedDate: '2023-10-12',
    workplaceType: 'Remote',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    complexity: 'Senior',
    qualification: 'Bachelor\'s degree in Computer Science',
  },
  {
    id: 'job-2',
    title: 'UX Designer',
    description: 'Join our design team to create beautiful and intuitive user experiences for our web and mobile applications.',
    location: 'New York, NY',
    type: 'Contract',
    status: 'Active',
    applicants: 8,
    postedDate: '2023-10-15',
    workplaceType: 'Hybrid',
    technologies: ['Figma', 'Adobe XD', 'Sketch'],
    complexity: 'Mid-level',
    qualification: '3+ years of experience in UX/UI design',
  },
  {
    id: 'job-3',
    title: 'Backend Engineer',
    description: 'We need an experienced Backend Engineer to maintain and develop new API features for our growing platform.',
    location: 'Austin, TX',
    type: 'Full-time',
    status: 'Active',
    applicants: 5,
    postedDate: '2023-10-17',
    workplaceType: 'On-site',
    technologies: ['Node.js', 'Express', 'MongoDB'],
    complexity: 'Senior',
    qualification: 'Bachelor\'s degree in Computer Science',
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    description: 'Looking for a DevOps Engineer to help us build and maintain our cloud infrastructure and CI/CD pipelines.',
    location: 'Seattle, WA',
    type: 'Full-time',
    status: 'Active',
    applicants: 3,
    postedDate: '2023-10-18',
    workplaceType: 'Remote',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    complexity: 'Senior',
    qualification: '5+ years of experience with cloud platforms',
  }
];

// Mock Candidates Data
export const mockCandidates: CandidateType[] = [
  {
    id: '101',
    jobId: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '555-123-4567',
    resumeUrl: '/resumes/alex-johnson.pdf',
    appliedDate: '2025-04-16',
    status: 'Screening',
    notes: 'Strong portfolio, good communication skills',
    rating: 4
  },
  {
    id: '102',
    jobId: '1',
    name: 'Sam Williams',
    email: 'sam@example.com',
    phone: '555-234-5678',
    resumeUrl: '/resumes/sam-williams.pdf',
    appliedDate: '2025-04-17',
    status: 'Interview',
    notes: 'Excellent technical skills, 7 years experience',
    rating: 5
  },
  {
    id: '103',
    jobId: '2',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    phone: '555-345-6789',
    resumeUrl: '/resumes/taylor-reed.pdf',
    appliedDate: '2025-04-19',
    status: 'New',
    notes: 'Previous experience at a major tech company',
    rating: 3
  },
  {
    id: '104',
    jobId: '3',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    phone: '555-456-7890',
    resumeUrl: '/resumes/jordan-smith.pdf',
    appliedDate: '2025-04-12',
    status: 'Assessment',
    notes: 'Strong AWS certification, good problem-solving skills',
    rating: 4
  }
];

// Mock Calendar Events
export const mockCalendarEvents: CalendarEventType[] = [
  {
    id: '201',
    title: 'Interview with Sam Williams',
    startDate: new Date(2025, 4, 22, 10, 0),
    endDate: new Date(2025, 4, 22, 11, 0),
    description: 'Technical interview for Senior Frontend Developer position',
    type: 'Interview',
    participants: ['Sam Williams', 'HR Manager', 'Tech Lead']
  },
  {
    id: '202',
    title: 'Post Job Listing - Marketing Manager',
    startDate: new Date(2025, 4, 25, 9, 0),
    endDate: new Date(2025, 4, 25, 10, 0),
    description: 'Publish new job listing on job boards',
    type: 'Job Posting'
  },
  {
    id: '203',
    title: 'LinkedIn Company Update',
    startDate: new Date(2025, 4, 26, 14, 0),
    endDate: new Date(2025, 4, 26, 15, 0),
    description: 'Post update about company culture and open positions',
    type: 'LinkedIn Post'
  }
];
