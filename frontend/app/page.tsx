'use client';

import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { JobApplication } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getApplications()
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not connect to Spring Boot API. Make sure backend is running on port 8080.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-400">
        <h3 className="text-lg font-semibold mb-2">Backend Connection Error</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // --- METRIC CALCULATIONS ---
  const totalApps = applications.length;
  const interviewApps = applications.filter(a => a.status === 'INTERVIEW').length;
  const rejectedApps = applications.filter(a => a.status === 'REJECTED').length;
  const ghostedApps = applications.filter(a => a.status === 'GHOSTED').length;
  const pendingApps = applications.filter(a => a.status === 'APPLIED').length;

  const responseRate = totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0;

  // --- RECHARTS CHART DATA FORMATION ---
  const barChartData = [
    { name: 'Applied', Count: pendingApps },
    { name: 'Interviews', Count: interviewApps },
    { name: 'Ghosted', Count: ghostedApps },
    { name: 'Rejected', Count: rejectedApps },
  ];

  const pieChartData = [
    { name: 'Active/Pending', value: pendingApps + interviewApps },
    { name: 'Closed Out', value: rejectedApps + ghostedApps },
  ];

  const COLORS = ['#14b8a6', '#64748b'];

  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Application Analytics</h1>
        <p className="text-slate-400 mt-1">Real-time indicators across your custom software engineering pipelines.</p>
      </div>

      {/* Metric Cards Matrix Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Applications Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Pipeline volume</span>
            <Briefcase className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{totalApps}</span>
            <p className="text-xs text-slate-500 mt-1">Tracked instances</p>
          </div>
        </div>

        {/* Interviews Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Active Interviews</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-emerald-400">{interviewApps}</span>
            <p className="text-xs text-slate-500 mt-1">Live interaction tracks</p>
          </div>
        </div>

        {/* Success / Response Conversion Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Response Conversion Rate</span>
            <TrendingUp className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-white">{responseRate}%</span>
            <p className="text-xs text-slate-500 mt-1">Interview callback metric</p>
          </div>
        </div>

        {/* Losses / Dead Ends Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Rejections / Ghosted</span>
            <XCircle className="h-5 w-5 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-slate-400">{rejectedApps + ghostedApps}</span>
            <p className="text-xs text-slate-500 mt-1">Closed loops evaluated</p>
          </div>
        </div>
      </div>

      {/* Recharts Charts Layout Block */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Status Bar Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950 p-6">
          <h3 className="text-base font-semibold text-white mb-6">Pipeline Funnel Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="Count" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratio Share Pie Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Pipeline Momentum</h3>
            <p className="text-xs text-slate-400">Ratio tracking active opportunities vs final dead-ends.</p>
          </div>
          
          <div className="h-52 w-full flex items-center justify-center relative my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Absolute Indicator Text */}
            <div className="absolute text-center">
              <span className="block text-2xl font-bold text-white">{totalApps}</span>
              <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">Total Rows</span>
            </div>
          </div>

          {/* Color Indicators Legend */}
          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-teal-500"></div>
                <span className="text-slate-400">Active (Applied + Interview)</span>
              </div>
              <span className="font-semibold text-white">{pendingApps + interviewApps}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-500"></div>
                <span className="text-slate-400">Archived (Rejected + Ghosted)</span>
              </div>
              <span className="font-semibold text-white">{rejectedApps + ghostedApps}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}