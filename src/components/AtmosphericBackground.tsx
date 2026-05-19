"use client";

export default function AtmosphericBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large plum orb */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full animate-breathe"
        style={{
          background: "radial-gradient(circle, rgba(90, 60, 90, 0.4) 0%, transparent 70%)",
          animationDelay: "0s",
        }}
      />
      
      {/* Rose gold orb */}
      <div
        className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full animate-breathe"
        style={{
          background: "radial-gradient(circle, rgba(212, 165, 116, 0.15) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
      
      {/* Blush orb */}
      <div
        className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full animate-breathe"
        style={{
          background: "radial-gradient(circle, rgba(201, 123, 123, 0.2) 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />

      {/* Floating particles */}
      {[
        { top: "15%", left: "10%", size: 4, delay: "0s", duration: "8s" },
        { top: "25%", left: "85%", size: 3, delay: "2s", duration: "10s" },
        { top: "60%", left: "15%", size: 5, delay: "1s", duration: "12s" },
        { top: "70%", left: "75%", size: 3, delay: "3s", duration: "9s" },
        { top: "40%", left: "50%", size: 2, delay: "4s", duration: "11s" },
        { top: "80%", left: "40%", size: 4, delay: "1.5s", duration: "7s" },
        { top: "10%", left: "60%", size: 3, delay: "5s", duration: "13s" },
      ].map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float-slow"
          style={{
            top: particle.top,
            left: particle.left,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: i % 3 === 0 
              ? "rgba(212, 165, 116, 0.4)" 
              : i % 3 === 1 
                ? "rgba(201, 123, 123, 0.3)" 
                : "rgba(184, 156, 184, 0.3)",
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,165,116,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,165,116,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
