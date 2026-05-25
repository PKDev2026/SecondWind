"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import ResumeUploadZone from '../resumeUploadZone/page'; // Pure architectural separation
import { 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';
import { AnalysisResult } from '@/types';

export default function Copilot() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);
  
  if (authLoading || !user) return null;

  const handleSaveStandaloneScan = async () => {
    if (!results) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/api/copilot/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({
          jobTitle: jobTitle.trim() || 'Untargeted Scan',
          companyName: companyName.trim() || null,
          rawJobDescription: jobDescription,
          analysisData: results 
        }),
      });

      if (!response.ok) throw new Error(`Failed to archive scan payload: ${response.status}`);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error saving standalone report to history:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || !resumeText.trim()) return;

    setAnalyzing(true);
    setResults(null);
    setSaveSuccess(false);
    
    try {
      const response = await fetch('http://localhost:8080/api/copilot/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ jobDescription, resumeText }), 
      });

      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to fetch AI analysis:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-teal-400" /> AI Interview Copilot
        </h1>
        <p className="text-slate-400 mt-1">
          Scan target job descriptions against your core profile to extract keywords, reveal skill gaps, and generate tailoring vectors.
        </p>
      </div>

      <ResumeUploadZone onResumeLoaded={(extractedText) => setResumeText(extractedText)} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAnalyze} className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-5 h-full flex flex-col">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-400" /> Target Role Requirements
            </h3>
            
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-medium text-slate-400 mb-2">Your Profile Baseline / Resume *</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your technical profile details or full resume context here..."
                className="w-full h-44 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none resize-none font-mono leading-relaxed"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-medium text-slate-400 mb-2">Target Job Description *</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full text of the job listing here (Responsibilities, Qualifications, Skills)..."
                className="w-full h-44 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none resize-none font-mono leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !jobDescription.trim() || !resumeText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:hover:bg-teal-500 mt-2"
            >
              {analyzing ? 'Analyzing Vector Alignment...' : 'Run Alignment Scan'} 
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Results Matrix Panel */}
        <div className="lg:col-span-2">
          {!results && !analyzing ? (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-12 text-center text-slate-500 h-full flex flex-col justify-center items-center space-y-3">
              <BrainCircuit className="h-12 w-12 text-slate-700 animate-pulse" />
              <p className="max-w-sm text-sm">Drop a job listing and resume into the scanner on the left to map your engineering footprint against their tech stack.</p>
            </div>
          ) : analyzing ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-12 text-center text-slate-500 h-full flex flex-col justify-center items-center space-y-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-teal-400 animate-spin"></div>
              </div>
              <p className="text-sm text-slate-400 font-medium">Parsing syntax trees & extracting technology entities...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Score Dashboard Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Profile Compatibility Rating</h3>
                  <p className="text-sm text-slate-400 mt-1">Calculated structural keyword frequency and domain alignment.</p>
                </div>
                <div className="relative flex items-center justify-center h-24 w-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-teal-400" strokeDasharray={`${results?.matchScore}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <span className="absolute text-xl font-bold text-white">{results?.matchScore}%</span>
                </div>
              </div>

              {/* Keyword Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Strong Matches Found
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results?.keywordsMatched.map((kw: string, index: number) => (
                      <span key={`${kw}-${index}`} className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="h-4 w-4" /> Structural Skill Gaps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {results?.keywordsMissing.map((kw: string) => (
                      <span key={kw} className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategies & Insights */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-teal-400" /> Strategic Interview Directives
                </h4>
                <ul className="space-y-3 text-sm text-slate-300">
                  {results?.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2.5 border-l-2 border-teal-500/30 pl-3 py-0.5">
                      <span className="text-slate-400 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Standalone Save Form Card */}
              <div className="mt-6 border border-slate-800 bg-slate-950 rounded-xl p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    Save Optimization to History Log
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Archive this analysis snapshot to your account logs so you can review metrics or access it later via your history dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Job Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Full Stack Engineer"
                      value={jobTitle} 
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Frost Bank"
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {saveSuccess ? (
                    <span className="text-xs text-emerald-400 font-medium">✓ Successfully committed to your personal profile logs!</span>
                  ) : <div />}
                  
                  <button
                    type="button"
                    onClick={handleSaveStandaloneScan}
                    disabled={isSaving}
                    className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-semibold px-5 py-2 rounded-lg text-sm transition-all ml-auto"
                  >
                    {isSaving ? "Archiving..." : "Archive Scan Report"}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}