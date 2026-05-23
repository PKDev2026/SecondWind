"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Mode state: 'login' or 'register'
  const [mode, setMode] = useState<"login" | "register">("login");

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (!authLoading && user) router.push('/');
  }, [user, authLoading, router]);

  // Reset errors/success messages when swapping modes
  const handleModeToggle = (targetMode: "login" | "register") => {
    setMode(targetMode);
    setError("");
    setSuccess("");
  };

  if (authLoading || user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        router.push("/");
      } else {
        await api.register(email, password, firstName, lastName);
        setSuccess("Account created successfully! Automatically signing you in...");
        
        // Auto-login right after registration
        await login(email, password);
        router.push("/");
      }
    } catch (err: unknown) {
      if (mode === "login") {
        setError("Invalid email or password.");
      } else {
        // Safely extract the error message without using 'any'
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {mode === "login" ? "Sign in to Second Wind" : "Get started with Second Wind"}
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-4 bg-green-50 px-3 py-2 rounded-lg">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dynamic Registration Fields */}
          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading 
              ? (mode === "login" ? "Signing in..." : "Creating account...") 
              : (mode === "login" ? "Sign in" : "Sign up")
            }
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="text-sm text-center mt-6 border-t pt-4 text-gray-600">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => handleModeToggle("register")} 
                className="text-blue-600 font-medium hover:underline"
              >
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => handleModeToggle("login")} 
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}