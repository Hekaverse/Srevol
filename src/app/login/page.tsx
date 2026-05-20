"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Show error if redirected back with error param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setError("Invalid email or password");
      } else {
        setError("Sign in failed. Please try again.");
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
      const csrfData = await csrfRes.json();

      // Populate the hidden form and submit it natively
      // The browser handles the POST, 302 redirect, cookie setting, everything
      const form = formRef.current;
      if (!form) throw new Error("Form not found");

      (form.elements.namedItem("csrfToken") as HTMLInputElement).value = csrfData.csrfToken;
      (form.elements.namedItem("email") as HTMLInputElement).value = email;
      (form.elements.namedItem("password") as HTMLInputElement).value = password;

      form.submit();
      // Page will reload — either to /dashboard (success) or /login?error=... (failure)
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
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
          <p className="mt-3 text-sm text-warm-white/40">Welcome back, lover.</p>
        </div>

        <div className="bg-plum-800/50 backdrop-blur-sm rounded-3xl border border-plum-700/50 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warm-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Hidden native form that the browser submits for real */}
          <form
            ref={formRef}
            method="POST"
            action="/api/auth/callback/credentials"
            style={{ display: "none" }}
          >
            <input type="hidden" name="csrfToken" />
            <input type="hidden" name="email" />
            <input type="hidden" name="password" />
            <input type="hidden" name="callbackUrl" value="/dashboard" />
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-warm-white/30">
              <Link href="/forgot-password" className="text-rose-gold hover:text-rose-gold-light transition-colors">
                Forgot your password?
              </Link>
            </p>
            <p className="text-sm text-warm-white/30">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-rose-gold hover:text-rose-gold-light transition-colors">
                Start your journey
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
