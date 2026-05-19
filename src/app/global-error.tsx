"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-plum-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-5xl font-bold text-rose-gold mb-4">Something broke</h1>
          <p className="text-warm-white/50 mb-8">
            We&apos;re sorry — an unexpected error occurred. Our team has been notified.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 text-sm font-medium text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all"
          >
            Try Again
          </button>
          {error.digest && (
            <p className="mt-6 text-xs text-warm-white/20 font-mono">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
