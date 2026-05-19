import { db } from "@/lib/db";

export async function seedBudgetTiers() {
  const tiers = [
    {
      slug: "bronze-escape",
      name: "Bronze Escape",
      description: "Intimate getaways to beautiful nearby destinations. Perfect for long weekends and first trips together.",
      minPrice: 200000,
      maxPrice: 400000,
      defaultMonths: 12,
      minMonths: 6,
      maxMonths: 24,
      destinations: JSON.stringify(["Bali", "Mexico", "Costa Rica", "Portugal", "Morocco"]),
      hotelStars: 3.5,
      inflationBuffer: 0.10, // 10% buffer for shorter plans
      repriceTriggerMonths: 6,
      accentColor: "#C9A87C",
    },
    {
      slug: "silver-romance",
      name: "Silver Romance",
      description: "Unforgettable experiences in iconic destinations. The sweet spot for honeymoons and anniversaries.",
      minPrice: 400000,
      maxPrice: 800000,
      defaultMonths: 24,
      minMonths: 12,
      maxMonths: 36,
      destinations: JSON.stringify(["Santorini", "Amalfi Coast", "Maldives", "Kyoto", "Swiss Alps"]),
      hotelStars: 4.5,
      inflationBuffer: 0.15, // 15% buffer
      repriceTriggerMonths: 12,
      accentColor: "#C97B7B",
    },
    {
      slug: "gold-dream",
      name: "Gold Dream",
      description: "Once-in-a-lifetime journeys to the world's most extraordinary places. For milestone celebrations.",
      minPrice: 800000,
      maxPrice: 1500000,
      defaultMonths: 36,
      minMonths: 18,
      maxMonths: 48,
      destinations: JSON.stringify(["Bora Bora", "Seychelles", "Patagonia", "Safari Kenya", "Northern Lights Norway"]),
      hotelStars: 5,
      inflationBuffer: 0.18, // 18% buffer for longer plans
      repriceTriggerMonths: 12,
      accentColor: "#D4A574",
    },
    {
      slug: "platinum-legend",
      name: "Platinum Legend",
      description: "The absolute pinnacle of travel. Private jets, overwater villas, and experiences money can't buy.",
      minPrice: 1500000,
      maxPrice: 5000000,
      defaultMonths: 48,
      minMonths: 24,
      maxMonths: 60,
      destinations: JSON.stringify(["Private Island Buyout", "Antarctica Expedition", "Around-the-World", "Safari + Seychelles Combo"]),
      hotelStars: 5,
      inflationBuffer: 0.20, // 20% buffer for longest plans
      repriceTriggerMonths: 18,
      accentColor: "#E8C9A0",
    },
  ];

  for (const tier of tiers) {
    await db.budgetTier.upsert({
      where: { slug: tier.slug },
      update: tier,
      create: tier,
    });
  }

  return tiers.length;
}

export async function seedPackageTemplates() {
  const templates = [
    {
      slug: "santorini-sunset",
      title: "Santorini Sunset",
      subtitle: "Aegean Romance",
      description: "Experience the magic of Santorini with your loved one. From private sunset dinners in Oia to wine tastings at volcanic vineyards.",
      destination: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=1200&h=600&fit=crop",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop",
      ]),
      basePrice: 499900,
      duration: 7,
      category: "HONEYMOON" as const,
      isActive: true,
      isPremium: false,
    },
    {
      slug: "maldives-paradise",
      title: "Maldives Paradise",
      subtitle: "Overwater Dreams",
      description: "Wake up above crystal-clear turquoise waters in your private overwater villa. The ultimate couples retreat.",
      destination: "Maldives",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=600&fit=crop",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop",
      ]),
      basePrice: 829900,
      duration: 10,
      category: "HONEYMOON" as const,
      isActive: true,
      isPremium: true,
    },
    {
      slug: "kyoto-blossoms",
      title: "Kyoto Blossoms",
      subtitle: "Cherry Blossom Season",
      description: "Riverboat arrival to a secluded ryokan in the Arashiyama bamboo groves. Experience Japan's most romantic season.",
      destination: "Kyoto, Japan",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=600&fit=crop",
      gallery: JSON.stringify([]),
      basePrice: 629900,
      duration: 12,
      category: "ANNIVERSARY" as const,
      isActive: true,
      isPremium: false,
    },
  ];

  for (const tmpl of templates) {
    await db.packageTemplate.upsert({
      where: { slug: tmpl.slug },
      update: tmpl,
      create: tmpl,
    });
  }

  return templates.length;
}
