"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import AuthShell from "@/components/AuthShell";
import FloatingInput from "@/components/FloatingInput";
import TakeoffLoader from "@/components/TakeoffLoader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { status } = useSession();

  const router = useRouter();

  // Redirect already-authenticated users away from login page
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Read error from URL query params (in case of redirect back from failed attempt)
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
    setIsSigningIn(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setIsSigningIn(false);
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else {
          setError("Sign in failed. Please try again.");
        }
        return;
      }

      if (result?.ok) {
        // Small delay so the takeoff animation plays before navigating
        setTimeout(() => {
          window.location.href = "/";
        }, 1400);
      } else {
        setIsSigningIn(false);
        setError("Sign in failed. Please try again.");
      }
    } catch {
      setIsSigningIn(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {isSigningIn && <TakeoffLoader message="Cleared for Departure" />}

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
            disabled={isSigningIn}
            className="w-full py-3.5 text-base font-medium text-warm-white bg-ember rounded-xl transition-all duration-500 ease-expo hover:bg-ember-dark hover:shadow-lg hover:shadow-ember/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSigningIn ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-warm-white/50">
            <Link href="/forgot-password" className="text-ember/70 hover:text-ember transition-colors duration-300 link-underline">
              Forgot your password?
            </Link>
          </p>
          <p className="text-sm text-warm-white/50">
            Don&apos;t have a profile?{" "}
            <Link href="/register" className="text-ember/70 hover:text-ember transition-colors duration-300 link-underline">
              Register your party
            </Link>
          </p>
        </div>
      </AuthShell>
    </>
  );
}
