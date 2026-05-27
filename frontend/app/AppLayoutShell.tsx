"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, FileText, User } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/context/AuthContext";

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  const userDisplayName = user?.firstName || user?.email?.split('@')[0] || "Developer";
  const userInitials = user?.firstName ? user.firstName.substring(0, 2).toUpperCase() : userDisplayName.substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6 flex flex-col justify-between h-screen sticky top-0 intense-shadow">
        <div>
          {/* Logo & Dynamic Branding Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-950">
                SW
              </div>
              <span className="text-xl font-bold tracking-tight text-white">SecondWind</span>
            </div>

            {/* LoggedIn User Interface Card */}
            {!loading && user && (
              <div className="flex items-center gap-3 bg-slate-900/50 rounded-xl border border-slate-800/60 p-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{userDisplayName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
            )}
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
            <Link href="/history" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${pathname === "/history" ? "text-teal-400 bg-slate-900" : "text-slate-400 hover:text-teal-400 hover:bg-slate-900/50"}`}>
              <FileText className="h-5 w-5" /> Saved Optimizations
            </Link>
          </nav>
        </div>
        
        <div className="border-t border-slate-800 pt-4 space-y-3">
          {/* Profile Page SideBar */}
          <Link href="/profile" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${pathname === "/profile" ? "text-teal-400 bg-slate-900" : "text-slate-400 hover:text-teal-400 hover:bg-slate-900/50"}`}>
            <User className="h-4 w-4" /> My Profile
          </Link>

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