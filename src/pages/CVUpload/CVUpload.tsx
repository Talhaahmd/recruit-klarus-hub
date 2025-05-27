import React, { useState } from 'react';
import { FileUpload } from '@/components/UI/file-upload';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Alert, AlertDescription } from '@/components/UI/alert';
import { CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const CVUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const navigate = useNavigate();

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
    setProcessingStatus('Uploading CV...');

    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      console.log('Uploading file to storage:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('cv-bucket')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw new Error('Failed to upload your CV. Please try again.');
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('cv-bucket')
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;
      console.log('File uploaded successfully:', fileUrl);

      setProcessingStatus('Processing CV with AI...');

      // Process CV using the edge function
      console.log('Calling process-cv edge function with URL:', fileUrl);
      
      const { data: processResult, error: processError } = await supabase.functions.invoke('process-cv', {
        body: { fileUrl }
      });

      if (processError) {
        console.error('CV processing error:', processError);
        throw new Error(`Failed to process CV: ${processError.message}`);
      }

      console.log('CV processed successfully:', processResult);
      
      if (processResult?.success) {
        setSuccess(true);
        toast.success('CV uploaded and processed successfully!');
        
        // Add a delay before showing success to ensure processing is complete
        setTimeout(() => {
          console.log('CV processing completed, candidate should now be in database');
        }, 2000);
      } else {
        throw new Error(processResult?.error || 'CV processing failed');
      }
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setError(err.message || 'Failed to upload CV. Please try again.');
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setProcessingStatus('');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        
        <Card className="w-full max-w-md bg-black/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl relative z-10">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative">
                <CheckCircle2 className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 mx-auto bg-cyan-400/20 rounded-full animate-ping" />
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CV Processed Successfully!
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Thank you for submitting your CV to Klarus HR. We've processed it with AI and added you to our candidate database.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/candidates')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                >
                  View Candidates
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Visit Klarus HR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            Upload Your CV
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Share your professional experience with our recruitment team at{' '}
            <span className="text-cyan-400 font-semibold">Klarus HR</span>
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              Submit Your CV
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900/30 border-red-500/50 backdrop-blur-sm">
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            <div className="mb-8">
              <FileUpload onChange={handleFileUpload} />
            </div>

            {files.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Selected file:</p>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
                  <p className="text-white font-medium">{files[0].name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {(files[0].size / 1024 / 1024).toFixed(2)} MB • {files[0].type}
                  </p>
                </div>
              </div>
            )}

            {processingStatus && (
              <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                  <p className="text-blue-300">{processingStatus}</p>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || files.length === 0}
              className="w-full h-14 text-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 disabled:hover:scale-100 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" />
                  Processing CV...
                </>
              ) : (
                'Submit CV'
              )}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
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
