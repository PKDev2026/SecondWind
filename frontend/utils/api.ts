import { JobApplication, User } from "@/types";

const BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Fetch all applications
  getApplications: async () => {
    const res = await fetch(`${BASE_URL}/applications`, {
      credentials: 'include',
    });
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
      credentials: 'include',
      body: JSON.stringify({ jobApplication, companyName, companyDomain }),
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
  },

  // Update application status and stage
  updateStatus: async (id: number, status: string, currentStage: string) => {
    const res = await fetch(
      `${BASE_URL}/applications/${id}/status?status=${status}&currentStage=${encodeURIComponent(currentStage)}`, { 
        method: 'PUT',
        credentials: 'include',
      }
    );
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Fetch the tracking timeline audit trail for a specific job
  getTimeline: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/timeline/application/${jobId}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  // Auth
  register: async (email: string, password: string): Promise<string> => {
    const res = await fetch(`http://localhost:8080/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.text();
  },

  login: async (email: string, password: string): Promise<User> => {
    const res = await fetch(`http://localhost:8080/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  logout: async (): Promise<void> => {
    await fetch(`http://localhost:8080/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  me: async (): Promise<User | null> => {
    try {
      const res = await fetch(`http://localhost:8080/api/auth/me`, {
        credentials: 'include',
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },
};