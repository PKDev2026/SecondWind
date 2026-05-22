import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, Briefcase, FileText } from "lucide-react";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Second Wind | Job OS",
  description: "Lightweight Personal ATS & AI Career Copilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100 antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar Component */}
            <aside className="w-64 border-r border-slate-800 bg-slate-950 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <div className="h-8 w-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-950">
                    SW
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">SecondWind</span>
                </div>

                <nav className="space-y-1">
                  <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-all font-medium">
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </Link>
                  <Link href="/tracker" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-all font-medium">
                    <Briefcase className="h-5 w-5" /> Job Tracker
                  </Link>
                  <Link href="/copilot" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-all font-medium">
                    <FileText className="h-5 w-5" /> AI Resume Copilot
                  </Link>
                </nav>
              </div>
              
              <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
                Job OS v1.0.0 • Shift Gears
              </div>
            </aside>

            {/* Main Dashboard Panel */}
            <main className="flex-1 bg-slate-900 p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}