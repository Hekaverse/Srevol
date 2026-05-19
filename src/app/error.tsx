"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl font-bold text-rose-gold mb-4">Oops</h1>
        <p className="text-warm-white/50 mb-8">
          Something went wrong loading this page. Please try again.
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
    </div>
  );
}
