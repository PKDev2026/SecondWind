import { JobApplication } from "@/types";

const BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Fetch all applications
  getApplications: async () => {
    const res = await fetch(`${BASE_URL}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  // Create a new application
  createApplication: async (
    jobApplication: Omit<JobApplication, 'id' | 'company' | 'createdAt' | 'updatedAt'>, 
    companyName: string, 
    companyDomain: string
  ): Promise<JobApplication> => {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobApplication, companyName, companyDomain }),
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
  },

  // Update application status and stage
  updateStatus: async (id: number, status: string, currentStage: string) => {
    const res = await fetch(
      `${BASE_URL}/applications/${id}/status?status=${status}&currentStage=${encodeURIComponent(currentStage)}`,
      { method: 'PUT' }
    );
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Fetch the tracking timeline audit trail for a specific job
  getTimeline: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/timeline/application/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  }
};