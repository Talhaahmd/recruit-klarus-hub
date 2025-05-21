
// Find the createCandidate function (around line 172) and update it to remove job_id:

const createCandidate = async (formData: CandidateFormValues) => {
  try {
    setIsLoading(true);
    const candidateData = {
      full_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      location: formData.location || '',
      current_job_title: formData.currentJobTitle || '',
      skills: formData.skills || '',
      experience_level: formData.experienceLevel || '',
      linkedin: formData.linkedin || '',
      source: 'Calendar',
      // Remove the job_id property as it doesn't exist in CandidateInput type
    };

    const savedCandidate = await candidatesService.createCandidate(candidateData);
    
    if (savedCandidate) {
      toast.success('Candidate created successfully');
      reset();
      closeModal();
      refetchEvents();
    }
  } catch (error) {
    console.error('Error creating candidate:', error);
    toast.error('Failed to create candidate');
  } finally {
    setIsLoading(false);
  }
};
