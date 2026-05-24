"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-obsidian-light/95 backdrop-blur-sm rounded-2xl border border-obsidian-muted/50 p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-warm-white/80">
              We use cookies to enhance your visit, analyze site traffic, and serve personalized content.{" "}
              <Link href="/privacy" className="text-ember hover:underline">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={decline}
              className="px-4 py-2 text-sm text-warm-white/60 hover:text-warm-white transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 text-sm font-medium text-warm-white bg-ember rounded-full hover:bg-ember-dark transition-all"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
