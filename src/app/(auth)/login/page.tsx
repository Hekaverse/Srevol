"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthShell from "@/components/AuthShell";
import FloatingInput from "@/components/FloatingInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

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

      const form = formRef.current;
      if (!form) throw new Error("Form not found");

      (form.elements.namedItem("csrfToken") as HTMLInputElement).value = csrfData.csrfToken;
      (form.elements.namedItem("email") as HTMLInputElement).value = email;
      (form.elements.namedItem("password") as HTMLInputElement).value = password;

      form.submit();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell subtitle="Welcome back, traveler.">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        )}

        <FloatingInput
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <FloatingInput
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
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
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Hidden native form */}
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

      <div className="mt-8 text-center space-y-3">
        <p className="text-sm text-warm-white/25">
          <Link href="/forgot-password" className="text-ember/70 hover:text-ember transition-colors duration-300 link-underline">
            Forgot your password?
          </Link>
        </p>
        <p className="text-sm text-warm-white/25">
          Don&apos;t have a profile?{" "}
          <Link href="/register" className="text-ember/70 hover:text-ember transition-colors duration-300 link-underline">
            Register your party
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
