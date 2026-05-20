"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        toast.success(data.message);
        // Show debug link for testing (remove in production)
        if (data.debugLink) {
          console.log("Reset link:", data.debugLink);
        }
      } else {
        toast.error(data.error || "Failed to send reset link");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <p className="mt-3 text-sm text-warm-white/40">Reset your password</p>
        </div>

        <div className="bg-plum-800/50 backdrop-blur-sm rounded-3xl border border-plum-700/50 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-serif text-xl font-bold text-warm-white mb-2">Check your email</h2>
              <p className="text-sm text-warm-white/50 mb-6">
                If an account exists for {email}, we&apos;ve sent a password reset link.
              </p>
              <Link href="/login" className="text-sm text-rose-gold hover:text-rose-gold-light transition-colors">
                Back to login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-warm-white/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white placeholder:text-warm-white/20 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-base font-medium text-plum-900 bg-rose-gold rounded-xl hover:bg-rose-gold-light transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-warm-white/30 hover:text-rose-gold transition-colors">
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
