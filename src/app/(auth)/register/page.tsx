"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import AuthShell from "@/components/AuthShell";
import FloatingInput from "@/components/FloatingInput";
import TakeoffLoader from "@/components/TakeoffLoader";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [takeoffMessage, setTakeoffMessage] = useState("Cleared for Departure");
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
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

    setIsSigningIn(true);

    try {
      // Register the user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, partnerEmail: partnerEmail || undefined }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed");
        setIsSigningIn(false);
        return;
      }

      // Auto-login after successful registration
      setTakeoffMessage("Boarding Pass Confirmed");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setIsSigningIn(false);
        setError("Account created, but auto-login failed. Please sign in manually.");
        return;
      }

      if (result?.ok) {
        setTimeout(() => {
          window.location.href = "/";
        }, 1400);
      } else {
        setIsSigningIn(false);
        setError("Account created, but auto-login failed. Please sign in manually.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
      setIsSigningIn(false);
    }
  }

  return (
    <>
      {isSigningIn && <TakeoffLoader message={takeoffMessage} />}

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
          <p className="text-xs text-warm-white/40 -mt-3 ml-1">
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
          <p className="text-xs text-warm-white/40 -mt-3 ml-1">
            Min 8 chars, with uppercase, lowercase, and number.
          </p>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-3.5 text-base font-medium text-warm-white bg-ember rounded-xl transition-all duration-500 ease-expo hover:bg-ember-dark hover:shadow-lg hover:shadow-ember/15 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSigningIn ? "Boarding..." : "Register Traveling Party"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-warm-white/50">
            Already have a profile?{" "}
            <Link href="/login" className="text-ember/70 hover:text-ember transition-colors duration-300 link-underline">
              Sign in
            </Link>
          </p>
        </div>
      </AuthShell>
    </>
  );
}
