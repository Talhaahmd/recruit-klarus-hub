import React, { useState } from 'react';
import { Button } from '@/components/UI/button';
import { Card, CardContent } from '@/components/UI/card';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { toast } from 'sonner';

const complexityOptions = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive Level' },
];

const DemoSection: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyEmail: '',
    companyPhone: '',
    resumeFile: null as File | null,
    positionTitle: '',
    complexity: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resumeFile: e.target.files![0] }));
    }
  };

  const handleComplexityChange = (value: string) => {
    setFormData(prev => ({ ...prev, complexity: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Demo request submitted successfully! We'll contact you shortly.");
      setFormData({
        fullName: '',
        companyEmail: '',
        companyPhone: '',
        resumeFile: null,
        positionTitle: '',
        complexity: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="demo" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-medium tracking-widest uppercase">
                Book a Demo
              </span>
              <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Experience the Future of Recruitment</h2>
              <p className="mt-6 text-lg text-gray-400">
                Schedule a personalized demo with our team to see how our AI-powered platform can revolutionize your hiring process.
              </p>
              
              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full p-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Personalized Demo</h3>
                    <p className="text-gray-400 mt-2">Get a customized walkthrough of features relevant to your needs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Quick Setup</h3>
                    <p className="text-gray-400 mt-2">Our team will help you get started in as little as one day</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full p-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Free Consultation</h3>
                    <p className="text-gray-400 mt-2">Get expert advice on optimizing your recruitment workflow</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-75"></div>
              <Card className="relative bg-gray-900/90 backdrop-blur-sm border-gray-800">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fullName" className="text-white">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 mt-1.5"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="companyEmail" className="text-white">Company Email</Label>
                        <Input
                          id="companyEmail"
                          name="companyEmail"
                          type="email"
                          value={formData.companyEmail}
                          onChange={handleInputChange}
                          placeholder="john@company.com"
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 mt-1.5"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="companyPhone" className="text-white">Company Phone</Label>
                        <Input
                          id="companyPhone"
                          name="companyPhone"
                          type="tel"
                          value={formData.companyPhone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 mt-1.5"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="resumeFile" className="text-white">CV for Candidate (Optional)</Label>
                        <Input
                          id="resumeFile"
                          name="resumeFile"
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
                          className="bg-gray-800/50 border-gray-700 text-white mt-1.5"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="positionTitle" className="text-white">Position to Hire</Label>
                        <Input
                          id="positionTitle"
                          name="positionTitle"
                          value={formData.positionTitle}
                          onChange={handleInputChange}
                          placeholder="Software Engineer"
                          className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 mt-1.5"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="complexity" className="text-white">Complexity of Role</Label>
                        <Select 
                          value={formData.complexity} 
                          onValueChange={handleComplexityChange}
                          required
                        >
                          <SelectTrigger id="complexity" className="bg-gray-800/50 border-gray-700 text-white mt-1.5">
                            <SelectValue placeholder="Select complexity" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 text-white border-gray-700">
                            <SelectGroup>
                              {complexityOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Book Your Demo"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
