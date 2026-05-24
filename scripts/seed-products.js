const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const destinations = [
  {
    name: "Santorini, Greece",
    country: "Greece",
    slug: "santorini-sunset",
    hotels: [
      { name: "Canaves Oia Epitome", stars: 5, price: 85000, image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop", romance: 98 },
      { name: "Grace Hotel Santorini", stars: 5, price: 72000, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop", romance: 96 },
      { name: "Katikies Santorini", stars: 4, price: 58000, image: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop", romance: 92 },
      { name: "Astra Suites", stars: 4, price: 45000, image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop", romance: 88 },
    ],
    flights: [
      { name: "Economy — Direct from London", price: 42000 },
      { name: "Premium Economy — Direct from London", price: 68000 },
      { name: "Business Class — Direct from London", price: 145000 },
    ],
    activities: [
      { name: "Private Sunset Catamaran Cruise", price: 28000, romance: 95 },
      { name: "Wine Tasting at Volcanic Vineyards", price: 12000, romance: 85 },
      { name: "Couples Spa Treatment — Open Air", price: 18000, romance: 90 },
      { name: "Private Photography Session in Oia", price: 8000, romance: 82 },
      { name: "Greek Cooking Class for Two", price: 10000, romance: 78 },
      { name: "Helicopter Tour of the Caldera", price: 35000, romance: 88 },
      { name: "Private Beach Dinner at Amoudi Bay", price: 22000, romance: 94 },
      { name: "Ancient Akrotiri Private Tour", price: 6000, romance: 65 },
    ],
  },
  {
    name: "Maldives",
    country: "Maldives",
    slug: "maldives-paradise",
    hotels: [
      { name: "Soneva Jani", stars: 5, price: 120000, image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop", romance: 99 },
      { name: "Gili Lankanfushi", stars: 5, price: 95000, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop", romance: 97 },
      { name: "Conrad Maldives Rangali Island", stars: 5, price: 78000, image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&h=600&fit=crop", romance: 94 },
      { name: "Adaaran Prestige Vadoo", stars: 4, price: 52000, image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&h=600&fit=crop", romance: 89 },
    ],
    flights: [
      { name: "Economy — via Doha", price: 65000 },
      { name: "Business Class — via Doha", price: 185000 },
      { name: "First Class — via Doha", price: 320000 },
    ],
    activities: [
      { name: "Private Sandbank Dinner", price: 35000, romance: 98 },
      { name: "Night Snorkeling with Manta Rays", price: 15000, romance: 86 },
      { name: "Couples Underwater Spa Treatment", price: 25000, romance: 92 },
      { name: "Sunset Dolphin Cruise", price: 12000, romance: 88 },
      { name: "Private Island Picnic", price: 20000, romance: 90 },
      { name: "Seaplane Photography Tour", price: 28000, romance: 84 },
      { name: "Scuba Diving for Two — PADI Certified", price: 18000, romance: 80 },
      { name: "Bioluminescence Night Kayak", price: 10000, romance: 91 },
    ],
  },
  {
    name: "Kyoto, Japan",
    country: "Japan",
    slug: "kyoto-blossoms",
    hotels: [
      { name: "Hoshinoya Kyoto", stars: 5, price: 68000, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop", romance: 97 },
      { name: "The Ritz-Carlton Kyoto", stars: 5, price: 55000, image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop", romance: 93 },
      { name: "Suiran, a Luxury Collection Hotel", stars: 5, price: 48000, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop", romance: 91 },
      { name: "Gion Hatanaka Ryokan", stars: 4, price: 32000, image: "https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&h=600&fit=crop", romance: 89 },
    ],
    flights: [
      { name: "Economy — Direct from London", price: 58000 },
      { name: "Premium Economy — Direct from London", price: 88000 },
      { name: "Business Class — Direct from London", price: 195000 },
    ],
    activities: [
      { name: "Private Tea Ceremony in Machiya", price: 15000, romance: 92 },
      { name: "Kimono Fitting & Photoshoot", price: 12000, romance: 88 },
      { name: "Kaiseki Dinner with Geisha Performance", price: 28000, romance: 95 },
      { name: "Bamboo Grove Sunrise Walk", price: 5000, romance: 85 },
      { name: "Private Zen Meditation Session", price: 10000, romance: 82 },
      { name: "Cooking Class — Traditional Kaiseki", price: 14000, romance: 80 },
      { name: "Arashiyama Riverboat Cruise", price: 8000, romance: 87 },
      { name: "Fushimi Inari Private Guided Hike", price: 6000, romance: 78 },
    ],
  },
  {
    name: "Amalfi Coast, Italy",
    country: "Italy",
    slug: "amalfi-coast",
    hotels: [
      { name: "Le Sirenuse Positano", stars: 5, price: 92000, image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop", romance: 98 },
      { name: "Monastero Santa Rosa", stars: 5, price: 75000, image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop", romance: 96 },
      { name: "Palazzo Avino", stars: 5, price: 62000, image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=600&fit=crop", romance: 93 },
      { name: "Hotel Santa Caterina", stars: 4, price: 48000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop", romance: 90 },
    ],
    flights: [
      { name: "Economy — Direct from London", price: 35000 },
      { name: "Premium Economy — Direct from London", price: 58000 },
      { name: "Business Class — Direct from London", price: 125000 },
    ],
    activities: [
      { name: "Private Boat to Capri with Blue Grotto", price: 25000, romance: 95 },
      { name: "Lemon Grove Tour & Limoncello Tasting", price: 10000, romance: 82 },
      { name: "Cliffside Cooking Class in Ravello", price: 14000, romance: 86 },
      { name: "Sunset Aperitivo on the Terrace", price: 8000, romance: 91 },
      { name: "Path of the Gods Guided Hike", price: 6000, romance: 80 },
      { name: "Private Yacht Charter — Full Day", price: 45000, romance: 94 },
      { name: "Mozzarella Making Workshop", price: 9000, romance: 78 },
      { name: "Positano Beach Club Day Pass", price: 7000, romance: 84 },
    ],
  },
  {
    name: "Bora Bora, French Polynesia",
    country: "French Polynesia",
    slug: "bora-bora",
    hotels: [
      { name: "The St. Regis Bora Bora", stars: 5, price: 145000, image: "https://images.unsplash.com/photo-1589979481223-deb89304a225?w=800&h=600&fit=crop", romance: 99 },
      { name: "Four Seasons Resort Bora Bora", stars: 5, price: 128000, image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&h=600&fit=crop", romance: 98 },
      { name: "InterContinental Thalasso", stars: 5, price: 98000, image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&h=600&fit=crop", romance: 95 },
      { name: "Le Meridien Bora Bora", stars: 4, price: 72000, image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop", romance: 91 },
    ],
    flights: [
      { name: "Economy — via Los Angeles", price: 85000 },
      { name: "Premium Economy — via Los Angeles", price: 125000 },
      { name: "Business Class — via Los Angeles", price: 280000 },
    ],
    activities: [
      { name: "Shark & Ray Snorkeling Safari", price: 18000, romance: 88 },
      { name: "Private Motu Picnic on Islet", price: 32000, romance: 96 },
      { name: "Couples Tahitian Spa Ritual", price: 22000, romance: 93 },
      { name: "Sunset Cruise with Champagne", price: 15000, romance: 92 },
      { name: "Scuba Diving — Coral Gardens", price: 16000, romance: 85 },
      { name: "Parasailing Over Mount Otemanu", price: 12000, romance: 87 },
      { name: "Jet Ski Tour of the Lagoon", price: 14000, romance: 82 },
      { name: "Stargazing Dinner on the Beach", price: 25000, romance: 97 },
    ],
  },
  {
    name: "Zermatt, Switzerland",
    country: "Switzerland",
    slug: "swiss-alps",
    hotels: [
      { name: "Omnia Mountain Lodge", stars: 5, price: 58000, image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop", romance: 95 },
      { name: "Cervo Mountain Boutique Resort", stars: 5, price: 52000, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", romance: 93 },
      { name: "Mont Cervin Palace", stars: 5, price: 45000, image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop", romance: 91 },
      { name: "Hotel Firefly", stars: 4, price: 35000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop", romance: 87 },
    ],
    flights: [
      { name: "Economy — via Geneva", price: 28000 },
      { name: "Premium Economy — via Geneva", price: 48000 },
      { name: "Business Class — via Geneva", price: 95000 },
    ],
    activities: [
      { name: "Private Ski Lesson for Two", price: 18000, romance: 86 },
      { name: "Glacier Helicopter Tour", price: 28000, romance: 90 },
      { name: "Gornergrat Railway Sunset Trip", price: 10000, romance: 92 },
      { name: "Fondue Dinner in Igloo Village", price: 15000, romance: 94 },
      { name: "Spa Day at 3,100m — Matterhorn Views", price: 20000, romance: 89 },
      { name: "Guided Snowshoe Hike at Twilight", price: 8000, romance: 84 },
      { name: "Wine Tasting in Mountain Refuge", price: 12000, romance: 88 },
      { name: "Paragliding Tandem Flight", price: 16000, romance: 85 },
    ],
  },
];

async function seed() {
  console.log("\n🏨 Seeding Travel Products\n");

  for (const dest of destinations) {
    console.log(`\n📍 ${dest.name}`);

    for (const h of dest.hotels) {
      await prisma.travelProduct.upsert({
        where: {
          externalId_source_productType: {
            externalId: `${dest.slug}-${h.name.toLowerCase().replace(/\s+/g, "-")}`,
            source: "SREVOL_SEED",
            productType: "HOTEL",
          },
        },
        update: {
          name: h.name,
          description: `Luxury ${h.stars}-star accommodation in ${dest.name}`,
          destination: dest.name,
          country: dest.country,
          imageUrl: h.image,
          starRating: h.stars,
          basePrice: h.price,
          romanceScore: h.romance,
          reviewScore: 4.5 + Math.random() * 0.5,
          reviewCount: 100 + Math.floor(Math.random() * 900),
          isActive: true,
        },
        create: {
          externalId: `${dest.slug}-${h.name.toLowerCase().replace(/\s+/g, "-")}`,
          source: "SREVOL_SEED",
          productType: "HOTEL",
          name: h.name,
          description: `Luxury ${h.stars}-star accommodation in ${dest.name}`,
          destination: dest.name,
          country: dest.country,
          imageUrl: h.image,
          starRating: h.stars,
          basePrice: h.price,
          romanceScore: h.romance,
          reviewScore: 4.5 + Math.random() * 0.5,
          reviewCount: 100 + Math.floor(Math.random() * 900),
          isActive: true,
        },
      });
      console.log(`  🏨 ${h.name}`);
    }

    for (const f of dest.flights) {
      await prisma.travelProduct.upsert({
        where: {
          externalId_source_productType: {
            externalId: `${dest.slug}-${f.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
            source: "SREVOL_SEED",
            productType: "FLIGHT",
          },
        },
        update: {
          name: f.name,
          description: `Return flights to ${dest.name}`,
          destination: dest.name,
          country: dest.country,
          basePrice: f.price,
          isActive: true,
        },
        create: {
          externalId: `${dest.slug}-${f.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
          source: "SREVOL_SEED",
          productType: "FLIGHT",
          name: f.name,
          description: `Return flights to ${dest.name}`,
          destination: dest.name,
          country: dest.country,
          basePrice: f.price,
          isActive: true,
        },
      });
      console.log(`  ✈️  ${f.name}`);
    }

    for (const a of dest.activities) {
      await prisma.travelProduct.upsert({
        where: {
          externalId_source_productType: {
            externalId: `${dest.slug}-${a.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
            source: "SREVOL_SEED",
            productType: "ACTIVITY",
          },
        },
        update: {
          name: a.name,
          description: `Romantic experience in ${dest.name}`,
          destination: dest.name,
          country: dest.country,
          basePrice: a.price,
          romanceScore: a.romance,
          isActive: true,
        },
        create: {
          externalId: `${dest.slug}-${a.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
          source: "SREVOL_SEED",
          productType: "ACTIVITY",
          name: a.name,
          description: `Romantic experience in ${dest.name}`,
          destination: dest.name,
          country: dest.country,
          basePrice: a.price,
          romanceScore: a.romance,
          isActive: true,
        },
      });
      console.log(`  🎯 ${a.name}`);
    }
  }

  const counts = await prisma.travelProduct.groupBy({
    by: ["productType"],
    _count: { id: true },
  });

  console.log("\n✅ Products seeded!");
  for (const c of counts) {
    console.log(`   ${c.productType}: ${c._count.id}`);
  }
  console.log();

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
