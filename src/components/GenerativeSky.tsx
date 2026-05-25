"use client";

import { useEffect, useRef } from "react";

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function GenerativeSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize clouds
    const initClouds = () => {
      cloudsRef.current = Array.from({ length: 12 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        size: 80 + Math.random() * 200,
        speed: 0.05 + Math.random() * 0.15,
        opacity: 0.01 + Math.random() * 0.03,
      }));
    };
    initClouds();

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const clouds = cloudsRef.current;
      const mouse = mouseRef.current;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw gradient sky
      const hour = new Date().getHours();
      let topColor: string;
      let bottomColor: string;

      if (hour >= 5 && hour < 8) {
        // Dawn
        topColor = "rgba(12, 12, 12, 1)";
        bottomColor = "rgba(30, 20, 15, 0.3)";
      } else if (hour >= 8 && hour < 17) {
        // Day
        topColor = "rgba(12, 12, 12, 1)";
        bottomColor = "rgba(15, 15, 20, 0.2)";
      } else if (hour >= 17 && hour < 20) {
        // Golden hour
        topColor = "rgba(12, 12, 12, 1)";
        bottomColor = "rgba(40, 25, 15, 0.25)";
      } else {
        // Night
        topColor = "rgba(8, 8, 12, 1)";
        bottomColor = "rgba(12, 12, 20, 0.15)";
      }

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, topColor);
      grad.addColorStop(1, bottomColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw clouds
      clouds.forEach((cloud) => {
        // Mouse parallax
        const parallaxX = (mouse.x - w / 2) * 0.01 * (cloud.size / 200);
        const parallaxY = (mouse.y - h / 2) * 0.005 * (cloud.size / 200);

        const cx = cloud.x + parallaxX;
        const cy = cloud.y + parallaxY;

        const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloud.size);
        cloudGrad.addColorStop(0, `rgba(250, 247, 242, ${cloud.opacity})`);
        cloudGrad.addColorStop(0.5, `rgba(250, 247, 242, ${cloud.opacity * 0.3})`);
        cloudGrad.addColorStop(1, "rgba(250, 247, 242, 0)");

        ctx.fillStyle = cloudGrad;
        ctx.fillRect(cx - cloud.size, cy - cloud.size * 0.4, cloud.size * 2, cloud.size * 0.8);

        // Drift
        cloud.x += cloud.speed;
        if (cloud.x > w + cloud.size) {
          cloud.x = -cloud.size;
          cloud.y = Math.random() * h * 0.6;
        }
      });

      // Occasional shooting star (rare)
      frameRef.current++;
      if (frameRef.current % 600 === 0) {
        drawShootingStar(ctx, w, h);
      }

      animId = requestAnimationFrame(draw);
    };

    const drawShootingStar = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number
    ) => {
      const sx = Math.random() * w;
      const sy = Math.random() * h * 0.3;
      const len = 60 + Math.random() * 100;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;

      let progress = 0;
      const starAnim = () => {
        progress += 0.03;
        if (progress > 1.5) return;

        const alpha = progress < 0.3 ? progress / 0.3 : progress > 1 ? (1.5 - progress) / 0.5 : 1;
        const ex = sx + Math.cos(angle) * len * Math.min(progress, 1);
        const ey = sy + Math.sin(angle) * len * Math.min(progress, 1);

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(250, 247, 242, ${alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        requestAnimationFrame(starAnim);
      };
      starAnim();
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
