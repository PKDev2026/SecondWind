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
    Layers,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { CopilotScan } from "@/types";

export default function HistoryPage() {
    const [scans, setScans] = useState<CopilotScan[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedScanId, setExpandedScanId] = useState<number | null>(null);
    
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const pageSize = 10;

    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        fetch(`http://localhost:8080/api/copilot/history?page=${currentPage}&size=${pageSize}`, {
            method: 'GET',
            credentials: 'include', 
        })
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP history error: ${res.status}`);
            return res.json();
        })
        .then((data) => {
            setScans(data.content || []);
            setTotalPages(data.totalPages || 0);
            setTotalElements(data.totalElements || 0);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error loading account optimization logs:", err);
            setLoading(false);
        });
    }, [currentPage]);

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

    const handleDeleteScan = async (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        if (!confirm("Are you sure you want to permanently discard this scan report?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/copilot/scans/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!res.ok) throw new Error("Failed to drop record from server.");

            setScans(prevScans => prevScans.filter(scan => scan.id !== id));
            setTotalElements(prev => Math.max(0, prev - 1));
            if (expandedScanId === id) setExpandedScanId(null);
        } catch (error) {
            console.error("Error purging historical item:", error);
            alert("Could not process record deletion.");
        }
    };

    // Calculate analytics dynamically based on what's visible/loaded
    const calculateAnalytics = (scansList: CopilotScan[]) => {
        if (!scansList || scansList.length === 0) {
            return { averageScore: 0, topMissingSkills: [] };
        }

        const totalScore = scansList.reduce((sum, scan) => sum + (scan.matchScore || 0), 0);
        const averageScore = Math.round(totalScore / scansList.length);

        const frequencyMap: Record<string, number> = {};
        scansList.forEach((scan) => {
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

        return { averageScore, topMissingSkills };
    };

    const { averageScore, topMissingSkills } = calculateAnalytics(scans);

    const filteredScans = scans.filter(scan => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        
        const jobMatch = scan.jobTitle?.toLowerCase().includes(query);
        const companyMatch = scan.companyName?.toLowerCase().includes(query);
        return jobMatch || companyMatch;
    });

    if (loading && scans.length === 0) {
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

            {/* Metrics Row Component */}
            {totalElements > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Profile Scans</p>
                            <p className="text-xl font-bold text-white mt-0.5">{totalElements}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Page Average Compatibility</p>
                            <p className="text-xl font-bold text-white mt-0.5">{averageScore}%</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Primary Page Gaps</p>
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

            {/* Search Filter Utility Box */}
            {totalElements > 0 && (
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter by job title or company name..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition-colors"
                    />
                </div>
            )}

            {totalElements === 0 ? (
                <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-950/40">
                    <FileText className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No saved analyses found</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Run an analysis inside the AI Interview Copilot to populate your archive.
                    </p>
                </div>
            ) : filteredScans.length === 0 ? (
                <div className="p-8 text-center border border-slate-900 rounded-xl bg-slate-950/20 text-slate-500 text-sm">
                    No results match your current search query.
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {filteredScans.map((scan) => {
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
                                    {/* CARD HEADER */}
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
                                            
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteScan(scan.id, e)}
                                                    className="p-1.5 rounded-md hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-900/40 transition-colors"
                                                    title="Delete Scan Log"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>

                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        toggleScanExpand(scan.id);
                                                    }}
                                                    className="p-1.5 rounded-md hover:bg-slate-900 text-slate-400 transition-colors"
                                                    aria-label="Toggle details"
                                                >
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </button>
                                            </div>
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

                    {/* Pagination Navigation Controllers */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-900 pt-4 px-1">
                            <p className="text-xs text-slate-500">
                                Showing page <span className="text-slate-300 font-medium">{currentPage + 1}</span> of <span className="text-slate-300 font-medium">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0 || loading}
                                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1 || loading}
                                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}