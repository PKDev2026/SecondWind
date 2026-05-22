"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all font-medium text-sm group text-left"
    >
      <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-400 transition-colors" />
      <span>Sign Out</span>
    </button>
  );
}