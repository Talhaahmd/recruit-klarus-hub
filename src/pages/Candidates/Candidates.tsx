import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AddCandidateModal from '@/components/modals/AddCandidateModal';
import { supabase } from '@/lib/supabaseClient';

type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  education: string;
  rating: number;
  created_at: string;
};

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch candidates from Supabase
  const fetchCandidates = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch candidates');
      console.error(error);
    } else {
      setCandidates(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSaveCandidate = async (_fileData: any) => {
    toast.success('CV uploaded successfully. Candidate will appear once parsed.');
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Candidates</h1>
        <Button onClick={() => setShowAddModal(true)}>Upload CV</Button>
      </div>

      {isLoading ? (
        <p>Loading candidates...</p>
      ) : candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-lg font-semibold">{candidate.full_name}</h2>
              <p className="text-sm text-gray-600">{candidate.email}</p>
              <p className="text-sm text-gray-600">{candidate.phone}</p>
              <p className="mt-2 text-sm">{candidate.education}</p>
              <p className="mt-1 text-sm font-medium">Rating: {candidate.rating}/10</p>
            </div>
          ))}
        </div>
      )}

      <AddCandidateModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveCandidate}
      />
    </div>
  );
};

export default CandidatesPage;
