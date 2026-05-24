"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
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

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onElementHover);
    document.body.addEventListener("mouseenter", onMouseEnter);
    document.body.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onElementHover);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      {/* Small dot — follows immediately */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${position.x - 2}px, ${position.y - 2}px)`,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="w-1 h-1 bg-warm-white" />
      </div>

      {/* Outer ring — follows with delay, expands on hover */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          opacity: isVisible ? (isHovering ? 0.6 : 0.3) : 0,
          transition: "transform 0.15s ease-out, opacity 0.3s ease, width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), margin 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="border border-warm-white/40"
          style={{
            width: isHovering ? 48 : 24,
            height: isHovering ? 48 : 24,
            marginLeft: isHovering ? -24 : -12,
            marginTop: isHovering ? -24 : -12,
          }}
        />
      </div>
    </>
  );
}
