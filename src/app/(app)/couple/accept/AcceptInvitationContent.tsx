"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";

type AcceptState =
  | { status: "loading" }
  | { status: "success"; message: string; isExistingUser: boolean }
  | { status: "error"; message: string };

export default function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [state, setState] = useState<AcceptState>({ status: "loading" });

  const acceptInvitation = useCallback(async () => {
    if (!token) {
      setState({ status: "error", message: "Invalid invitation link. No token found." });
      return;
    }

    try {
      const res = await fetch(`/api/couple/accept?token=${encodeURIComponent(token)}`);
      const data = await res.json();

      if (!data.success) {
        setState({ status: "error", message: data.error || "Failed to accept invitation." });
        return;
      }

      const isExistingUser = !data.userId;
      setState({
        status: "success",
        message: data.message,
        isExistingUser,
      });

      // Auto-redirect after a short delay
      setTimeout(() => {
        if (isExistingUser) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      }, 3000);
    } catch {
      setState({ status: "error", message: "Something went wrong. Please try again." });
    }
  }, [token, router]);

  useEffect(() => {
    acceptInvitation();
  }, [acceptInvitation]);

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-md mx-auto px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">
                Partner Invitation
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-warm-white tracking-tight">
                {state.status === "loading"
                  ? "Accepting Invitation"
                  : state.status === "success"
                  ? "Welcome Aboard"
                  : "Invitation Error"}
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.1}>
            <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-10 text-center">
              {state.status === "loading" && (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-10 h-10 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
                  <p className="text-sm text-warm-white/40 tracking-luxury">
                    Accepting your invitation...
                  </p>
                </div>
              )}

              {state.status === "success" && (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-ember/10 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-ember"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-warm-white/70 leading-relaxed">
                      {state.message}
                    </p>
                    <p className="text-xs text-warm-white/25 mt-3 tracking-luxury">
                      Redirecting you{" "}
                      {state.isExistingUser ? "to your dashboard" : "to sign in"}...
                    </p>
                  </div>
                </div>
              )}

              {state.status === "error" && (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-warm-white/70 leading-relaxed">
                      {state.message}
                    </p>
                    <p className="text-xs text-warm-white/25 mt-3 tracking-luxury">
                      Ask your partner to resend the invitation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
