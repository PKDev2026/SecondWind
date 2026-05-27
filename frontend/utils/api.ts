import { JobApplication, ResumeVersion, User } from "@/types";

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

  // Update the password for the user account
  updatePassword: async (payload: Record<string, string>): Promise<void> => {
    const res = await fetch(`${BASE_URL}/auth/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update system access credentials.');
    }
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

  // Delete an application record
  deleteApplication: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/applications/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to purge application record');
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
  register: async (email: string, password: string, firstName: string, lastName: string): Promise<string> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.text();
  },

  login: async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  logout: async (): Promise<void> => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to logout');
  },

  me: async (): Promise<User | null> => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: 'include',
      });
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  },

  getOptimizationHistory: async (): Promise<ResumeVersion[]> => {
    const res = await fetch(`${BASE_URL}/resumes/user-history`, {
      credentials: 'include',
    });
    if (!res.ok) {
      const errorText = await res.text().catch(() => "No error body text available");
      console.error(`Backend Response Failed! HTTP Status: ${res.status}`);
      console.error(`Backend Error Body:`, errorText);
      throw new Error(`Failed to fetch optimization history. Status: ${res.status}`);
    }
    return res.json();
  },

  saveResumeVersion: async (
    jobId: number,
    versionName: string,
    tailoredBullets: string,
    skillsAligned: string
  ): Promise<ResumeVersion> => {
    const res = await fetch(`${BASE_URL}/resumes/application/${jobId}?versionName=${encodeURIComponent(versionName)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ tailoredBullets, skillsAligned }),
    });
    if (!res.ok) throw new Error('Failed to save tailored resume version');
    return res.json();
  },

  // Send the binary PDF data up to the backend
  uploadResumeFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/copilot/resume/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Upload failed");
    }
    return res.json();
  },

  // Pull down the clean parsed text and filename metadata
  fetchSavedResumeData: async () => {
    const res = await fetch(`${BASE_URL}/copilot/resume/data`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load profile sync data");
    return res.json();
  },
};