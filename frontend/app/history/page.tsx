"use client";

import { useEffect, useState } from "react";
import { FileText, Briefcase, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { CopilotScan } from "@/types";

export default function HistoryPage() {
    const [history, setHistory] = useState<CopilotScan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch historical snapshots directly from our clean-slate account table
        fetch('http://localhost:8080/api/copilot/history', {
            method: 'GET',
            credentials: 'include', // Automatically passes session headers/cookies
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

    // Safely deserializes native JSON column strings into clean array iterators
    const safelyParseJsonArray = (jsonString: string): string[] => {
        try {
            return JSON.parse(jsonString || '[]');
        } catch (e) {
            return [];
        }
    };

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
                <h1 className="text-2xl font-bold tracking-tight text-white">Saved Optimizations</h1>
                <p className="text-sm text-slate-400">
                    Review standalone alignment diagnostics, structural keywords, and missing entities logged for your profile.
                </p>
            </div>

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

                        return (
                            <div
                                key={scan.id} 
                                className="border border-slate-800 bg-slate-950 rounded-xl p-6 hover:border-slate-700 transition-all space-y-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-4">
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
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:self-start pt-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{new Date(scan.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

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
                                                            <span key={i} className="text-xs bg-emerald-950/30 text-emerald-300 border border-emerald-900/50 px-2 py-0.5 rounded">
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
                                                            <span key={i} className="text-xs bg-amber-950/30 text-amber-300 border border-amber-900/50 px-2 py-0.5 rounded">
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}