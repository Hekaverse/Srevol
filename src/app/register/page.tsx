"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerConsent, setPartnerConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    if (partnerEmail && !partnerConsent) {
      setError("Please confirm you have your partner's consent to share their email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, partnerEmail: partnerEmail || undefined }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      try {
        const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
        const csrfData = await csrfRes.json();

        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("csrfToken", csrfData.csrfToken);
        formData.append("callbackUrl", "/dashboard");
        formData.append("json", "true");

        const loginRes = await fetch("/api/auth/callback/credentials", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
          credentials: "include",
          redirect: "manual",
        });

        const location = loginRes.headers.get("location") || "";
        if (location.includes("/dashboard")) {
          toast.success("Welcome to SREVOL! Your couple profile is ready.");
          router.push("/dashboard");
          router.refresh();
          return;
        }
      } catch {
        // silent fail — user can log in manually
      }

      setError("Account created! Please sign in manually.");
      setLoading(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-plum-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
          <p className="mt-3 text-sm text-warm-white/40">Begin your shared adventure.</p>
        </div>

        <div className="bg-plum-800/50 backdrop-blur-sm rounded-3xl border border-plum-700/50 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-warm-white/70 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white placeholder:text-warm-white/20 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-transparent transition-all"
                placeholder="Alex"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-white/70 mb-2">
                Your Email
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
              <label htmlFor="partner-email" className="block text-sm font-medium text-warm-white/70 mb-2">
                Partner&apos;s Email
              </label>
              <input
                type="email"
                id="partner-email"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white placeholder:text-warm-white/20 focus:outline-none focus:ring-2 focus:ring-rose-gold/50 focus:border-transparent transition-all"
                placeholder="partner@example.com"
              />
              <p className="mt-1.5 text-xs text-warm-white/20">
                We&apos;ll send them an invite to join your couple profile.
              </p>
            </div>

            {partnerEmail && (
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="partner-consent"
                  checked={partnerConsent}
                  onChange={(e) => setPartnerConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-plum-600 bg-plum-900/50 text-rose-gold focus:ring-rose-gold/50"
                />
                <label htmlFor="partner-consent" className="text-sm text-warm-white/50">
                  I confirm I have my partner&apos;s consent to share their email address with SREVOL.
                </label>
              </div>
            )}

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
                placeholder="Min 8 chars, upper, lower, number"
              />
              <p className="mt-1.5 text-xs text-warm-white/20">
                Must be at least 8 characters with uppercase, lowercase, and a number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-medium text-plum-900 bg-rose-gold rounded-xl hover:bg-rose-gold-light transition-all disabled:opacity-50"
            >
              {loading ? "Creating Profile..." : "Create Couple Profile"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-warm-white/30">
              Already have an account?{" "}
              <Link href="/login" className="text-rose-gold hover:text-rose-gold-light transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
