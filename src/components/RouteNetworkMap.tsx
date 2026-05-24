"use client";

import { useEffect, useState, useRef } from "react";

interface RouteNode {
  code: string;
  city: string;
  country: string;
  x: number;
  y: number;
  tier: "horizon" | "meridian" | "celestial" | "astral";
}

const routes: RouteNode[] = [
  { code: "SV-005", city: "Bali", country: "Indonesia", x: 82, y: 72, tier: "horizon" },
  { code: "SV-009", city: "Tulum", country: "Mexico", x: 26, y: 42, tier: "horizon" },
  { code: "SV-010", city: "Costa Rica", country: "", x: 27, y: 48, tier: "horizon" },
  { code: "SV-011", city: "Portugal", country: "", x: 48, y: 32, tier: "horizon" },
  { code: "SV-012", city: "Morocco", country: "", x: 48, y: 36, tier: "horizon" },
  { code: "SV-001", city: "Santorini", country: "Greece", x: 57, y: 30, tier: "meridian" },
  { code: "SV-019", city: "Amalfi Coast", country: "Italy", x: 54, y: 29, tier: "meridian" },
  { code: "SV-006", city: "Kyoto", country: "Japan", x: 88, y: 31, tier: "meridian" },
  { code: "SV-020", city: "Swiss Alps", country: "", x: 52, y: 27, tier: "meridian" },
  { code: "SV-002", city: "Maldives", country: "", x: 70, y: 55, tier: "meridian" },
  { code: "SV-003", city: "Bora Bora", country: "", x: 8, y: 65, tier: "celestial" },
  { code: "SV-004", city: "Seychelles", country: "", x: 60, y: 58, tier: "celestial" },
  { code: "SV-013", city: "Patagonia", country: "Argentina", x: 30, y: 82, tier: "celestial" },
  { code: "SV-014", city: "Kenya", country: "", x: 60, y: 53, tier: "celestial" },
  { code: "SV-015", city: "Norway", country: "", x: 57, y: 12, tier: "celestial" },
  { code: "SV-016", city: "Private Island", country: "Caribbean", x: 32, y: 43, tier: "astral" },
  { code: "SV-017", city: "Antarctica", country: "", x: 50, y: 92, tier: "astral" },
  { code: "SV-018", city: "Around the World", country: "", x: 50, y: 50, tier: "astral" },
  { code: "SV-007", city: "Paris", country: "France", x: 51, y: 25, tier: "meridian" },
  { code: "SV-008", city: "Dubai", country: "UAE", x: 65, y: 38, tier: "meridian" },
];

const tierColors: Record<string, string> = {
  horizon: "#C9A87C",
  meridian: "#C97B7B",
  celestial: "#D4A574",
  astral: "#E8C9A0",
};

function FlightPath({
  from,
  to,
  delay,
  tier,
}: {
  from: { x: number; y: number };
  to: RouteNode;
  delay: number;
  tier: string;
}) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDrawn(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const midX = (from.x + to.x) / 2;
  const midY = Math.min(from.y, to.y) - 8;
  const pathD = `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;

  return (
    <g>
      <path d={pathD} fill="none" stroke={tierColors[tier]} strokeWidth="0.12" opacity="0.1" />
      <path
        d={pathD}
        fill="none"
        stroke={tierColors[tier]}
        strokeWidth="0.2"
        opacity={drawn ? "0.4" : "0"}
        className="transition-all duration-[2000ms] ease-expo"
        style={{ strokeDasharray: "100", strokeDashoffset: drawn ? "0" : "100" }}
      />
      {drawn && (
        <circle r="0.3" fill={tierColors[tier]} opacity="0.7">
          <animateMotion dur={`${5 + Math.random() * 4}s`} repeatCount="indefinite" path={pathD} />
        </circle>
      )}
    </g>
  );
}

function PulseDot({ node, delay }: { node: RouteNode; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <g style={{ opacity: visible ? 1 : 0, transition: `opacity 0.8s ease ${delay}ms` }}>
      <circle cx={node.x} cy={node.y} r="1.2" fill="none" stroke={tierColors[node.tier]} strokeWidth="0.08" opacity="0.2">
        <animate attributeName="r" values="1.2;2.5;1.2" dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={node.x} cy={node.y} r="0.5" fill={tierColors[node.tier]} opacity="0.85" />
      <text x={node.x} y={node.y + 2.2} textAnchor="middle" className="fill-warm-white/30" style={{ fontSize: "1.6px", fontFamily: "monospace", letterSpacing: "0.1em" }}>
        {node.city}
      </text>
      <text x={node.x} y={node.y - 1.4} textAnchor="middle" className="fill-warm-white/15" style={{ fontSize: "1.2px", fontFamily: "monospace" }}>
        {node.code}
      </text>
    </g>
  );
}

export default function RouteNetworkMap() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hub = { x: 50, y: 35 };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-obsidian relative">
      {/* Top hairline */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="hairline" />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div
            className={`transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/20">
              Coverage
            </span>
            <p className="mt-2 font-serif text-lg text-warm-white/40">
              20 routes · 4 classes · 6 continents
            </p>
          </div>

          {/* Legend */}
          <div
            className={`hidden lg:flex items-center gap-6 transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            {[
              { tier: "horizon", label: "Horizon", color: "#C9A87C" },
              { tier: "meridian", label: "Meridian", color: "#C97B7B" },
              { tier: "celestial", label: "Celestial", color: "#D4A574" },
              { tier: "astral", label: "Astral", color: "#E8C9A0" },
            ].map((item) => (
              <div key={item.tier} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] text-warm-white/20 tracking-wider uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width map */}
        <div
          className={`transition-all duration-[1500ms] ease-expo ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          <div className="relative aspect-[2/1]">
            <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
              {/* Faint grid */}
              <g opacity="0.03">
                {Array.from({ length: 11 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 10} y2={60} stroke="#FAF7F2" strokeWidth="0.04" />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line key={`h${i}`} x1={0} y1={i * 10} x2={100} y2={i * 10} stroke="#FAF7F2" strokeWidth="0.04" />
                ))}
              </g>

              {/* Continent dots */}
              <g opacity="0.025">
                {[
                  [15,20],[20,18],[25,16],[30,18],[32,22],[30,28],[28,32],[25,35],[22,38],[18,35],[15,30],[12,25],
                  [28,42],[30,48],[32,55],[30,62],[28,70],[26,75],[28,80],[30,82],[28,85],[26,82],[25,75],[24,65],[25,55],[26,48],[27,42],
                  [48,22],[50,20],[52,18],[54,20],[56,22],[58,24],[56,26],[54,28],[52,28],[50,26],[48,24],
                  [48,35],[50,38],[52,42],[54,48],[55,55],[54,60],[52,58],[50,55],[48,50],[47,45],[47,40],[48,35],
                  [60,20],[65,18],[70,20],[75,22],[80,24],[85,26],[88,28],[90,30],[88,32],[85,34],[80,32],[75,30],[70,28],[65,26],[60,24],
                  [78,58],[82,56],[86,58],[88,62],[86,66],[82,68],[78,66],[76,62],
                ].map(([x, y], i) => (
                  <circle key={`land-${i}`} cx={x} cy={y} r="0.25" fill="#FAF7F2" />
                ))}
              </g>

              {/* Hub */}
              <g>
                <circle cx={hub.x} cy={hub.y} r="2" fill="none" stroke="#C76B4A" strokeWidth="0.12" opacity="0.3">
                  <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx={hub.x} cy={hub.y} r="0.7" fill="#C76B4A" opacity="0.8" />
              </g>

              {/* Flight paths */}
              {routes.map((route, i) => (
                <FlightPath key={`path-${route.code}`} from={hub} to={route} delay={500 + i * 100} tier={route.tier} />
              ))}

              {/* Route nodes */}
              {routes.map((route, i) => (
                <PulseDot key={route.code} node={route} delay={700 + i * 80} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
