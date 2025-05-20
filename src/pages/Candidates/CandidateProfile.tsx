
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Briefcase, FileText, Linkedin, 
  Tag, Award, Star, ArrowLeft 
} from 'lucide-react';
import { mockCandidates, CandidateType } from '@/data/mockData';
import { Header } from '@/components/Layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card, CardContent } from '@/components/ui/card';

const CandidateProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('details');
  
  // Find the candidate by ID
  const candidate = mockCandidates.find(c => c.id === id);
  
  if (!candidate) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-medium">Candidate not found</p>
        <button 
          onClick={() => navigate('/candidates')}
          className="mt-4 bg-primary-100 text-white px-4 py-2 rounded-lg"
        >
          Return to Candidates
        </button>
      </div>
    );
  }
  
  // Sample extended data (in a real app this would come from the database)
  const extendedData = {
    firstName: candidate.name.split(' ')[0],
    lastName: candidate.name.split(' ')[1] || '',
    location: 'San Francisco, CA',
    experience: '5 years',
    professionalSummary: 'Experienced software developer with a passion for creating innovative solutions. Proven track record of delivering high-quality projects on time and within budget.',
    education: [
      { degree: 'BSc Computer Science', institution: 'Stanford University', year: '2018' },
      { degree: 'MSc Software Engineering', institution: 'MIT', year: '2020' }
    ],
    expertise: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'CI/CD', 'Agile'],
    jobHistory: [
      { title: 'Senior Software Engineer', company: 'Tech Solutions Inc.', duration: '2020 - Present' },
      { title: 'Full Stack Developer', company: 'WebDev Co.', duration: '2018 - 2020' }
    ],
    achievements: [
      'Led a team of 5 developers to deliver a major product update',
      'Reduced application loading time by 40%',
      'Published 3 technical articles on modern web development'
    ],
    certifications: [
      'AWS Certified Developer',
      'Google Cloud Professional Developer'
    ],
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    aiScore: 8.5,
    aiSummary: 'This candidate demonstrates strong technical expertise in modern web development technologies, particularly in the React ecosystem. Their experience spans both frontend and backend development, with a solid foundation in cloud services. The candidate\'s educational background in computer science and software engineering provides a strong theoretical base that complements their practical skills. Their achievements indicate leadership potential and a focus on performance optimization. Overall, this candidate appears to be a well-rounded full stack developer with the potential to contribute significantly to technical teams.'
  };
  
  const handleGoBack = () => {
    navigate('/candidates');
  };
  
  const renderExpertiseTags = () => {
    return extendedData.expertise.map((skill, index) => (
      <Badge key={index} variant="outline" className="mr-2 mb-2">
        {skill}
      </Badge>
    ));
  };

  return (
    <div className="overflow-auto">
      <div className="sticky top-0 z-10 bg-background pb-4">
        <Header 
          title="Candidate Profile"
          subtitle="View detailed candidate information"
        />
        <div className="ml-4 mt-2">
          <button 
            onClick={handleGoBack}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            <span>Back to Candidates</span>
          </button>
        </div>
      </div>
      
      <div className="p-6 bg-background">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Basic info */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{extendedData.firstName} {extendedData.lastName}</h2>
                    <p className="text-gray-500">{extendedData.jobHistory[0]?.title || 'Job Seeker'}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < Math.floor(candidate.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium">{candidate.rating}/5</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <a href={`mailto:${candidate.email}`} className="text-primary-100 hover:underline">
                      {candidate.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{candidate.phone}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{extendedData.location}</span>
                  </div>
                  
                  {extendedData.linkedinUrl && (
                    <div className="flex items-center">
                      <Linkedin className="w-5 h-5 mr-3 text-gray-400" />
                      <a 
                        href={extendedData.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-100 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Application Status</h3>
                  <span className={`px-2 py-1 text-xs rounded-full 
                    ${candidate.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                      candidate.status === 'Screening' ? 'bg-purple-100 text-purple-800' :
                      candidate.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                      candidate.status === 'Assessment' ? 'bg-orange-100 text-orange-800' :
                      candidate.status === 'Offer' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'Hired' ? 'bg-green-200 text-green-900' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {candidate.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Applied on: {candidate.appliedDate}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">AI Evaluation</h3>
                <div className="flex items-center mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-100 h-2.5 rounded-full" 
                      style={{ width: `${(extendedData.aiScore / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 font-medium">{extendedData.aiScore}/10</span>
                </div>
                <button
                  onClick={() => setActiveTab('ai')}
                  className="w-full mt-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <FileText size={16} className="mr-2" />
                  View AI Analysis
                </button>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Detailed info */}
          <div className="w-full md:w-2/3">
            <Tabs 
              defaultValue="details"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Profile Details</TabsTrigger>
                <TabsTrigger value="ai">AI Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
                    <p className="text-gray-700">{extendedData.professionalSummary}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Expertise</h3>
                    <div className="flex flex-wrap">{renderExpertiseTags()}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                    <div className="space-y-4">
                      {extendedData.jobHistory.map((job, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                          <h4 className="font-medium text-primary-100">{job.title}</h4>
                          <p className="text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.duration}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Education</h3>
                    <div className="space-y-4">
                      {extendedData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                          <h4 className="font-medium text-primary-100">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {extendedData.achievements.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {extendedData.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {extendedData.certifications.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                      <ul className="list-disc list-inside space-y-2">
                        {extendedData.certifications.map((cert, index) => (
                          <li key={index} className="text-gray-700">{cert}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                    <p className="text-gray-700">{candidate.notes}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">AI Analysis</h3>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center cursor-help">
                            <span className="text-2xl font-bold text-primary-100">{extendedData.aiScore}</span>
                            <span className="text-sm text-gray-500 ml-1">/10</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">AI Score Explained</h4>
                            <p className="text-sm text-gray-500">
                              The AI Score is calculated based on the candidate's skills, experience, 
                              education, and overall match to the job requirements. A score above 7 
                              indicates a strong candidate.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Analysis Summary</h4>
                        <p className="text-gray-700">{extendedData.aiSummary}</p>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Strengths</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-gray-700">Strong technical background in web development</li>
                          <li className="text-gray-700">Experience with modern frameworks and cloud services</li>
                          <li className="text-gray-700">Leadership potential and proven track record</li>
                        </ul>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Improvement Areas</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li className="text-gray-700">Could benefit from more experience with mobile development</li>
                          <li className="text-gray-700">Limited exposure to enterprise-scale applications</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;

