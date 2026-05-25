import React, { useState, useEffect } from "react";
import { FileText, RefreshCw, UploadCloud, CheckCircle, AlertTriangle, Trash2 } from "lucide-react";
import { ResumeUploadZoneProps } from '@/types';

export default function ResumeUploadZone({ onResumeLoaded }: ResumeUploadZoneProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/copilot/resume/data", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.fileName) {
          setFileName(data.fileName);
          if (data.extractedText) {
            onResumeLoaded(data.extractedText);
          }
        }
      })
      .catch((err) => console.error("Error fetching active user profile resume:", err));
  }, [onResumeLoaded]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setStatusMessage({ type: "error", text: "Only PDF documents are supported." });
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8080/api/copilot/resume/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }

      setFileName(selectedFile.name);
      setStatusMessage({ type: "success", text: "Profile resume successfully synced!" });

      const dataRes = await fetch("http://localhost:8080/api/copilot/resume/data", { credentials: "include" });
      const data = await dataRes.json();
      if (data.extractedText) {
        onResumeLoaded(data.extractedText);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to stream binary content.";
      setStatusMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  // NEW: Handler to clear out the database data and clear frontend state
  const handleClearResume = async () => {
    if (!confirm("Are you sure you want to permanently clear your stored resume data?")) return;
    
    try {
      const res = await fetch("http://localhost:8080/api/copilot/resume/clear", {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to clear profile from server.");

      // Reset local component states
      setFileName("");
      setStatusMessage({ type: "success", text: "Stored resume wiped successfully." });
      
      // Clear out the main page's state text box instantly
      onResumeLoaded("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete data.";
      setStatusMessage({ type: "error", text: errorMessage });
    }
  };

  return (
    <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-400" /> Master Account Profile Resume
          </h3>
          <p className="text-xs text-slate-400">
            Persist your default resume text inside PostgreSQL to skip manually copy-pasting it on future pipeline scans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* NEW: Conditional Clear/Trash Button */}
          {fileName && !isUploading && (
            <button
              type="button"
              onClick={handleClearResume}
              className="flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/50 transition-all"
              title="Clear Saved Resume"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <label
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
              isUploading
                ? "bg-slate-900 border-slate-800 text-slate-500 pointer-events-none"
                : "bg-slate-900 border-slate-800 text-white hover:bg-slate-800 hover:border-slate-700"
            }`}
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
                Parsing PDF Bytes...
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5 text-slate-400" />
                {fileName ? "Replace Stored PDF" : "Upload Master PDF"}
              </>
            )}
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} disabled={isUploading} />
          </label>
        </div>
      </div>

      {fileName && !statusMessage && (
        <div className="flex items-center gap-2 text-xs bg-slate-900/50 border border-slate-900/80 p-2.5 rounded-lg text-slate-300">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          <span>Active Pipeline Baseline: <span className="font-mono text-teal-400 font-medium">{fileName}</span></span>
        </div>
      )}

      {statusMessage && (
        <div
          className={`flex items-center gap-2 text-xs p-2.5 rounded-lg border ${
            statusMessage.type === "success"
              ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
              : "bg-rose-950/20 border-rose-500/20 text-rose-400"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}