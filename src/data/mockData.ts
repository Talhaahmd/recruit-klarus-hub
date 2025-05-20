
// Job Types
export type JobType = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Remote';
  salary: string;
  postedDate: string;
  status: 'Active' | 'Paused' | 'Closed';
  applicants: number;
};

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
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer to join our team.',
    requirements: ['5+ years of experience with React', 'TypeScript proficiency', 'UI/UX understanding'],
    location: 'New York, NY',
    type: 'Full-Time',
    salary: '$120,000 - $150,000',
    postedDate: '2025-04-15',
    status: 'Active',
    applicants: 12
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Lead product development from conception to launch.',
    requirements: ['3+ years in product management', 'Agile methodologies', 'User research experience'],
    location: 'Remote',
    type: 'Full-Time',
    salary: '$130,000 - $160,000',
    postedDate: '2025-04-18',
    status: 'Active',
    applicants: 8
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    description: 'Implement and manage cloud infrastructure and CI/CD pipelines.',
    requirements: ['AWS or Azure experience', 'Docker, Kubernetes', 'Infrastructure as Code'],
    location: 'San Francisco, CA',
    type: 'Full-Time',
    salary: '$140,000 - $170,000',
    postedDate: '2025-04-10',
    status: 'Active',
    applicants: 5
  },
  {
    id: '4',
    title: 'UX Researcher',
    description: 'Conduct user research and usability testing.',
    requirements: ['2+ years in UX research', 'Interview facilitation', 'Data analysis'],
    location: 'Boston, MA',
    type: 'Part-Time',
    salary: '$90,000 - $110,000',
    postedDate: '2025-04-20',
    status: 'Active',
    applicants: 3
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
