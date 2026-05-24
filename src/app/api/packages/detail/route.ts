import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const template = await db.packageTemplate.findUnique({
      where: { slug, isActive: true },
      include: {
        tier: true,
        components: {
          include: {
            product: true,
          },
          orderBy: { dayOffset: "asc" },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    // Build itinerary day by day
    const days: Array<{
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
    }> = [];

    // Accommodation spans all days
    const hotelComponent = template.components.find(
      (c) => c.componentType === "ACCOMMODATION"
    );

    for (let d = 0; d < template.duration; d++) {
      const dayItems: typeof days[0]["items"] = [];

      // Hotel is present every day
      if (hotelComponent?.product) {
        const amenities = hotelComponent.product.amenities
          ? JSON.parse(hotelComponent.product.amenities)
          : [];
        dayItems.push({
          type: "ACCOMMODATION",
          name: hotelComponent.product.name,
          description: hotelComponent.product.description,
          imageUrl: hotelComponent.product.imageUrl,
          durationDays: hotelComponent.durationDays,
          isOptional: hotelComponent.isOptional,
          price: hotelComponent.product.basePrice,
          starRating: hotelComponent.product.starRating,
          reviewScore: hotelComponent.product.reviewScore,
          amenities,
        });
      }

      // Experiences scheduled for this day
      const dayExperiences = template.components.filter(
        (c) => c.componentType === "EXPERIENCE" && c.dayOffset === d
      );
      for (const exp of dayExperiences) {
        if (exp.product) {
          dayItems.push({
            type: "EXPERIENCE",
            name: exp.product.name,
            description: exp.product.description,
            imageUrl: exp.product.imageUrl,
            durationDays: exp.durationDays,
            isOptional: exp.isOptional,
            price: exp.product.basePrice,
          });
        }
      }

      days.push({ day: d + 1, items: dayItems });
    }

    // Price breakdown
    const hotelPrice =
      (hotelComponent?.product?.basePrice || 0) * template.duration;
    const experiencePrices = template.components
      .filter((c) => c.componentType === "EXPERIENCE")
      .reduce((sum, c) => sum + (c.product?.basePrice || 0), 0);
    const basePackagePrice = template.basePrice;

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        slug: template.slug,
        title: template.title,
        subtitle: template.subtitle,
        description: template.description,
        destination: template.destination,
        image: template.image,
        gallery: template.gallery ? JSON.parse(template.gallery) : [],
        basePrice: template.basePrice,
        duration: template.duration,
        category: template.category,
        isPremium: template.isPremium,
        tier: template.tier
          ? { name: template.tier.name, slug: template.tier.slug }
          : null,
      },
      itinerary: days,
      priceBreakdown: {
        accommodation: hotelPrice,
        experiences: experiencePrices,
        transfersAndMeals: Math.max(0, basePackagePrice - hotelPrice - experiencePrices),
        total: basePackagePrice,
        nightlyRate: hotelComponent?.product?.basePrice || 0,
      },
      hotel: hotelComponent?.product
        ? {
            name: hotelComponent.product.name,
            description: hotelComponent.product.description,
            imageUrl: hotelComponent.product.imageUrl,
            galleryUrls: hotelComponent.product.galleryUrls
              ? JSON.parse(hotelComponent.product.galleryUrls)
              : [],
            starRating: hotelComponent.product.starRating,
            reviewScore: hotelComponent.product.reviewScore,
            reviewCount: hotelComponent.product.reviewCount,
            amenities: hotelComponent.product.amenities
              ? JSON.parse(hotelComponent.product.amenities)
              : [],
            romanceScore: hotelComponent.product.romanceScore,
            romanceTags: hotelComponent.product.romanceTags
              ? JSON.parse(hotelComponent.product.romanceTags)
              : [],
            basePrice: hotelComponent.product.basePrice,
          }
        : null,
      experiences: template.components
        .filter((c) => c.componentType === "EXPERIENCE")
        .map((c) =>
          c.product
            ? {
                name: c.product.name,
                description: c.product.description,
                imageUrl: c.product.imageUrl,
                price: c.product.basePrice,
                dayOffset: c.dayOffset,
                isOptional: c.isOptional,
              }
            : null
        )
        .filter(Boolean),
    });
  } catch (err) {
    console.error("[package/detail] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}
