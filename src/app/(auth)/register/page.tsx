"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import AuthShell from "@/components/AuthShell";
import FloatingInput from "@/components/FloatingInput";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginFormRef = useRef<HTMLFormElement>(null);
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.push("/dashboard");
  }, [status, router]);

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
      const csrfRes = await fetch("/api/auth/csrf", { credentials: "include" });
      const csrfData = await csrfRes.json();

      const form = loginFormRef.current;
      if (form) {
        (form.elements.namedItem("csrfToken") as HTMLInputElement).value = csrfData.csrfToken;
        (form.elements.namedItem("email") as HTMLInputElement).value = email;
        (form.elements.namedItem("password") as HTMLInputElement).value = password;
        form.submit();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell subtitle="Register your traveling party.">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        )}

        <FloatingInput
          id="name"
          type="text"
          label="Primary Traveler Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />

        <FloatingInput
          id="email"
          type="email"
          label="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <FloatingInput
          id="partner-email"
          type="email"
          label="Co-Traveler's Email (optional)"
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
          autoComplete="off"
        />
        <p className="text-xs text-warm-white/15 -mt-3 ml-1">
          Optional — invite them later from your departure lounge.
        </p>

        <FloatingInput
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <p className="text-xs text-warm-white/15 -mt-3 ml-1">
          Min 8 chars, with uppercase, lowercase, and number.
        </p>

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
              Registering...
            </span>
          ) : (
            "Register Traveling Party"
          )}
        </button>
      </form>

      {/* Hidden native form for auto-login */}
      <form
        ref={loginFormRef}
        method="POST"
        action="/api/auth/callback/credentials"
        style={{ display: "none" }}
      >
        <input type="hidden" name="csrfToken" />
        <input type="hidden" name="email" />
        <input type="hidden" name="password" />
        <input type="hidden" name="callbackUrl" value="/dashboard" />
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-warm-white/25">
          Already have a profile?{" "}
          <Link href="/login" className="text-ember/70 hover:text-ember transition-colors duration-300 link-underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
