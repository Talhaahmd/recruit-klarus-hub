import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/MainLayout';
import { PlusCircle, Search, Mail, Edit, Trash2, List, Grid, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import CandidateCard from '@/components/UI/CandidateCard';
import AddCandidateModal from '@/components/UI/AddCandidateModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Candidates: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisFilter, setAnalysisFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('screencandidates')
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

    fetchCandidates();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEmail = (email: string) => {
    toast.info(`Send email to: ${email}`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Edit candidate with ID: ${id}`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('screencandidates').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete candidate');
    } else {
      setCandidates(candidates.filter(c => c.id !== id));
      toast.success('Candidate deleted');
    }
  };

  const handleView = (id: string) => {
    navigate(`/candidates/${id}`);
  };

  const handleSaveCandidate = async (data: any) => {
    toast.success('CV uploaded. Candidate will appear once processed.');
    setShowAddModal(false);
  };

  const getAnalysisColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredCandidates = candidates.filter(candidate => {
    const fullName = `${candidate.Firstname} ${candidate.Lastname}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAnalysis =
      analysisFilter === null || candidate.rating >= analysisFilter;

    return matchesSearch && matchesAnalysis;
  });

  return (
    <div>
      <Header
        title="Screened Candidates"
        subtitle="These candidates were parsed from CVs and analyzed using AI."
      />

      <div className="mb-6 flex flex-col sm:flex-row items-stretch gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full rounded-lg glass border-none focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex gap-2 border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-white' : 'bg-white'}`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-primary-100 text-white' : 'bg-white'}`}
              title="Table view"
            >
              <List size={18} />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-100 text-white rounded-lg flex items-center gap-2 hover:bg-primary-100/90 transition-colors shadow-md shadow-primary-100/20"
          >
            <PlusCircle size={18} />
            <span>Upload CV</span>
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={{
                id: candidate.id,
                name: `${candidate.Firstname} ${candidate.Lastname}`,
                email: candidate.email,
                phone: candidate.Phone,
                rating: candidate.rating,
              }}
              onEdit={handleEdit}
              onDelete={() => handleDelete(candidate.id)}
              onView={() => handleView(candidate.id)}
              onEmail={() => handleEmail(candidate.email)}
              jobTitle="Screened"
            />
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map(candidate => (
                <TableRow key={candidate.id} onClick={() => handleView(candidate.id)} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>{`${candidate.Firstname} ${candidate.Lastname}`}</TableCell>
                  <TableCell>{candidate.email}</TableCell>
                  <TableCell>{candidate.Phone}</TableCell>
                  <TableCell>{candidate.education}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getAnalysisColor(candidate.rating)}`}>
                      {candidate.rating}/10
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleEmail(candidate.email)} title="Email">
                        <Mail size={16} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleEdit(candidate.id)} title="Edit">
                        <Edit size={16} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(candidate.id)} title="Delete">
                        <Trash2 size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default Candidates;
