"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html>
      <body className="bg-obsidian min-h-screen flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-warm-white">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm text-warm-white/30 leading-relaxed">
            Our crew is investigating. You can try again or contact support if the issue persists.
          </p>
          {error.digest && (
            <p className="mt-4 text-[10px] font-mono text-warm-white/15 tracking-wider">
              REF: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
