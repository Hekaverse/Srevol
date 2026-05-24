"use client";

import { useEffect, useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
  as: Tag = "span",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLSpanElement>(".char");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          chars.forEach((char, i) => {
            char.style.transitionDelay = `${delay + i * stagger}s`;
            char.style.transform = "translateY(0)";
            char.style.opacity = "1";
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, stagger]);

  const words = text.split(" ");

  return (
    <Tag className={className}>
      <div ref={containerRef} className="inline">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split("").map((char, ci) => (
              <span
                key={ci}
                className="char inline-block"
                style={{
                  transform: "translateY(110%)",
                  opacity: "0",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {char}
              </span>
            ))}
            {wi < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </div>
    </Tag>
  );
}
