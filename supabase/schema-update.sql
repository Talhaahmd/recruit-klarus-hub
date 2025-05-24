
-- Add the remaining RLS policies for candidates table
-- Policy for viewing candidates - only job owners can see candidates for their jobs
CREATE POLICY "Job owners can view candidates" ON public.candidates
  FOR SELECT 
  USING (
    job_id IS NULL OR -- Allow viewing candidates without job_id (general applications)
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = candidates.job_id 
      AND (jobs.created_by = auth.uid() OR jobs.user_id = auth.uid())
    )
  );

-- Policy for updating candidates - only job owners can update candidates for their jobs
CREATE POLICY "Job owners can update candidates" ON public.candidates
  FOR UPDATE 
  USING (
    job_id IS NULL OR -- Allow updating candidates without job_id if they belong to user
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = candidates.job_id 
      AND (jobs.created_by = auth.uid() OR jobs.user_id = auth.uid())
    )
  );

-- Policy for deleting candidates - only job owners can delete candidates for their jobs
CREATE POLICY "Job owners can delete candidates" ON public.candidates
  FOR DELETE 
  USING (
    job_id IS NULL OR -- Allow deleting candidates without job_id if they belong to user
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE jobs.id = candidates.job_id 
      AND (jobs.created_by = auth.uid() OR jobs.user_id = auth.uid())
    )
  );

-- Make sure job_id can be null for candidates who apply generally
ALTER TABLE public.candidates ALTER COLUMN job_id DROP NOT NULL;
