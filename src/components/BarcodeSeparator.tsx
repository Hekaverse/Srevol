"use client";

export default function BarcodeSeparator({ className = "" }: { className?: string }) {
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2];

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {bars.map((w, i) => (
        <div
          key={i}
          className="bg-warm-white/10"
          style={{ width: w, height: 12 }}
        />
      ))}
    </div>
  );
}
