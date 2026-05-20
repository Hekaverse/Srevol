"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain uppercase, lowercase, and a number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        setDone(true);
        toast.success(data.message);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-plum-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Link href="/" className="inline-block mb-8">
            <span className="font-serif text-3xl font-bold text-warm-white">SREVOL</span>
          </Link>
          <div className="bg-plum-800/50 rounded-3xl border border-plum-700/50 p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/forgot-password" className="text-rose-gold hover:text-rose-gold-light transition-colors">
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plum-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(90,60,90,0.5) 0%, transparent 70%)" }}
      />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(212,165,116,0.2) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-serif text-3xl font-bold text-warm-white">SREVOL</span>
          </Link>
          <p className="mt-3 text-sm text-warm-white/40">Create a new password</p>
        </div>

        <div className="bg-plum-800/50 backdrop-blur-sm rounded-3xl border border-plum-700/50 p-8">
          {done ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-2">Password updated</h2>
              <p className="text-sm text-warm-white/50 mb-6">
                Your password has been reset successfully.
              </p>
              <Link href="/login" className="inline-block px-6 py-2.5 text-sm font-medium text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all">
                Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-warm-white/70 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white placeholder:text-warm-white/20 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-transparent transition-all"
                  placeholder="Min 8 chars, upper, lower, number"
                />
                <p className="mt-1.5 text-xs text-warm-white/20">
                  Must be at least 8 characters with uppercase, lowercase, and a number.
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-warm-white/70 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white placeholder:text-warm-white/20 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-base font-medium text-plum-900 bg-rose-gold rounded-xl hover:bg-rose-gold-light transition-all disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-plum-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <span className="font-serif text-3xl font-bold text-warm-white">SREVOL</span>
        </Link>
        <div className="bg-plum-800/50 rounded-3xl border border-plum-700/50 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-plum-700 rounded w-3/4 mx-auto" />
            <div className="h-10 bg-plum-700 rounded" />
            <div className="h-10 bg-plum-700 rounded" />
            <div className="h-10 bg-rose-gold/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
