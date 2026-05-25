"use client";

import { useEffect, useState } from "react";
import { 
    FileText, 
    Briefcase, 
    Calendar, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    ChevronDown, 
    ChevronUp,
    BarChart3,
    Target,
    Layers
} from "lucide-react";
import { CopilotScan } from "@/types";

export default function HistoryPage() {
    const [history, setHistory] = useState<CopilotScan[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedScanId, setExpandedScanId] = useState<number | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/copilot/history', {
            method: 'GET',
            credentials: 'include',
        })
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP history error: ${res.status}`);
            return res.json();
        })
        .then((data: CopilotScan[]) => {
            setHistory(data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error loading account optimization logs:", err);
            setLoading(false);
        });
    }, []);

    const toggleScanExpand = (id: number) => {
        setExpandedScanId(prevId => prevId === id ? null : id);
    };

    const safelyParseJsonArray = (jsonString: string): string[] => {
        try {
            return JSON.parse(jsonString || '[]');
        } catch {
            return [];
        }
    };

    const calculateAnalytics = (scans: CopilotScan[]) => {
        if (!scans || scans.length === 0) {
            return { totalScans: 0, averageScore: 0, topMissingSkills: [] };
        }

        const totalScans = scans.length;
        const totalScore = scans.reduce((sum, scan) => sum + (scan.matchScore || 0), 0);
        const averageScore = Math.round(totalScore / totalScans);
        const frequencyMap: Record<string, number> = {};
        
        scans.forEach((scan) => {
            const missing = safelyParseJsonArray(scan.keywordsMissing);
            
            missing.forEach((skill) => {
                const normalizedSkill = skill.trim();
                if (normalizedSkill) {
                    frequencyMap[normalizedSkill] = (frequencyMap[normalizedSkill] || 0) + 1;
                }
            });
        });

        const topMissingSkills = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)                 
            .map(([skill]) => skill);    

        return { totalScans, averageScore, topMissingSkills };
    };

    const { totalScans, averageScore, topMissingSkills } = calculateAnalytics(history);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-slate-400 animate-pulse font-medium">Loading your optimization history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-teal-400" /> Saved Optimizations
                </h1>
                <p className="text-sm text-slate-400">
                    Review standalone alignment diagnostics, structural keywords, and missing entities logged for your profile.
                </p>
            </div>

            {/* Global Metrics Row */}
            {history.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Alignment Runs</p>
                            <p className="text-xl font-bold text-white mt-0.5">{totalScans}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Average Compatibility</p>
                            <p className="text-xl font-bold text-white mt-0.5">{averageScore}%</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Primary Stack Gaps</p>
                            <div className="flex gap-1.5 mt-1.5 overflow-hidden">
                                {topMissingSkills.length > 0 ? (
                                    topMissingSkills.map((skill, i) => (
                                        <span 
                                            key={i} 
                                            className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/10 truncate max-w-22.5"
                                            title={skill}
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-500 italic">No gaps tracked</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {history.length === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-950/40">
                    <FileText className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No saved analyses found</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Run an analysis inside the AI Interview Copilot to populate your clear slate archive.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((scan) => {
                        const matchedArray = safelyParseJsonArray(scan.keywordsMatched);
                        const missingArray = safelyParseJsonArray(scan.keywordsMissing);
                        const recsArray = safelyParseJsonArray(scan.recommendations);
                        const isExpanded = expandedScanId === scan.id;

                        return (
                            <div
                                key={scan.id} 
                                className={`border rounded-xl transition-all duration-200 bg-slate-950 ${
                                    isExpanded 
                                        ? 'border-slate-700 p-6 space-y-4' 
                                        : 'border-slate-800 p-4 hover:border-slate-700 cursor-pointer'
                                }`}
                                onClick={() => !isExpanded && toggleScanExpand(scan.id)}
                            >
                                {/* CARD HEADER (Position, Company, Match %, Date) */}
                                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 tracking-tight ${
                                    isExpanded ? 'border-b border-slate-900 pb-4' : ''
                                }`}>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold tracking-wider uppercase text-teal-400 px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                                                Independent Scan
                                            </span>
                                            <span className="text-xs font-bold text-slate-300 px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800">
                                                {scan.matchScore}% Match
                                            </span>
                                        </div>
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2 pt-1">
                                            <Briefcase className="h-4 w-4 text-slate-500" />
                                            {scan.jobTitle}
                                        </h2>
                                        {scan.companyName && (
                                            <p className="text-sm text-slate-400 font-medium">{scan.companyName}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-3 sm:self-start pt-1">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {/* Dropdown chevron utility button */}
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents layout target double-triggering
                                                toggleScanExpand(scan.id);
                                            }}
                                            className="p-1 rounded-md hover:bg-slate-900 text-slate-400 transition-colors"
                                            aria-label="Toggle details"
                                        >
                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* EXPANDABLE BODY: Renders when item is active */}
                                {isExpanded && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-900 flex flex-col justify-between">
                                            <div>
                                                {matchedArray.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Matched Keywords
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {matchedArray.map((kw, i) => (
                                                                <span key={`${kw}-${i}`} className="text-xs bg-emerald-950/30 text-emerald-300 border border-emerald-900/50 px-2 py-0.5 rounded">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {missingArray.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
                                                            <XCircle className="h-3.5 w-3.5" /> Missing Technology/Skills
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {missingArray.map((kw, i) => (
                                                                <span key={`${kw}-${i}`} className="text-xs bg-amber-950/30 text-amber-300 border border-amber-900/50 px-2 py-0.5 rounded">
                                                                    {kw}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {recsArray.length > 0 && (
                                                <div className="border-t border-slate-900 pt-3">
                                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-1.5">
                                                        <AlertCircle className="h-3.5 w-3.5" /> Strategic Interview Directives
                                                    </h4>
                                                    <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                                                        {recsArray.map((rec, i) => (
                                                            <li key={i}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target Job Requirements Profile</h4>
                                            <div className="text-xs text-slate-400 bg-slate-900/50 p-4 rounded-xl border border-slate-900 h-48 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed select-all">
                                                {scan.rawJobDescription}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}