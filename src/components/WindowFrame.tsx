"use client";

import { useEffect, useState } from "react";

function DriftingCloud({ side, delay }: { side: "left" | "right" | "top" | "bottom"; delay: number }) {
  const isHorizontal = side === "left" || side === "right";
  const basePosition = Math.random() * 80 + 10;
  const duration = 20 + Math.random() * 30;
  const size = 60 + Math.random() * 100;

  const style: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: isHorizontal ? size * 0.6 : size,
    borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(250,247,242,0.04) 0%, transparent 70%)",
    filter: "blur(20px)",
    animation: `drift-${side} ${duration}s linear infinite`,
    animationDelay: `${delay}s`,
  };

  if (side === "left") {
    style.left = -size / 2;
    style.top = `${basePosition}%`;
  } else if (side === "right") {
    style.right = -size / 2;
    style.top = `${basePosition}%`;
  } else if (side === "top") {
    style.top = -size / 2;
    style.left = `${basePosition}%`;
  } else {
    style.bottom = -size / 2;
    style.left = `${basePosition}%`;
  }

  return <div style={style} />;
}

export default function WindowFrame() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate persistent cloud configs
  const clouds = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    side: (["left", "right", "top", "bottom"] as const)[i % 4],
    delay: i * 3,
  }));

  return (
    <>
      {/* Global keyframes for cloud drift */}
      <style>{`
        @keyframes drift-left {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(20px) translateY(-10px); }
          50% { transform: translateX(-10px) translateY(5px); }
          75% { transform: translateX(15px) translateY(-5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes drift-right {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-20px) translateY(10px); }
          50% { transform: translateX(10px) translateY(-5px); }
          75% { transform: translateX(-15px) translateY(5px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes drift-top {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(10px) translateY(20px); }
          50% { transform: translateX(-5px) translateY(-10px); }
          75% { transform: translateX(5px) translateY(15px); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes drift-bottom {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-10px) translateY(-20px); }
          50% { transform: translateX(5px) translateY(10px); }
          75% { transform: translateX(-5px) translateY(-15px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>

      {/* Outer frame — the airplane window surround */}
      <div className="fixed inset-0 z-[90] pointer-events-none">
        {/* Top frame */}
        <div
          className="absolute top-0 left-0 right-0 h-4 lg:h-6"
          style={{
            background: "linear-gradient(to bottom, #0a0a0a 0%, #0C0C0C 40%, transparent 100%)",
          }}
        />
        {/* Bottom frame */}
        <div
          className="absolute bottom-0 left-0 right-0 h-4 lg:h-6"
          style={{
            background: "linear-gradient(to top, #0a0a0a 0%, #0C0C0C 40%, transparent 100%)",
          }}
        />
        {/* Left frame */}
        <div
          className="absolute top-0 bottom-0 left-0 w-4 lg:w-6"
          style={{
            background: "linear-gradient(to right, #0a0a0a 0%, #0C0C0C 40%, transparent 100%)",
          }}
        />
        {/* Right frame */}
        <div
          className="absolute top-0 bottom-0 right-0 w-4 lg:w-6"
          style={{
            background: "linear-gradient(to left, #0a0a0a 0%, #0C0C0C 40%, transparent 100%)",
          }}
        />

        {/* Inner bevel line */}
        <div className="absolute top-4 lg:top-6 left-4 lg:left-6 right-4 lg:right-6 bottom-4 lg:bottom-6 border border-warm-white/[0.03]" />

        {/* Corner radius hint */}
        <div
          className="absolute top-4 lg:top-6 left-4 lg:left-6 w-16 h-16"
          style={{
            borderTop: "1px solid rgba(250,247,242,0.04)",
            borderLeft: "1px solid rgba(250,247,242,0.04)",
            borderTopLeftRadius: "24px",
          }}
        />
        <div
          className="absolute top-4 lg:top-6 right-4 lg:right-6 w-16 h-16"
          style={{
            borderTop: "1px solid rgba(250,247,242,0.04)",
            borderRight: "1px solid rgba(250,247,242,0.04)",
            borderTopRightRadius: "24px",
          }}
        />
        <div
          className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 w-16 h-16"
          style={{
            borderBottom: "1px solid rgba(250,247,242,0.04)",
            borderLeft: "1px solid rgba(250,247,242,0.04)",
            borderBottomLeftRadius: "24px",
          }}
        />
        <div
          className="absolute bottom-4 lg:bottom-6 right-4 lg:right-6 w-16 h-16"
          style={{
            borderBottom: "1px solid rgba(250,247,242,0.04)",
            borderRight: "1px solid rgba(250,247,242,0.04)",
            borderBottomRightRadius: "24px",
          }}
        />

        {/* Drifting clouds at edges */}
        {clouds.map((cloud) => (
          <DriftingCloud key={cloud.id} side={cloud.side} delay={cloud.delay} />
        ))}
      </div>
    </>
  );
}
