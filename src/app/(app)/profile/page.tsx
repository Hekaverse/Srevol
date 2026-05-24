"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FloatingInput from "@/components/FloatingInput";
import ScrollReveal from "@/components/ScrollReveal";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.name) setName(session.user.name);
  }, [status, session, router]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to update profile");
      } else {
        setMessage("Profile updated successfully");
        await update();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/me/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to change password");
      } else {
        setMessage("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-lg mx-auto px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">
                Account
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-warm-white tracking-tight">
                Your Profile
              </h1>
            </div>
          </ScrollReveal>

          {message && (
            <div className="mb-6 p-4 bg-green-500/5 border border-green-500/15 rounded-xl">
              <p className="text-sm text-green-400">{message}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <ScrollReveal animation="fade-up" delay={0.1}>
            <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8 mb-6">
              <h2 className="font-serif text-lg font-bold text-warm-white mb-6">
                Personal Info
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <FloatingInput
                  id="name"
                  type="text"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <FloatingInput
                  id="email"
                  type="email"
                  label="Email"
                  value={session?.user?.email || ""}
                  disabled
                  className="opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-medium text-obsidian bg-ember rounded-xl hover:bg-ember-dark transition-all disabled:opacity-40"
                >
                  {loading ? "Saving..." : "Update Profile"}
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.15}>
            <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
              <h2 className="font-serif text-lg font-bold text-warm-white mb-6">
                Change Password
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-5">
                <FloatingInput
                  id="current-password"
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <FloatingInput
                  id="new-password"
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-medium text-warm-white bg-obsidian-light rounded-xl hover:bg-obsidian-muted transition-all border border-obsidian-muted/30 disabled:opacity-40"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
