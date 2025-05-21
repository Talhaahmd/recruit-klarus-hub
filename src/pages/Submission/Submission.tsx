
import React, { useState } from 'react';
import { Upload, Check, X, FileType } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CVSubmission = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Please upload a PDF or Word document');
        return;
      }
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }
      
      setFile(selectedFile);
      setUploadComplete(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    
    try {
      // Create a unique file name with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to 'candidate-files' bucket
      const { data, error } = await supabase
        .storage
        .from('candidate-files')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      // Get public URL for the file
      const { data: urlData } = supabase
        .storage
        .from('candidate-files')
        .getPublicUrl(filePath);
      
      // Save metadata to 'cv_links' table
      const { error: insertError } = await supabase
        .from('cv_links')
        .insert([
          {
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_size: file.size,
            file_type: file.type,
            status: 'new'
          }
        ]);
      
      if (insertError) {
        throw insertError;
      }
      
      toast.success('Your CV has been successfully uploaded');
      setUploadComplete(true);
      setFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      console.error('Error uploading CV:', error.message);
      toast.error('Failed to upload your CV. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-primary-100">Thank You For Choosing To Apply</CardTitle>
          <CardDescription>
            Please upload your CV below. We accept PDF and Word documents.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div 
              onClick={() => document.getElementById('cv-upload')?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${file ? 'bg-primary-100/10 border-primary-100' : 'hover:bg-slate-50 hover:border-primary-100/50'}
              `}
            >
              {uploadComplete ? (
                <div className="flex flex-col items-center text-green-500">
                  <Check size={48} className="mb-2" />
                  <p className="font-medium">Upload Complete!</p>
                  <p className="text-sm text-slate-500 mt-1">Your CV has been received. Thank you!</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <FileType size={36} className="mb-2 text-primary-100" />
                  <p className="font-medium truncate max-w-[250px]">{file.name}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        const fileInput = document.getElementById('cv-upload') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                    >
                      <X size={14} className="mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={48} className="mb-2 text-slate-400" />
                  <p className="font-medium">Drag & drop or click to browse</p>
                  <p className="text-sm text-slate-500 mt-1">PDF or Word files (max 5MB)</p>
                </div>
              )}
              
              <Input 
                type="file" 
                id="cv-upload" 
                className="hidden" 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUpload} 
            disabled={!file || uploading || uploadComplete}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload CV'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CVSubmission;
