"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, FileText } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define which paths should NOT display the sidebar navigation
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // If they are logging in or registering, render a clean, full-screen viewport without the app frame
  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  // Otherwise, render the complete dashboard layout shell with the sidebar mounted
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6 flex flex-col justify-between h-screen sticky top-0 intense-shadow">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-950">
              SW
            </div>
            <span className="text-xl font-bold tracking-tight text-white">SecondWind</span>
          </div>

          <nav className="space-y-1">
            <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${pathname === "/" ? "text-teal-400 bg-slate-900" : "text-slate-400 hover:text-teal-400 hover:bg-slate-900/50"}`}>
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
            <Link href="/tracker" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${pathname === "/tracker" ? "text-teal-400 bg-slate-900" : "text-slate-400 hover:text-teal-400 hover:bg-slate-900/50"}`}>
              <Briefcase className="h-5 w-5" /> Job Tracker
            </Link>
            <Link href="/copilot" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${pathname === "/copilot" ? "text-teal-400 bg-slate-900" : "text-slate-400 hover:text-teal-400 hover:bg-slate-900/50"}`}>
              <FileText className="h-5 w-5" /> AI Resume Copilot
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <LogoutButton />
          <div className="px-1 pt-1">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-600">Job OS v1.0.0</p>
            <p className="text-xs text-slate-500 font-medium">Shift Gears</p>
          </div>
        </div>
      </aside>

      {/* Main Feature Content Canvas */}
      <main className="flex-1 bg-slate-900 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}