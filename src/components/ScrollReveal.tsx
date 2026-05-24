"use client";

import { useEffect, useRef, type ReactNode } from "react";

type AnimationType =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "blur-in"
  | "line-reveal";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  distance?: number;
}

export default function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  className = "",
  once = true,
  distance = 24,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const getInitialStyles = () => {
      const base = { opacity: "0", transition: `all ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` };
      switch (animation) {
        case "fade-up":
          return { ...base, transform: `translateY(${distance}px)` };
        case "fade-down":
          return { ...base, transform: `translateY(-${distance}px)` };
        case "fade-left":
          return { ...base, transform: `translateX(${distance}px)` };
        case "fade-right":
          return { ...base, transform: `translateX(-${distance}px)` };
        case "scale-in":
          return { ...base, transform: "scale(0.95)" };
        case "blur-in":
          return { ...base, filter: "blur(8px)", transform: "translateY(20px)" };
        case "line-reveal":
          return { ...base, clipPath: "inset(100% 0 0 0)", transform: "translateY(20px)" };
        default:
          return base;
      }
    };

    const getVisibleStyles = () => {
      const base = { opacity: "1", transform: "none", filter: "none", clipPath: "none" };
      return base;
    };

    // Apply initial hidden state
    Object.assign(el.style, getInitialStyles());

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          Object.assign(el.style, getVisibleStyles());
          if (once) observer.unobserve(el);
        } else if (!once) {
          Object.assign(el.style, getInitialStyles());
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, duration, threshold, once, distance]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
