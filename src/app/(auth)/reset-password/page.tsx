"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AuthShell from "@/components/AuthShell";
import FloatingInput from "@/components/FloatingInput";

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
      <AuthShell subtitle="Reset your password">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-500/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-400/80 mb-6">{error}</p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-ember/70 hover:text-ember transition-colors duration-300 link-underline"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell subtitle="Create a new password">
      {done ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-ember/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-warm-white mb-3">Password updated</h2>
          <p className="text-sm text-warm-white/40 mb-8">
            Your password has been reset successfully.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-sm font-medium text-warm-white bg-ember rounded-full hover:bg-ember-dark transition-all duration-500 ease-expo hover:shadow-lg hover:shadow-ember/15"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
          )}

          <FloatingInput
            id="password"
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <p className="text-xs text-warm-white/15 -mt-3 ml-1">
            Min 8 chars, with uppercase, lowercase, and number.
          </p>

          <FloatingInput
            id="confirm-password"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-base font-medium text-warm-white bg-ember rounded-xl transition-all duration-500 ease-expo hover:bg-ember-dark hover:shadow-lg hover:shadow-ember/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-warm-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

function LoadingState() {
  return (
    <AuthShell subtitle="Reset your password">
      <div className="py-8 space-y-5">
        <div className="h-14 skeleton-shimmer rounded-xl" />
        <div className="h-14 skeleton-shimmer rounded-xl" />
        <div className="h-12 skeleton-shimmer rounded-xl bg-ember/10" />
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
