
import { fileUploadService } from './fileUploadService';
import { cvSubmissionService } from './cvSubmissionService';
import { interviewService } from './interviewService';
import { newApplicationService } from './newApplicationService';

// Re-export all services for backward compatibility
export const submissionService = {
  ...fileUploadService,
  ...cvSubmissionService,
  ...interviewService,
  ...newApplicationService
};

// Export individual services
export { fileUploadService } from './fileUploadService';
export { cvSubmissionService } from './cvSubmissionService';
export { interviewService } from './interviewService';
export { newApplicationService } from './newApplicationService';
