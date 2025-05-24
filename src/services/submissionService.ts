
import { fileUploadService } from './fileUploadService';
import { cvSubmissionService } from './cvSubmissionService';
import { interviewService } from './interviewService';

// Re-export all services for backward compatibility
export const submissionService = {
  ...fileUploadService,
  ...cvSubmissionService,
  ...interviewService
};

// Also export individual services for more focused imports
export { fileUploadService } from './fileUploadService';
export { cvSubmissionService } from './cvSubmissionService';
export { interviewService } from './interviewService';
