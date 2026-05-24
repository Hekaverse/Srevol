import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
            <p className="text-sm text-warm-white/30 tracking-luxury">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
