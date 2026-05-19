"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentPlanCalculator from "@/components/PaymentPlanCalculator";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AssembledPackage {
  hotel: { name: string; price: number; starRating: number | null; imageUrl: string | null };
  flights: { name: string; price: number }[];
  activities: { name: string; price: number; dayOffset: number }[];
  totalPrice: number;
  nightlyRate: number;
}

interface PackageTemplate {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  destination: string;
  image: string;
  gallery: string[];
  basePrice: number;
  duration: number;
  includes: string[];
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export default function PackageDetailPage() {
  const params = useParams();
  const [template, setTemplate] = useState<PackageTemplate | null>(null);
  const [assembled, setAssembled] = useState<AssembledPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.id as string;
    
    // Fetch template details
    fetch(`/api/packages`)
      .then((r) => r.json())
      .then((data) => {
        const tmpl = data.templates?.find((t: any) => t.slug === slug);
        if (tmpl) {
          setTemplate(tmpl);
          // Build assembled package
          return fetch("/api/packages/build", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination: tmpl.destination, duration: tmpl.duration }),
          });
        }
        return null;
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data?.success) setAssembled(data.package);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-plum-900 flex items-center justify-center">
        <p className="text-warm-white/40">Assembling your escape...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-plum-900 flex items-center justify-center">
        <p className="text-warm-white/40">Package not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plum-900">
      <Navbar />
      <main className="pt-16 pb-24">
        <div className="relative h-[50vh] min-h-[400px]">
          <Image
            src={template.image}
            alt={template.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-900 via-plum-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <span className="inline-block px-3 py-1 bg-rose-gold text-plum-900 text-[10px] font-medium tracking-[0.2em] uppercase rounded-full mb-4">
                Honeymoon
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-warm-white">{template.title}</h1>
              <p className="mt-2 text-lg text-warm-white/60">{template.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="font-serif text-2xl font-bold text-warm-white mb-4">About This Escape</h2>
                <p className="text-warm-white/50 leading-relaxed">{template.description}</p>
              </div>

              {assembled && (
                <>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-warm-white mb-4">Your Hotel</h2>
                    <div className="p-5 bg-plum-800/30 rounded-xl border border-plum-700/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-warm-white">{assembled.hotel.name}</p>
                          <p className="text-sm text-warm-white/40">{assembled.hotel.starRating}★ • {formatPrice(assembled.nightlyRate)}/night</p>
                        </div>
                        <p className="text-lg font-bold text-warm-white">{formatPrice(assembled.hotel.price * template.duration)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-bold text-warm-white mb-4">Flights</h2>
                    <div className="space-y-2">
                      {assembled.flights.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-plum-800/30 rounded-xl border border-plum-700/30">
                          <p className="text-sm text-warm-white/70">{f.name}</p>
                          <p className="text-sm font-medium text-warm-white">{formatPrice(f.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-serif text-2xl font-bold text-warm-white mb-4">Included Experiences</h2>
                    <div className="space-y-2">
                      {assembled.activities.map((a, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-plum-800/30 rounded-xl border border-plum-700/30">
                          <div>
                            <p className="text-sm text-warm-white/70">{a.name}</p>
                            <p className="text-xs text-warm-white/30">Day {a.dayOffset + 1}</p>
                          </div>
                          <p className="text-sm font-medium text-warm-white">{formatPrice(a.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-sm text-warm-white/30">Starting from</p>
                  <p className="font-serif text-3xl font-bold text-warm-white">{formatPrice(assembled?.totalPrice || template.basePrice)}</p>
                  <p className="text-sm text-warm-white/30">for 2 people • {template.duration} days</p>
                </div>
                <PaymentPlanCalculator totalPrice={(assembled?.totalPrice || template.basePrice) / 100} />
                <div className="mt-6 pt-6 border-t border-plum-700/30">
                  <p className="text-xs text-warm-white/20 text-center">
                    Prices are live estimates. Final price confirmed at booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
