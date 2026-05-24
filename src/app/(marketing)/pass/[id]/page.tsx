"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { toPng } from "html-to-image";
import QRCode from "qrcode";

interface PassData {
  id: string;
  destination: string;
  routeCode: string;
  gate: string;
  seat: string;
  tier: string;
  tierSlug: string;
  passenger1: string;
  passenger2?: string;
  departureDate: string;
  classCode: string;
  referralUrl: string;
}

function generateRouteCode(id: string) {
  const num =
    (id.slice(-3).split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 900) +
    100;
  return `SV-${num}`;
}

function generateGateAndSeat(id: string) {
  const gates = ["A1", "A3", "B2", "B7", "C4", "C9", "D1", "D5"];
  const seats = ["1A", "1F", "2A", "2F", "3K", "4A", "5F", "6K"];
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return { gate: gates[hash % gates.length], seat: seats[hash % seats.length] };
}

export default function ShareablePassPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const [pass, setPass] = useState<PassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/pass/${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) {
          setLoading(false);
          return;
        }

        const b = data.booking;
        const { gate, seat } = generateGateAndSeat(b.id);
        const baseUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        const referralUrl = b.couple?.referralCode
          ? `${baseUrl}/?ref=${b.couple.referralCode}`
          : baseUrl;

        const tierMap: Record<string, string> = {
          horizon: "H",
          meridian: "M",
          celestial: "C",
          astral: "A",
        };

        setPass({
          id: b.id,
          destination: b.destination || "Your Destination",
          routeCode: generateRouteCode(b.id),
          gate,
          seat,
          tier: b.tier?.name || "Horizon",
          tierSlug: b.tier?.slug || "horizon",
          passenger1: b.couple?.partner1Name || "Passenger 1",
          passenger2: b.couple?.partner2Name || undefined,
          departureDate: b.countdown?.targetDate || new Date().toISOString(),
          classCode: tierMap[b.tier?.slug || "horizon"] || "H",
          referralUrl,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (pass?.referralUrl) {
      QRCode.toDataURL(pass.referralUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#C76B4A", light: "#0C0C0C" },
      }).then(setQrDataUrl);
    }
  }, [pass?.referralUrl]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0C0C0C",
      });
      const link = document.createElement("a");
      link.download = `srevol-boarding-pass-${pass?.routeCode}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setDownloading(false);
    }
  }, [pass?.routeCode]);

  const handleShare = useCallback(async () => {
    if (!pass) return;
    const text = `We've secured our ${pass.tier} Class departure to ${pass.destination} on SREVOL. Route ${pass.routeCode}.`;
    const url = pass.referralUrl;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Our SREVOL Boarding Pass",
          text,
          url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 3000);
        return;
      } catch {
        // fall through
      }
    }

    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch {
      alert("Copy this link to share: " + url);
    }
  }, [pass]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
      </div>
    );
  }

  if (!pass) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-warm-white/30 font-serif text-xl">
            Boarding Pass Not Found
          </p>
          <p className="text-warm-white/15 text-sm mt-2">
            This reservation may not exist or may not be confirmed yet.
          </p>
        </div>
      </div>
    );
  }

  const depDate = new Date(pass.departureDate);
  const dateStr = depDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = depDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center py-12 px-4">
      {/* Share Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[520px] aspect-square bg-obsidian border border-amber/10 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0C0C0C 0%, #111111 50%, #0C0C0C 100%)",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,160,86,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,86,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l border-t border-amber/10" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-amber/10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-amber/10" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r border-b border-amber/10" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-ember/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-ember" />
              </div>
              <span className="text-[10px] font-mono tracking-[0.35em] text-ember/70 uppercase">
                Srevol
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-warm-white/15 uppercase">
              Premium Carrier
            </span>
          </div>

          {/* Route Code — Hero */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono tracking-[0.4em] text-amber/40 uppercase mb-3">
              Route
            </span>
            <h1 className="font-mono text-5xl sm:text-6xl font-bold text-amber tracking-wider">
              {pass.routeCode}
            </h1>
            <p className="text-lg text-warm-white/40 mt-3 font-serif italic">
              {pass.destination}
            </p>
          </div>

          {/* Passenger Manifest */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-[0.25em] text-warm-white/20 uppercase">
                Passenger
              </span>
              <span className="text-[10px] font-mono text-warm-white/50">
                {pass.passenger1}
              </span>
            </div>
            {pass.passenger2 && (
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-[0.25em] text-warm-white/20 uppercase">
                  Passenger
                </span>
                <span className="text-[10px] font-mono text-warm-white/50">
                  {pass.passenger2}
                </span>
              </div>
            )}
          </div>

          {/* Flight Details Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-[8px] font-mono tracking-[0.2em] text-warm-white/15 uppercase">
                Date
              </p>
              <p className="text-[11px] font-mono text-amber/60 mt-1">
                {dateStr}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-mono tracking-[0.2em] text-warm-white/15 uppercase">
                Time
              </p>
              <p className="text-[11px] font-mono text-amber/60 mt-1">
                {timeStr}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-mono tracking-[0.2em] text-warm-white/15 uppercase">
                Gate
              </p>
              <p className="text-[11px] font-mono text-amber/60 mt-1">
                {pass.gate}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-mono tracking-[0.2em] text-warm-white/15 uppercase">
                Seat
              </p>
              <p className="text-[11px] font-mono text-amber/60 mt-1">
                {pass.seat}
              </p>
            </div>
          </div>

          {/* Bottom Row: Tier + QR */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[8px] font-mono tracking-[0.2em] text-warm-white/15 uppercase">
                Cabin
              </p>
              <p className="text-sm font-serif text-warm-white/60 mt-0.5">
                {pass.tier} Class
              </p>
              <p className="text-[9px] font-mono text-warm-white/10 mt-0.5 tracking-wider">
                {pass.classCode}-{pass.id.slice(-6).toUpperCase()}
              </p>
            </div>
            {qrDataUrl && (
              <div className="flex flex-col items-center">
                <img src={qrDataUrl} alt="QR" className="w-16 h-16 opacity-70" />
                <span className="text-[7px] font-mono tracking-[0.15em] text-warm-white/10 uppercase mt-1">
                  Scan to Fly
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all duration-300 disabled:opacity-50"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
              Rendering...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PNG
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-ember bg-ember/8 rounded-full hover:bg-ember/15 transition-all duration-300 border border-ember/10"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {shared ? "Copied!" : "Share"}
        </button>
      </div>

      <p className="mt-4 text-[11px] text-warm-white/15 text-center max-w-sm">
        Share your boarding pass. When someone books through your link, you both
        earn future travel credit.
      </p>
    </div>
  );
}
