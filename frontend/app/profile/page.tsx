'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/api'; // Imported api client
import { User, Mail, BadgeCheck, ShieldCheck, KeyRound, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ProfilePage() {

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<
  { 
    type: 'success' | 'error'; 
    text: string 
  } | null>(null);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-slate-500 text-sm p-4">Loading account details...</div>;
  }

  if (!user) return null;

  // Handle local form validation and submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setStatusMessage({ type: 'error', text: 'All password validation blocks are required.' });
    }

    if (newPassword !== confirmPassword) {
      return setStatusMessage({ type: 'error', text: 'New password selections do not match.' });
    }

    if (newPassword.length < 6) {
      return setStatusMessage({ type: 'error', text: 'New credential must be at least 6 characters long.' });
    }

    setIsSubmitting(true);

    try {
      await api.updatePassword({
        currentPassword,
        newPassword
      });

      setStatusMessage({ type: 'success', text: 'Account password updated successfully!' });
      
      // Clear form inputs safely
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error in changing user account password", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your user profile identity parameters and linked tokens.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
        
        {/* LEFT COLUMN: IDENTITY METRICS CARD */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="h-24 bg-linear-to-r from-teal-950 to-slate-900 border-b border-slate-800 flex items-end p-4">
            <div className="h-14 w-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg transform translate-y-7">
              <User className="h-7 w-7 text-teal-400" />
            </div>
          </div>

          <div className="p-6 pt-12 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  First Name / Identity Label
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

            <div className="pt-4 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-500">
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              <span>Account identity synced successfully via application session cookies.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NEW SECURE PASSWORD ADJUSTMENT COMPONENT */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-400" /> Security Credentials
            </h3>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1 transition-colors focus:outline-none"
            >
              {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{showPasswords ? 'Hide details' : 'Show entries'}</span>
            </button>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {statusMessage && (
              <div className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Current Account Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input 
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-3 py-2 text-sm text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">New Chosen Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input 
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-3 py-2 text-sm text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Confirm New Password</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                <input 
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-10 pr-3 py-2 text-sm text-white placeholder-slate-700 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400 disabled:bg-teal-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Change Password
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}