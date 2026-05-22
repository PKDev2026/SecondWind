'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { JobApplication, ApplicationStatus } from '@/types';
import { Briefcase, Plus, Link2, Calendar } from 'lucide-react';
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
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED');
  const [currentStage, setCurrentStage] = useState('Applied');

  const { user, loading: authLoading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  // Fetch applications on load
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

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !companyName) return alert('Job Title and Company Name are required!');

    const newJobPayload = {
      jobTitle,
      jobUrl,
      salaryRange,
      status,
      currentStage,
      appliedAt: new Date().toISOString().split('T')[0] // Formats to YYYY-MM-DD
    };

    try {
      await api.createApplication(newJobPayload, companyName, companyDomain);
      // Reset form fields
      setJobTitle('');
      setCompanyName('');
      setCompanyDomain('');
      setJobUrl('');
      setSalaryRange('');
      setStatus('APPLIED');
      setCurrentStage('Applied');
      // Refresh list
      fetchApps();
    } catch (err) {
      console.error('Failed to save application:', err);
    }
  };

  // Quick Status Badge Color Resolver
  const getBadgeColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'INTERVIEW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'GHOSTED': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'REJECTED': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
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

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Pipeline Status</label>
            <select 
              value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="GHOSTED">Ghosted</option>
              <option value="REJECTED">Rejected</option>
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Current Stage</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4 text-right">Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {app.company?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">{app.jobTitle}</td>
                    <td className="px-6 py-4 text-slate-400">{app.salaryRange || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <span className="text-slate-300 bg-slate-900 px-2 py-1 rounded text-xs border border-slate-800">
                        {app.currentStage || 'Applied'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 flex items-center gap-1.5 mt-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-600" />
                      {app.appliedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.jobUrl ? (
                        <a 
                          href={app.jobUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded border border-slate-800 transition-colors"
                        >
                          <Link2 className="h-3.5 w-3.5" /> Post Link
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600 italic">No Link</span>
                      )}
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