"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined" || "ontouchstart" in window) return;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = Boolean(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      );
      setIsHovering(isInteractive);
    };

    // RAF loop for smooth but instant tracking
    const animate = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const target = posRef.current;

      if (dot) {
        dot.style.transform = `translate(${target.x - 3}px, ${target.y - 3}px)`;
      }

      if (ring) {
        // Ring follows with very slight inertia (not lag, just weight)
        ringPosRef.current.x += (target.x - ringPosRef.current.x) * 0.35;
        ringPosRef.current.y += (target.y - ringPosRef.current.y) * 0.35;
        const size = isHovering ? 48 : 24;
        ring.style.transform = `translate(${ringPosRef.current.x - size / 2}px, ${ringPosRef.current.y - size / 2}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onElementHover);
    document.body.addEventListener("mouseenter", onMouseEnter);
    document.body.addEventListener("mouseleave", onMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onElementHover);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isHovering]);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      {/* Core dot — instant, no transition */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 6,
          height: 6,
          opacity: isVisible ? 1 : 0,
          willChange: "transform",
        }}
      >
        <div
          className="w-full h-full bg-warm-white"
          style={{
            mixBlendMode: "difference",
          }}
        />
      </div>

      {/* Outer ring — slight follow weight, no CSS transition */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: isHovering ? 48 : 24,
          height: isHovering ? 48 : 24,
          opacity: isVisible ? (isHovering ? 0.5 : 0.25) : 0,
          willChange: "transform, width, height",
          transition: "width 0.15s ease-out, height 0.15s ease-out, opacity 0.15s ease-out",
        }}
      >
        <div className="w-full h-full border border-warm-white/40" />
      </div>
    </>
  );
}
