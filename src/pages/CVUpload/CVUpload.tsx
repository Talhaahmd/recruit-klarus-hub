
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const CVUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    setError(null);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please upload your CV to continue');
      return;
    }

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would typically upload the file to your backend
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      toast.success('CV uploaded successfully!');
    } catch (err) {
      setError('Failed to upload CV. Please try again.');
      toast.error('Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-white">CV Uploaded Successfully!</h2>
              <p className="text-neutral-400 mb-4">
                Thank you for submitting your CV to Klarus HR. We'll review it and get back to you soon.
              </p>
              <Button 
                onClick={() => {
                  setSuccess(false);
                  setFiles([]);
                }}
                className="w-full"
              >
                Upload Another CV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Please Upload your CV for Klarus HR
          </h1>
          <p className="text-xl text-neutral-400">
            Share your professional experience with our recruitment team
          </p>
        </div>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
              <Upload className="w-6 h-6" />
              Upload Your CV
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-600">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-8">
              <FileUpload onChange={handleFileUpload} />
            </div>

            {files.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-neutral-400 mb-2">Selected file:</p>
                <div className="bg-neutral-800 rounded-lg p-3">
                  <p className="text-white font-medium">{files[0].name}</p>
                  <p className="text-neutral-400 text-sm">
                    {(files[0].size / 1024 / 1024).toFixed(2)} MB • {files[0].type}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || files.length === 0}
              className="w-full h-12 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Uploading CV...
                </>
              ) : (
                'Submit CV'
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CVUpload;
