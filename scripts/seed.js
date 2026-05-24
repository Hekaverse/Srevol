#!/usr/bin/env node
/**
 * SREVOL Database Seed Script
 * Run: node scripts/seed.js
 * Requires DATABASE_URL env var to be set (or in .env)
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
    inflationBuffer: 0.10,
    repriceTriggerMonths: 6,
    accentColor: "#D4A056",
    isActive: true,
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
    inflationBuffer: 0.15,
    repriceTriggerMonths: 12,
    accentColor: "#8A827A",
    isActive: true,
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
    inflationBuffer: 0.18,
    repriceTriggerMonths: 12,
    accentColor: "#E8C07A",
    isActive: true,
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
    inflationBuffer: 0.20,
    repriceTriggerMonths: 18,
    accentColor: "#C76B4A",
    isActive: true,
  },
];

const templates = [
  {
    slug: "santorini-sunset",
    title: "Santorini Sunset",
    subtitle: "Aegean Romance",
    description: "Experience the magic of Santorini with your loved one. From private sunset dinners in Oia to wine tastings at volcanic vineyards, every moment is designed for two. Includes cliffside accommodation with caldera views.",
    destination: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=1200&h=600&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop",
    ]),
    basePrice: 499900,
    duration: 7,
    category: "HONEYMOON",
    isActive: true,
    isPremium: false,
    tierId: null,
  },
  {
    slug: "maldives-paradise",
    title: "Maldives Paradise",
    subtitle: "Overwater Dreams",
    description: "Wake up above crystal-clear turquoise waters in your private overwater villa. The ultimate couples retreat with world-class diving, spa treatments, and dining under the stars.",
    destination: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&h=600&fit=crop",
    gallery: JSON.stringify([
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop",
    ]),
    basePrice: 829900,
    duration: 10,
    category: "HONEYMOON",
    isActive: true,
    isPremium: true,
    tierId: null,
  },
  {
    slug: "kyoto-blossoms",
    title: "Kyoto Blossoms",
    subtitle: "Cherry Blossom Season",
    description: "Riverboat arrival to a secluded ryokan in the Arashiyama bamboo groves. Experience Japan's most romantic season with tea ceremonies, temple visits, and kaiseki dinners.",
    destination: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=600&fit=crop",
    gallery: JSON.stringify([]),
    basePrice: 629900,
    duration: 12,
    category: "ANNIVERSARY",
    isActive: true,
    isPremium: false,
    tierId: null,
  },
  {
    slug: "amalfi-coast",
    title: "Amalfi Coast",
    subtitle: "Coastal Elegance",
    description: "Drive the winding coastal road from Positano to Ravello. Stay in a cliffton villa with infinity pool, enjoy limoncello tastings and private boat tours to Capri.",
    destination: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=600&fit=crop",
    gallery: JSON.stringify([]),
    basePrice: 549900,
    duration: 8,
    category: "GETAWAY",
    isActive: true,
    isPremium: false,
    tierId: null,
  },
  {
    slug: "bora-bora",
    title: "Bora Bora",
    subtitle: "Pearl of the Pacific",
    description: "Mount Otemanu rises from turquoise lagoon waters as you snorkel with rays from your private overwater bungalow. The South Pacific's most iconic couples destination.",
    destination: "Bora Bora, French Polynesia",
    image: "https://images.unsplash.com/photo-1589979481223-deb89304a225?w=1200&h=600&fit=crop",
    gallery: JSON.stringify([]),
    basePrice: 1299900,
    duration: 9,
    category: "HONEYMOON",
    isActive: true,
    isPremium: true,
    tierId: null,
  },
  {
    slug: "swiss-alps",
    title: "Swiss Alps",
    subtitle: "Mountain Retreat",
    description: "A chalet in Zermatt with Matterhorn views. Ski together in winter, hike alpine meadows in summer. Fondue by the fire and panoramic train rides through the peaks.",
    destination: "Zermatt, Switzerland",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=600&fit=crop",
    gallery: JSON.stringify([]),
    basePrice: 459900,
    duration: 6,
    category: "ADVENTURE",
    isActive: true,
    isPremium: false,
    tierId: null,
  },
];

async function seed() {
  console.log("\n🌹 SREVOL Database Seed\n");

  try {
    // Seed Tiers
    console.log("Seeding budget tiers...");
    for (const tier of tiers) {
      await prisma.budgetTier.upsert({
        where: { slug: tier.slug },
        update: tier,
        create: tier,
      });
      console.log(`  ✓ ${tier.name}`);
    }

    // Link templates to tiers based on price
    const allTiers = await prisma.budgetTier.findMany();
    const tierMap = new Map(allTiers.map((t) => [t.slug, t.id]));

    templates.forEach((t) => {
      if (t.basePrice <= 400000) t.tierId = tierMap.get("bronze-escape") || null;
      else if (t.basePrice <= 800000) t.tierId = tierMap.get("silver-romance") || null;
      else if (t.basePrice <= 1500000) t.tierId = tierMap.get("gold-dream") || null;
      else t.tierId = tierMap.get("platinum-legend") || null;
    });

    // Seed Package Templates
    console.log("\nSeeding package templates...");
    for (const tmpl of templates) {
      await prisma.packageTemplate.upsert({
        where: { slug: tmpl.slug },
        update: tmpl,
        create: tmpl,
      });
      console.log(`  ✓ ${tmpl.title}`);
    }

    // Count results
    const tierCount = await prisma.budgetTier.count();
    const templateCount = await prisma.packageTemplate.count();

    console.log("\n✅ Seed complete!");
    console.log(`   Budget Tiers: ${tierCount}`);
    console.log(`   Packages: ${templateCount}\n`);
  } catch (error) {
    console.error("\n❌ Seed failed:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
