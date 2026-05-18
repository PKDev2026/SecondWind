export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'REJECTED' | 'GHOSTED';

export interface Company {
  id: number;
  name: string;
  domain?: string;
  createdAt: string;
}

export interface JobApplication {
  id: number;
  company: Company;
  jobTitle: string;
  jobUrl?: string;
  salaryRange?: string;
  status: ApplicationStatus;
  currentStage: string;
  notes?: string;
  appliedAt: string; // ISO Date String (YYYY-MM-DD)
  createdAt: string;
  updatedAt?: string;
}

export interface ApplicationTimeline {
  id: number;
  jobApplication: JobApplication;
  stageName: string;
  changedAt: string;
}

export interface ResumeVersion {
  id: number;
  jobApplication: JobApplication;
  versionName: string;
  tailoredBullets?: string;
  skillsAligned?: string;
  createdAt: string;
}

export interface AnalysisResult {
  matchScore: number;
  keywordsMatched: string[];
  keywordsMissing: string[];
  recommendations: string[];
}