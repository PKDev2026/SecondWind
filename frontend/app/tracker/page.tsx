'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { JobApplication, ApplicationStatus } from '@/types';
import { Briefcase, Plus, Link2, Calendar, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [currentStage, setCurrentStage] = useState('Applied');

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  const fetchApps = () => {
    api.getApplications()
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => console.error('Error loading applications:', err));
  };

  useEffect(() => {
    if (!user) return;
    fetchApps();
  }, [user]);

  if (authLoading || !user) return null;

  // Maps the display stage directly to your 4 strict backend ApplicationStatus enums
  const mapStageToStatus = (stage: string): ApplicationStatus => {
    switch (stage) {
      case 'Interview': return 'INTERVIEW';
      case 'Ghosted': return 'GHOSTED';
      case 'Rejected': return 'REJECTED';
      default: return 'APPLIED';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return alert('Job Title and Company Name are required!');

    const derivedStatus = mapStageToStatus(currentStage);

    const newJobPayload = {
      jobTitle,
      jobUrl,
      salaryRange,
      status: derivedStatus,
      currentStage,
      appliedAt: new Date().toISOString().split('T')[0]
    };

    try {
      await api.createApplication(newJobPayload, companyName, companyDomain);
      setJobTitle('');
      setCompanyName('');
      setCompanyDomain('');
      setJobUrl('');
      setSalaryRange('');
      setCurrentStage('Applied');
      fetchApps();
    } catch (err) {
      console.error('Failed to save application:', err);
    }
  };

  const handleStageChange = async (id: number, newStage: string) => {
    const inferredStatus = mapStageToStatus(newStage);

    try {
      // Optimistic local UI switch
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, currentStage: newStage, status: inferredStatus } : app)
      );

      // Fire off synchronization parameters to backend endpoint
      await api.updateStatus(id, inferredStatus, newStage);
    } catch (err) {
      console.error('Failed to update stage choice:', err);
      fetchApps();
    }
  };

  const handleDeleteApp = async (id: number) => {
    if (!confirm('Are you sure you want to completely erase this application from your tracking matrix?')) return;

    try {
      setApplications(prev => prev.filter(app => app.id !== id));
      await api.deleteApplication(id);
    } catch (err) {
      console.error('Failed to clear application log:', err);
      alert('Error processing delete instruction.');
      fetchApps();
    }
  };

  const getStageColorStyle = (stage: string) => {
    switch (stage) {
      case 'Applied': return 'bg-blue-950/40 text-blue-400 border-blue-900 focus:border-blue-700';
      case 'Interview': return 'bg-emerald-950/40 text-emerald-400 border-emerald-900 focus:border-emerald-700';
      case 'Ghosted': return 'bg-amber-950/40 text-amber-400 border-amber-900 focus:border-amber-700';
      case 'Rejected': return 'bg-slate-900/60 text-slate-400 border-slate-800 focus:border-slate-700';
      default: return 'bg-slate-900 border-slate-800 text-white';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Job Tracker</h1>
        <p className="text-slate-400 mt-1">Log new leads and monitor your active application pipelines.</p>
      </div>

      {/* Input Form Section */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Plus className="h-5 w-5 text-teal-400" /> Log New Position
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Job Title *</label>
            <input 
              type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
              placeholder="Software Engineer III"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Company Name *</label>
            <input 
              type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
              placeholder="Frost Bank"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Company Domain (Optional)</label>
            <input 
              type="text" value={companyDomain} onChange={e => setCompanyDomain(e.target.value)}
              placeholder="frostbank.com"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Job Post URL</label>
            <input 
              type="text" value={jobUrl} onChange={e => setJobUrl(e.target.value)}
              placeholder="https://linkedin.com/jobs/..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Salary Range / Band</label>
            <input 
              type="text" value={salaryRange} onChange={e => setSalaryRange(e.target.value)}
              placeholder="$110k - $130k"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* STRICT DROPDOWN SELECTION STAGE INPUT */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Current Tracking Stage</label>
            <select 
              value={currentStage} onChange={e => setCurrentStage(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Ghosted">Ghosted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400 transition-colors"
          >
            Add to Matrix
          </button>
        </div>
      </form>

      {/* Applications Data Table Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white">Active Pipelines Matrix</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading pipelines...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Briefcase className="h-8 w-8 mx-auto text-slate-700" />
            <p>Your pipeline tracking matrix is completely clear. Log your first target role above!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/50 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Role Title</th>
                  <th className="px-6 py-4">Salary Band</th>
                  <th className="px-6 py-4">Tracking Stage</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-900/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white">
                      {app.company?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{app.jobTitle}</td>
                    <td className="px-6 py-4 text-slate-400">{app.salaryRange || '—'}</td>
                    
                    {/* Dropdown Row Utility */}
                    <td className="px-6 py-4">
                      <select
                        value={app.currentStage || 'Applied'}
                        onChange={(e) => handleStageChange(app.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-700 transition-all ${getStageColorStyle(app.currentStage || 'Applied')}`}
                      >
                        <option value="Applied" className="bg-slate-950 text-blue-400">Applied</option>
                        <option value="Interview" className="bg-slate-950 text-emerald-400">Interview</option>
                        <option value="Ghosted" className="bg-slate-950 text-amber-400">Ghosted</option>
                        <option value="Rejected" className="bg-slate-950 text-slate-400">Rejected</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-600" />
                        <span>{app.appliedAt}</span>
                      </div>
                    </td>

                    {/* Row Actions Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {app.jobUrl ? (
                          <a 
                            href={app.jobUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 bg-slate-900 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors"
                            title="Open original posting link"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-600 italic mr-2">No Link</span>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(app.id)}
                          className="p-1.5 rounded-lg bg-slate-900 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-950/50 transition-colors"
                          title="Erase Application Record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}