"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PaymentPlanCalculator from "@/components/PaymentPlanCalculator";
import HotelDetailCard from "@/components/HotelDetailCard";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import PriceBreakdown from "@/components/PriceBreakdown";
import ExperienceMarketplace from "@/components/ExperienceMarketplace";

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
  category: string;
  isPremium: boolean;
  tier: { name: string; slug: string } | null;
}

interface PackageDetailData {
  template: PackageTemplate;
  itinerary: Array<{
    day: number;
    items: Array<{
      type: string;
      name: string;
      description: string | null;
      imageUrl: string | null;
      durationDays: number | null;
      isOptional: boolean;
      price: number;
      starRating?: number | null;
      reviewScore?: number | null;
      amenities?: string[];
    }>;
  }>;
  priceBreakdown: {
    accommodation: number;
    experiences: number;
    transfersAndMeals: number;
    total: number;
    nightlyRate: number;
  };
  hotel: {
    name: string;
    description: string | null;
    imageUrl: string | null;
    galleryUrls: string[];
    starRating: number | null;
    reviewScore: number | null;
    reviewCount: number | null;
    amenities: string[];
    romanceScore: number | null;
    romanceTags: string[];
    basePrice: number;
  } | null;
  experiences: Array<{
    name: string;
    description: string | null;
    imageUrl: string | null;
    price: number;
    dayOffset: number | null;
    isOptional: boolean;
  }>;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function PackageDetailClient({
  template,
}: {
  template: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    destination: string;
    image: string;
    gallery: string[];
    basePrice: number;
    duration: number;
  };
}) {
  const [data, setData] = useState<PackageDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/packages/detail?slug=${template.id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [template.id]);

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-0 pb-24">
        {/* Hero — full-bleed cinematic */}
        <div className="relative h-[70vh] min-h-[500px]">
          <Image
            src={template.image}
            alt={template.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-24 left-8 lg:left-12 z-10 flex items-center gap-3">
            <span className="px-3 py-1.5 bg-ember text-obsidian text-[10px] font-medium tracking-[0.2em] uppercase">
              Route
            </span>
            {data?.template.tier && (
              <span className="px-3 py-1.5 border border-amber/20 text-amber text-[10px] font-medium tracking-[0.2em] uppercase">
                {data.template.tier.name} Class
              </span>
            )}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-[1400px] mx-auto">
              <h1
                className="font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-warm-white tracking-tight"
                style={{ lineHeight: 0.95 }}
              >
                {template.title}
              </h1>
              <p className="mt-3 text-lg text-warm-white/50">
                {template.subtitle}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-warm-white/30">
                  {template.destination}
                </span>
                <span className="w-px h-3 bg-warm-white/10" />
                <span className="text-sm text-warm-white/30">
                  {template.duration} days
                </span>
                <span className="w-px h-3 bg-warm-white/10" />
                <span className="text-sm text-warm-white/30">
                  For 2 travelers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
              {/* Description */}
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/45">
                  About This Route
                </span>
                <p className="mt-4 text-warm-white/40 leading-relaxed text-lg">
                  {template.description}
                </p>
              </div>

              {/* Gallery — no rounded corners */}
              {template.gallery.length > 0 && (
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/45">
                    Gallery
                  </span>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {template.gallery.map((img, i) => (
                      <div
                        key={i}
                        className={`relative overflow-hidden ${
                          i === 0 ? "col-span-2 aspect-[2/1]" : "aspect-square"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${template.title} ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotel */}
              {!loading && data?.hotel && (
                <HotelDetailCard
                  hotel={data.hotel}
                  duration={template.duration}
                />
              )}

              {/* Itinerary */}
              {!loading && data?.itinerary && data.itinerary.length > 0 && (
                <ItineraryTimeline
                  days={data.itinerary}
                  totalDays={template.duration}
                />
              )}

              {/* Experience Marketplace */}
              {!loading && data?.experiences && data.experiences.length > 0 && (
                <ExperienceMarketplace
                  experiences={data.experiences}
                  duration={template.duration}
                />
              )}

              {/* Price Breakdown */}
              {!loading && data?.priceBreakdown && (
                <PriceBreakdown {...data.priceBreakdown} />
              )}
            </div>

            {/* Sidebar — editorial, not card */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8">
                <div className="border border-warm-white/5 p-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-warm-white/45">
                    Fare from
                  </p>
                  <p className="mt-2 font-serif text-4xl font-light text-warm-white">
                    {formatPrice(data?.priceBreakdown?.total || template.basePrice)}
                  </p>
                  <p className="mt-1 text-xs text-warm-white/45 tracking-luxury">
                    cabin for 2 · {template.duration} days
                  </p>

                  <div className="mt-8">
                    <PaymentPlanCalculator
                      packageTemplateId={template.id}
                      totalPrice={
                        (data?.priceBreakdown?.total || template.basePrice) / 100
                      }
                    />
                  </div>
                </div>

                <div className="border border-warm-white/5 p-6">
                  <p className="text-xs text-warm-white/40 leading-relaxed">
                    Fares are live estimates. Final fare confirmed at booking.
                    All reservations include flexible rebooking and secure fund
                    protection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
