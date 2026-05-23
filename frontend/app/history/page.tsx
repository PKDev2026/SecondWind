"use client";

import { useEffect, useState } from "react";
import { FileText, Briefcase, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ResumeVersion, AnalysisResult } from "@/types";
import { api } from "@/utils/api";

export default function HistoryPage() {
    const [history, setHistory] = useState<ResumeVersion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getOptimizationHistory()
            .then((data) => {
                setHistory(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading history page:", err);
                setLoading(false);
            });
    }, []);

    // Helper function to safely parse saved AI metrics if they were stored as JSON strings
    const parseAnalysisData = (skillsString: string | undefined): Partial<AnalysisResult> | null => {
        if (!skillsString) return null;
        try {
            return JSON.parse(skillsString);
        } catch {
            // Fallback if it's stored as plain text summary instead of a JSON string
            return { recommendations: [skillsString] };
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
                    Review all tailored resume variations, keyword checks, and alignment profiles generated for your account.
                </p>
            </div>

            {history.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-950/40">
                <FileText className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No saved analyses found</p>
                <p className="text-xs text-slate-500 mt-1">
                Run a tailoring session in the AI Resume Copilot to capture your first variant.
                </p>
            </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((item) => {
                        const aiData = parseAnalysisData(item.skillsAligned);

                        return (
                            <div
                                key={item.id} 
                                className="border border-slate-800 bg-slate-950 rounded-xl p-6 hover:border-slate-700 transition-all space-y-4"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold tracking-wider uppercase text-teal-400 px-2.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                                            {item.versionName}
                                            </span>
                                            {aiData?.matchScore && (
                                            <span className="text-xs font-bold text-slate-300 px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800">
                                                {aiData.matchScore}% Match
                                            </span>
                                            )}
                                        </div>
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2 pt-1">
                                            <Briefcase className="h-4 w-4 text-slate-500" />
                                            {item.jobApplication.jobTitle}
                                        </h2>
                                        <p className="text-sm text-slate-400 font-medium">{item.jobApplication.company.name}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:self-start pt-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-900">
                                        {aiData?.keywordsMatched && aiData.keywordsMatched.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Matched Keywords
                                                </h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {aiData.keywordsMatched.map((kw, i) => (
                                                    <span key={i} className="text-xs bg-emerald-950/30 text-emerald-300 border border-emerald-900/50 px-2 py-0.5 rounded">
                                                        {kw}
                                                    </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    {aiData?.keywordsMissing && aiData.keywordsMissing.length > 0 && (
                                        <div className="pt-2">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1.5">
                                                <XCircle className="h-3.5 w-3.5" /> Missing Core Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {aiData.keywordsMissing.map((kw, i) => (
                                                <span key={i} className="text-xs bg-rose-950/30 text-rose-300 border border-rose-900/50 px-2 py-0.5 rounded">
                                                    {kw}
                                                </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {aiData?.recommendations && aiData.recommendations.length > 0 && (
                                        <div className="pt-2">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
                                            <AlertCircle className="h-3.5 w-3.5" /> Strategic Advice
                                        </h4>
                                        <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                                            {aiData.recommendations.map((rec, i) => (
                                            <li key={i}>{rec}</li>
                                            ))}
                                        </ul>
                                        </div>
                                    )}
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Generated Resume Tailoring</h4>
                                        <div className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-900 h-45 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                                            {item.tailoredBullets || "No code snippet or bullet modifications generated for this instance."}
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