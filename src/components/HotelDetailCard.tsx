"use client";

import { useState } from "react";

interface HotelDetail {
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
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function HotelDetailCard({
  hotel,
  duration,
}: {
  hotel: HotelDetail;
  duration: number;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const images = [
    hotel.imageUrl,
    ...hotel.galleryUrls,
  ].filter(Boolean) as string[];

  return (
    <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 overflow-hidden">
      {/* Image Gallery */}
      <div className="relative h-72 sm:h-80">
        {images.length > 0 && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${images[activeImage]})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          {hotel.starRating && (
            <span className="px-3 py-1.5 bg-amber/10 border border-amber/20 rounded-full text-[10px] font-mono tracking-wider text-amber uppercase">
              {hotel.starRating}★ Property
            </span>
          )}
          {hotel.reviewScore && (
            <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-mono tracking-wider text-green-400 uppercase">
              {hotel.reviewScore}/10
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                aria-label={`View hotel image ${i + 1} of ${images.length}`}
                aria-pressed={i === activeImage}
                className={`w-12 h-12 rounded-lg bg-cover bg-center border-2 transition-all ${
                  i === activeImage
                    ? "border-amber scale-105"
                    : "border-white/10 opacity-60 hover:opacity-100"
                }`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-warm-white">
              {hotel.name}
            </h3>
            {hotel.reviewCount && (
              <p className="text-xs text-warm-white/25 mt-1">
                {hotel.reviewCount} verified reviews
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-amber">
              {formatPrice(hotel.basePrice)}
            </p>
            <p className="text-[10px] text-warm-white/20 tracking-wider uppercase">
              per night
            </p>
          </div>
        </div>

        <p className="text-sm text-warm-white/40 leading-relaxed mt-4">
          {hotel.description}
        </p>

        {/* Romance Score */}
        {hotel.romanceScore && (
          <div className="mt-5 flex items-center gap-3 p-4 bg-ember/5 rounded-xl border border-ember/10">
            <div className="w-10 h-10 rounded-full bg-ember/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-ember" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-warm-white/70">
                Romance Score {hotel.romanceScore}/10
              </p>
              {hotel.romanceTags.length > 0 && (
                <p className="text-[10px] text-ember/60 tracking-wider mt-0.5">
                  {hotel.romanceTags.join(" · ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Amenities */}
        {hotel.amenities.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-mono tracking-[0.2em] text-warm-white/15 uppercase mb-3">
              Amenities
            </p>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 text-[11px] text-warm-white/40 bg-warm-white/5 rounded-full border border-warm-white/5"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 pt-5 border-t border-obsidian-muted/15">
          <p className="text-xs text-warm-white/20">
            Total accommodation: {formatPrice(hotel.basePrice * duration)} for{" "}
            {duration} nights
          </p>
        </div>
      </div>
    </div>
  );
}
