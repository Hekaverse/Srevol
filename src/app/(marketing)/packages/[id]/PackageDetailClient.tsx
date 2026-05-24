"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PaymentPlanCalculator from "@/components/PaymentPlanCalculator";
import HotelDetailCard from "@/components/HotelDetailCard";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import PriceBreakdown from "@/components/PriceBreakdown";
import ExperienceMarketplace from "@/components/ExperienceMarketplace";
import ScrollReveal from "@/components/ScrollReveal";

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
      <main className="pt-16 pb-24">
        {/* Hero */}
        <div className="relative h-[55vh] min-h-[450px]">
          <Image
            src={template.image}
            alt={template.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-ember text-obsidian text-[10px] font-medium tracking-[0.2em] uppercase rounded-full">
                  Route
                </span>
                {data?.template.tier && (
                  <span className="px-3 py-1.5 border border-amber/20 text-amber text-[10px] font-medium tracking-[0.2em] uppercase rounded-full">
                    {data.template.tier.name} Class
                  </span>
                )}
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-white">
                {template.title}
              </h1>
              <p className="mt-2 text-lg text-warm-white/60">
                {template.subtitle}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-warm-white/40">
                  {template.destination}
                </span>
                <span className="w-1 h-1 rounded-full bg-warm-white/20" />
                <span className="text-sm text-warm-white/40">
                  {template.duration} days
                </span>
                <span className="w-1 h-1 rounded-full bg-warm-white/20" />
                <span className="text-sm text-warm-white/40">
                  For 2 travelers
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <ScrollReveal animation="fade-up">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-warm-white mb-4">
                    About This Route
                  </h2>
                  <p className="text-warm-white/50 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Gallery */}
              {template.gallery.length > 0 && (
                <ScrollReveal animation="fade-up" delay={0.1}>
                  <div className="grid grid-cols-2 gap-3">
                    {template.gallery.map((img, i) => (
                      <div
                        key={i}
                        className={`relative rounded-2xl overflow-hidden ${
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
                </ScrollReveal>
              )}

              {/* Hotel */}
              {!loading && data?.hotel && (
                <ScrollReveal animation="fade-up" delay={0.15}>
                  <HotelDetailCard
                    hotel={data.hotel}
                    duration={template.duration}
                  />
                </ScrollReveal>
              )}

              {/* Itinerary */}
              {!loading && data?.itinerary && data.itinerary.length > 0 && (
                <ScrollReveal animation="fade-up" delay={0.2}>
                  <ItineraryTimeline
                    days={data.itinerary}
                    totalDays={template.duration}
                  />
                </ScrollReveal>
              )}

              {/* Experience Marketplace */}
              {!loading && data?.experiences && data.experiences.length > 0 && (
                <ScrollReveal animation="fade-up" delay={0.25}>
                  <ExperienceMarketplace
                    experiences={data.experiences}
                    duration={template.duration}
                  />
                </ScrollReveal>
              )}

              {/* Price Breakdown */}
              {!loading && data?.priceBreakdown && (
                <ScrollReveal animation="fade-up" delay={0.3}>
                  <PriceBreakdown {...data.priceBreakdown} />
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-obsidian-light/50 rounded-2xl border border-obsidian-muted/30 p-6 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-sm text-warm-white/30">Fare from</p>
                  <p className="font-serif text-3xl font-bold text-warm-white">
                    {formatPrice(data?.priceBreakdown?.total || template.basePrice)}
                  </p>
                  <p className="text-sm text-warm-white/30">
                    cabin for 2 · {template.duration} days
                  </p>
                </div>
                <PaymentPlanCalculator
                  packageTemplateId={template.id}
                  totalPrice={
                    (data?.priceBreakdown?.total || template.basePrice) / 100
                  }
                />
                <div className="mt-6 pt-6 border-t border-obsidian-muted/30">
                  <p className="text-xs text-warm-white/20 text-center">
                    Fares are live estimates. Final fare confirmed at booking.
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
