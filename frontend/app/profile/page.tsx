'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, BadgeCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Route guarding checklist
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-slate-500 text-sm">Loading account details...</div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your user profile identity parameters and linked tokens.</p>
      </div>

      <div className="max-w-xl rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        {/* Banner Segment Accents */}
        <div className="h-24 bg-linear-to-r from-teal-950 to-slate-900 border-b border-slate-800 flex items-end p-4">
          <div className="h-14 w-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg transform translate-y-7">
            <User className="h-7 w-7 text-teal-400" />
          </div>
        </div>

        {/* Info Fields Body */}
        <div className="p-6 pt-12 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Identity Label
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-200">
                <User className="h-4 w-4 text-slate-600 shrink-0" />
                <span className={user.firstName ? "text-white font-medium" : "text-slate-600 italic"}>
                  {user.firstName || "Not provided yet"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Primary Account Email Address
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-800/80 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-200">
                <Mail className="h-4 w-4 text-slate-600 shrink-0" />
                <span className="font-medium text-white">{user.email}</span>
              </div>
            </div>
          </div>

          {/* System Validation Info Footer Section */}
          <div className="pt-4 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-500">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            <span>Account identity synced successfully via application session cookies.</span>
          </div>
        </div>
      </div>
    </div>
  );
}