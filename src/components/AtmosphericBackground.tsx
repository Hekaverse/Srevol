"use client";

export default function AtmosphericBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Single warm orb — back layer */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-breathe"
        style={{
          background: "radial-gradient(circle, rgba(199, 107, 74, 0.08) 0%, transparent 70%)",
          animationDelay: "0s",
          animationDuration: "8s",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(12, 12, 12, 0.5) 100%)",
        }}
      />
    </div>
  );
}
