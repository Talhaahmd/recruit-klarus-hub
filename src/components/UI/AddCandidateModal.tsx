
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, File } from 'lucide-react';
import { toast } from 'sonner';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidateData: any) => void;
}

const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'initial' | 'cv' | 'bulk'>('initial');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUploadCV = () => {
    if (!selectedFile) {
      toast.error('Please select a CV file to upload');
      return;
    }
    
    // In a real app, process the file here
    toast.success(`CV file "${selectedFile.name}" uploaded successfully`);
    
    // Pass file data to parent component
    onSave({
      type: 'cv',
      file: selectedFile
    });
    
    // Reset and close
    setSelectedFile(null);
    setMode('initial');
    onClose();
  };
  
  const handleBulkUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file to upload');
      return;
    }
    
    // Check if file is CSV
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a valid CSV file');
      return;
    }
    
    // In a real app, process the CSV file here
    toast.success(`CSV file "${selectedFile.name}" uploaded successfully`);
    
    // Pass file data to parent component
    onSave({
      type: 'bulk',
      file: selectedFile
    });
    
    // Reset and close
    setSelectedFile(null);
    setMode('initial');
    onClose();
  };
  
  const handleClose = () => {
    setSelectedFile(null);
    setMode('initial');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {mode === 'initial' && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Candidate</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <Button 
              onClick={() => setMode('cv')}
              variant="outline" 
              className="flex flex-col items-center justify-center p-6 h-32 hover:bg-accent-100/10"
            >
              <File size={32} className="mb-2 text-primary-100" />
              <span>Add by CV</span>
              <span className="text-xs text-text-200 mt-1">Upload a single CV</span>
            </Button>
            
            <Button 
              onClick={() => setMode('bulk')}
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-32 hover:bg-accent-100/10"
            >
              <Upload size={32} className="mb-2 text-primary-100" />
              <span>Bulk Add</span>
              <span className="text-xs text-text-200 mt-1">Upload CSV with multiple candidates</span>
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      )}
      
      {mode === 'cv' && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload CV</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div 
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-100 transition-colors"
              onClick={() => document.getElementById('cv-upload')?.click()}
            >
              <Upload size={32} className="mb-2 text-primary-100" />
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-text-200">PDF, DOCX, or RTF (max 10MB)</p>
              
              {selectedFile && (
                <div className="mt-4 p-2 bg-primary-100/10 rounded-md flex items-center">
                  <File size={16} className="mr-2" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
              
              <input 
                type="file" 
                id="cv-upload" 
                className="hidden" 
                accept=".pdf,.docx,.rtf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode('initial')}>Back</Button>
            <Button onClick={handleUploadCV} disabled={!selectedFile}>Upload CV</Button>
          </DialogFooter>
        </DialogContent>
      )}
      
      {mode === 'bulk' && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Candidates</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div 
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-100 transition-colors"
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              <Upload size={32} className="mb-2 text-primary-100" />
              <p className="font-medium">Upload CSV file with candidate data</p>
              <p className="text-sm text-text-200">CSV file format only (max 10MB)</p>
              
              {selectedFile && (
                <div className="mt-4 p-2 bg-primary-100/10 rounded-md flex items-center">
                  <File size={16} className="mr-2" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
              
              <input 
                type="file" 
                id="csv-upload" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode('initial')}>Back</Button>
            <Button onClick={handleBulkUpload} disabled={!selectedFile}>Upload CSV</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default AddCandidateModal;
