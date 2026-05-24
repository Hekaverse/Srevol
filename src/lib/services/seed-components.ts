import { db } from "@/lib/db";

interface HotelSeed {
  externalId: string;
  name: string;
  description: string;
  destination: string;
  country: string;
  imageUrl: string;
  galleryUrls: string[];
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  amenities: string[];
  romanceScore: number;
  romanceTags: string[];
  basePrice: number; // per night in cents
}

interface ExperienceSeed {
  externalId: string;
  name: string;
  description: string;
  destination: string;
  country: string;
  imageUrl: string;
  basePrice: number;
  duration: number; // hours
  category: string;
}

const hotelInventory: Record<string, HotelSeed> = {
  santorini: {
    externalId: "hotel-santorini-canaves",
    name: "Canaves Oia Suites",
    description: "Carved into the cliffs of Oia, these suites offer uninterrupted Caldera views, private infinity pools, and a Michelin-recommended restaurant. Each suite features king beds draped in Egyptian cotton, outdoor jacuzzis, and dedicated concierge service.",
    destination: "Santorini, Greece",
    country: "Greece",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop",
    ],
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 428,
    amenities: ["Infinity Pool", "Spa", "Michelin Dining", "Private Balcony", "Concierge", "Airport Transfer", "Breakfast Included", "Wine Cellar"],
    romanceScore: 9.8,
    romanceTags: ["Sunset Views", "Private Pool", "Cliffside"],
    basePrice: 68000,
  },
  maldives: {
    externalId: "hotel-maldives-soneva",
    name: "Soneva Fushi",
    description: "A barefoot luxury resort on a private island in the Baa Atoll UNESCO biosphere. Villas feature outdoor bathrooms, private beaches, and telescopes for stargazing. The resort has its own observatory, overwater cinema, and silent disco.",
    destination: "Maldives",
    country: "Maldives",
    imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop",
    galleryUrls: [
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop",
    ],
    starRating: 5,
    reviewScore: 9.6,
    reviewCount: 312,
    amenities: ["Overwater Villas", "Private Beach", "Observatory", "Dive Center", "Spa", "Overwater Cinema", "Organic Garden", "Water Sports"],
    romanceScore: 9.9,
    romanceTags: ["Overwater", "Private Island", "Stargazing"],
    basePrice: 95000,
  },
  bali: {
    externalId: "hotel-bali-hanging-gardens",
    name: "Hanging Gardens of Bali",
    description: "Famous for its split-level infinity pool that appears to float above the Ubud jungle. Each villa has a private heated plunge pool, outdoor daybed, and butler service. The spa uses volcanic stone treatments and Balinese healing rituals.",
    destination: "Bali, Indonesia",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.2,
    reviewCount: 567,
    amenities: ["Infinity Pool", "Spa", "Butler Service", "Private Pool", "Yoga Pavilion", "Rice Terrace Walks", "Helicopter Pad", "Romantic Dining"],
    romanceScore: 9.5,
    romanceTags: ["Jungle Views", "Infinity Pool", "Private Butler"],
    basePrice: 42000,
  },
  tulum: {
    externalId: "hotel-tulum-azulik",
    name: "Azulik Tulum",
    description: "An adults-only eco-resort with no electricity in the rooms — only candlelight. Treehouse villas connected by jungle pathways, Mayan spa rituals, and a restaurant where chefs cook over open fire. No WiFi, no TV, just presence.",
    destination: "Tulum, Mexico",
    country: "Mexico",
    imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 4.5,
    reviewScore: 8.9,
    reviewCount: 423,
    amenities: ["Treehouse Villas", "Mayan Spa", "Beachfront", "Candlelight Dining", "Yoga", "Temazcal", "No WiFi", "Organic Restaurant"],
    romanceScore: 9.3,
    romanceTags: ["Digital Detox", "Treehouse", "Mayan Rituals"],
    basePrice: 38000,
  },
  paris: {
    externalId: "hotel-paris-ritz",
    name: "The Ritz Paris",
    description: "The most legendary hotel in the world. Hemingway's bar, Coco Chanel's suite, and the finest address in Paris. The newly renovated rooms feature 18th-century French decor, marble bathrooms with heated floors, and views of Place Vendôme.",
    destination: "Paris, France",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 891,
    amenities: ["Michelin Restaurant", "Spa", "Indoor Pool", "Concierge", "Champagne Bar", "Valet", "Butler", "Fitness Center"],
    romanceScore: 9.7,
    romanceTags: ["Legendary", "Champagne", "Place Vendôme"],
    basePrice: 85000,
  },
  dubai: {
    externalId: "hotel-dubai-burj-al-arab",
    name: "Burj Al Arab",
    description: "The sail-shaped icon of Dubai. Every suite is duplex with floor-to-ceiling windows overlooking the Arabian Gulf. Your personal butler, chauffeur-driven Rolls-Royce, and dining at Al Muntaha — 200 meters above sea level.",
    destination: "Dubai, UAE",
    country: "UAE",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.3,
    reviewCount: 756,
    amenities: ["Helicopter Transfer", "Private Beach", "Spa", "Butler", "Rolls-Royce Fleet", "Sky Restaurant", "Gold Interiors", "Aquarium Restaurant"],
    romanceScore: 9.6,
    romanceTags: ["Iconic", "Gold", "Skyline Views"],
    basePrice: 78000,
  },
  bora_bora: {
    externalId: "hotel-borabora-st-regis",
    name: "The St. Regis Bora Bora",
    description: "Mount Otemanu views from every overwater villa. Glass floor panels, private plunge pools, and butler service. The Lagoon Restaurant by Jean-Georges and the Miri Miri Spa on its own private island.",
    destination: "Bora Bora",
    country: "French Polynesia",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d7e?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 298,
    amenities: ["Overwater Villas", "Private Island Spa", "Butler Service", "Jean-Georges Dining", "Glass Floor", "Plunge Pool", "Lagoon Access", "Sunset Deck"],
    romanceScore: 9.9,
    romanceTags: ["Overwater", "Mount Otemanu", "Private Spa Island"],
    basePrice: 110000,
  },
  seychelles: {
    externalId: "hotel-seychelles-north-island",
    name: "North Island",
    description: "Where William and Kate honeymooned. Only 11 villas on an entire private island. Each villa is handcrafted from local stone and reclaimed wood, with direct beach access and personal electric buggy. Endemic tortoises roam freely.",
    destination: "Seychelles",
    country: "Seychelles",
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.8,
    reviewCount: 87,
    amenities: ["Private Island", "11 Villas Only", "Turtle Sanctuary", "Dive Center", "Spa", "Private Chef", "Helicopter Pad", "Endemic Wildlife"],
    romanceScore: 9.9,
    romanceTags: ["Private Island", "Royal Honeymoon", "Wildlife"],
    basePrice: 145000,
  },
  patagonia: {
    externalId: "hotel-patagonia-explora",
    name: "Explora Patagonia",
    description: "The only hotel inside Torres del Paine National Park. Floor-to-ceiling windows frame the Paine Massif. All excursions — glacier treks, horseback rides, condor watching — are included and led by expert guides.",
    destination: "Patagonia, Argentina",
    country: "Argentina",
    imageUrl: "https://images.unsplash.com/photo-1518182170546-0766bc6f9213?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 4.5,
    reviewScore: 9.1,
    reviewCount: 234,
    amenities: ["National Park Location", "All Excursions Included", "Spa", "Observatory", "Hot Tub", "Guided Treks", "Horseback Riding", "Photography Tours"],
    romanceScore: 9.0,
    romanceTags: ["National Park", "Adventure", "Glaciers"],
    basePrice: 52000,
  },
  kenya: {
    externalId: "hotel-kenya-angama",
    name: "Angama Mara",
    description: "Perched on the edge of the Great Rift Valley, 1,000 feet above the Maasai Mara. Each tent has a 180-degree view of the savanna. The infinity pool appears to merge with the sky. Hot air balloon safaris at dawn.",
    destination: "Kenya",
    country: "Kenya",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 156,
    amenities: ["Clifftop Location", "Infinity Pool", "Balloon Safaris", "Spa", "Photography Studio", "Bush Dining", "Maasai Guides", "Game Drives"],
    romanceScore: 9.4,
    romanceTags: ["Clifftop", "Balloon Safari", "Big Five"],
    basePrice: 68000,
  },
  norway: {
    externalId: "hotel-norway-sorrisniva",
    name: "Sorrisniva Igloo Hotel",
    description: "Rebuilt every winter from ice and snow. Sleep in a room carved by ice artists at -5°C, warmed by reindeer hides and thermal sleeping bags. The ice bar serves drinks in glasses made of ice. Northern Lights viewing from your bed.",
    destination: "Tromsø, Norway",
    country: "Norway",
    imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 4,
    reviewScore: 8.8,
    reviewCount: 312,
    amenities: ["Ice Hotel", "Northern Lights", "Ice Bar", "Snowmobiling", "Reindeer Sleigh", "Ice Chapel", "Thermal Suits", "Arctic Dining"],
    romanceScore: 9.2,
    romanceTags: ["Ice Hotel", "Northern Lights", "Arctic"],
    basePrice: 35000,
  },
  amalfi: {
    externalId: "hotel-amalfi-monastero",
    name: "Monastero Santa Rosa",
    description: "A 17th-century monastery converted into a cliffside hotel. Each room was once a nun's cell. Tiered gardens cascade down to the sea. The infinity pool is carved from the original cistern. Breakfast on your private terrace overlooking the Gulf of Salerno.",
    destination: "Amalfi Coast, Italy",
    country: "Italy",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.3,
    reviewCount: 201,
    amenities: ["Clifftop Gardens", "Infinity Pool", "Monastery History", "Spa", "Private Terrace", "Boat Transfers", "Michelin Dining", "Lemon Grove"],
    romanceScore: 9.5,
    romanceTags: ["Monastery", "Clifftop", "History"],
    basePrice: 58000,
  },
  swiss_alps: {
    externalId: "hotel-swiss-chedi",
    name: "The Chedi Andermatt",
    description: "Asian-inspired Alpine luxury. 105-meter indoor pool, 4-Michelin-star dining, and ski-in/ski-out access. Fireplaces in every room, floor heating, and panoramic Matterhorn views from the spa.",
    destination: "Zermatt, Switzerland",
    country: "Switzerland",
    imageUrl: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.2,
    reviewCount: 178,
    amenities: ["105m Pool", "4 Michelin Stars", "Ski-in/Ski-out", "Spa", "Fireplace", "Matterhorn Views", "Wine Library", "Ski Valet"],
    romanceScore: 9.1,
    romanceTags: ["Alpine", "Michelin", "Ski"],
    basePrice: 62000,
  },
  costa_rica: {
    externalId: "hotel-costa-rica-nayara",
    name: "Nayara Tented Camp",
    description: "Luxury tents suspended in the Arenal rainforest canopy. Each tent has a private plunge pool fed by natural hot springs. Wake to howler monkeys, soak in volcanic waters, and dine by lantern light.",
    destination: "Costa Rica",
    country: "Costa Rica",
    imageUrl: "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.0,
    reviewCount: 445,
    amenities: ["Tented Camp", "Hot Springs", "Canopy Views", "Spa", "Zip-line", "Wildlife Tours", "Private Plunge Pool", "Lantern Dining"],
    romanceScore: 9.0,
    romanceTags: ["Rainforest", "Hot Springs", "Tented"],
    basePrice: 32000,
  },
  portugal: {
    externalId: "hotel-portugal-vila-monte",
    name: "Vila Monte Farm House",
    description: "A restored Algarve farmhouse with white-washed walls, Moorish arches, and orange groves. The farm-to-table restaurant serves seafood caught that morning. Private access to a secluded beach cove.",
    destination: "Algarve, Portugal",
    country: "Portugal",
    imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 4.5,
    reviewScore: 8.7,
    reviewCount: 312,
    amenities: ["Farmhouse", "Orange Groves", "Farm-to-Table", "Private Beach", "Moorish Architecture", "Spa", "Wine Tasting", "Cooking Classes"],
    romanceScore: 8.9,
    romanceTags: ["Farmhouse", "Secluded Beach", "Moorish"],
    basePrice: 28000,
  },
  morocco: {
    externalId: "hotel-morocco-royal-mansour",
    name: "Royal Mansour Marrakech",
    description: "Built by the King of Morocco. 53 individual riads, each with private courtyard, plunge pool, and rooftop terrace. Hand-carved cedar ceilings, zellige tilework, and butlers who materialize without being called.",
    destination: "Marrakech, Morocco",
    country: "Morocco",
    imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.4,
    reviewCount: 267,
    amenities: ["Royal Riads", "Private Courtyards", "Butler Service", "Spa", "Hammam", "Michelin Dining", "Medina Access", "Rooftop Terrace"],
    romanceScore: 9.3,
    romanceTags: ["Royal", "Riad", "Butler"],
    basePrice: 48000,
  },
  kyoto: {
    externalId: "hotel-kyoto-hoshinoya",
    name: "Hoshinoya Kyoto",
    description: "A boat ride up the Oi River to a hidden valley. 25 rooms in a restored Meiji-era villa. Kaiseki breakfast, private onsen, and morning meditation led by a monk. No TV, no clocks — time flows with the river.",
    destination: "Kyoto, Japan",
    country: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.3,
    reviewCount: 198,
    amenities: ["River Boat Arrival", "Private Onsen", "Kaiseki Dining", "Meditation", "Garden Views", "Tea Ceremony", "No TV", "Monk-led Activities"],
    romanceScore: 9.4,
    romanceTags: ["Hidden Valley", "Onsen", "Kaiseki"],
    basePrice: 55000,
  },
  private_island: {
    externalId: "hotel-private-moskito",
    name: "Moskito Island",
    description: "Richard Branson's private island in the British Virgin Islands. 10 bedrooms across 6 villas. Your own watersports center, two beaches, and a staff of 30. No other guests — just you, the turtles, and the trade winds.",
    destination: "Caribbean Private Island",
    country: "British Virgin Islands",
    imageUrl: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.7,
    reviewCount: 34,
    amenities: ["Entire Island", "30 Staff", "Watersports Center", "Two Beaches", "Private Chef", "Helicopter", "Yacht", "Turtle Sanctuary"],
    romanceScore: 10,
    romanceTags: ["Entire Island", "Exclusive", "Branson"],
    basePrice: 280000,
  },
  antarctica: {
    externalId: "hotel-antarctica-white-desert",
    name: "White Desert Whichaway Camp",
    description: "The only luxury camp in Antarctica. Geodesic pods with heated floors, fur rugs, and floor-to-ceiling windows. Ice caves, emperor penguin colonies, and ice climbing. Arrive by private jet from Cape Town.",
    destination: "Antarctica",
    country: "Antarctica",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.5,
    reviewCount: 12,
    amenities: ["Geodesic Pods", "Heated Floors", "Private Jet", "Ice Caves", "Penguin Colonies", "Expert Guides", "Ice Climbing", "Polar Dining"],
    romanceScore: 9.8,
    romanceTags: ["Geodesic Pods", "Penguins", "Private Jet"],
    basePrice: 185000,
  },
  around_world: {
    externalId: "hotel-atw-four-seasons-jet",
    name: "Four Seasons Private Jet",
    description: "A custom-fitted Boeing 757 with 48 lie-flat seats, personal concierge, and a dedicated chef. 21 days across Tokyo, Maldives, Santorini, and New York. Every hotel is a Four Seasons. Every transfer is seamless.",
    destination: "Multi-Destination",
    country: "Multiple",
    imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.6,
    reviewCount: 45,
    amenities: ["Private Jet", "Lie-flat Seats", "Personal Concierge", "Onboard Chef", "Four Seasons Hotels", "Seamless Transfers", "Custom Itinerary", "Luggage Service"],
    romanceScore: 9.9,
    romanceTags: ["Private Jet", "Around the World", "Four Seasons"],
    basePrice: 320000,
  },
  safari_seychelles: {
    externalId: "hotel-combo-angama-north",
    name: "Angama Mara + North Island",
    description: "Five nights cliffside above the Maasai Mara, followed by five nights on your own private island. The ultimate bush-to-beach combination. Big Five by dawn, tortoises by dusk.",
    destination: "Kenya & Seychelles",
    country: "Kenya / Seychelles",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&h=600&fit=crop",
    galleryUrls: [],
    starRating: 5,
    reviewScore: 9.7,
    reviewCount: 23,
    amenities: ["Two Properties", "Balloon Safari", "Private Island", "Big Five", "Turtle Sanctuary", "Private Jet Transfer", "Butler", "Chef"],
    romanceScore: 9.9,
    romanceTags: ["Bush to Beach", "Private Island", "Safari"],
    basePrice: 195000,
  },
};

const experienceInventory: Record<string, ExperienceSeed[]> = {
  santorini: [
    { externalId: "exp-santorini-sunset-cruise", name: "Private Sunset Catamaran", description: "Sail the Caldera at golden hour. Swim in hot springs, snorkel in volcanic waters, and dine on grilled seafood as the sun sets behind Oia.", destination: "Santorini, Greece", country: "Greece", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop", basePrice: 32000, duration: 5, category: "WATER" },
    { externalId: "exp-santorini-wine-tour", name: "Volcanic Vineyard Tour", description: "Visit three family-owned wineries. Taste Assyrtiko wines grown in volcanic soil. Private sommelier, artisan cheese pairings, and sunset views from Santo Wines.", destination: "Santorini, Greece", country: "Greece", imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop", basePrice: 18000, duration: 4, category: "CULINARY" },
    { externalId: "exp-santorini-photographer", name: "Private Couples Photoshoot", description: "A professional photographer captures you in Oia's blue-domed alleys, at the castle ruins, and on a cliff edge at sunset. 50 edited photos delivered within 48 hours.", destination: "Santorini, Greece", country: "Greece", imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=400&h=300&fit=crop", basePrice: 45000, duration: 3, category: "PHOTOGRAPHY" },
  ],
  maldives: [
    { externalId: "exp-maldives-diving", name: "Private Dive with Manta Rays", description: "Dive Hanifaru Bay with a marine biologist. Swim alongside manta rays, whale sharks, and turtles. Underwater photography included.", destination: "Maldives", country: "Maldives", imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop", basePrice: 28000, duration: 3, category: "WATER" },
    { externalId: "exp-maldives-spa", name: "Overwater Spa Ritual", description: "Four-hour couples treatment. Body scrub with Maldivian sand, massage with coconut oil, flower bath, and champagne on your private overwater deck.", destination: "Maldives", country: "Maldives", imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&h=300&fit=crop", basePrice: 55000, duration: 4, category: "WELLNESS" },
  ],
  bali: [
    { externalId: "exp-bali-temple", name: "Dawn Temple Blessing", description: "Private sunrise ceremony at a 9th-century water temple. A Balinese priest blesses your union with holy water and frangipani offerings. No other tourists.", destination: "Bali, Indonesia", country: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", basePrice: 22000, duration: 3, category: "CULTURE" },
    { externalId: "exp-bali-cooking", name: "Farm-to-Table Cooking Class", description: "Harvest ingredients from an organic farm in Ubud. Learn to cook rendang, sate lilit, and nasi goreng with a Balinese grandmother. Eat what you cook in a bamboo pavilion.", destination: "Bali, Indonesia", country: "Indonesia", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", basePrice: 15000, duration: 4, category: "CULINARY" },
  ],
  tulum: [
    { externalId: "exp-tulum-cenote", name: "Private Cenote Dive", description: "Descend into a sacred cenote via rappel. Swim through underground rivers lit by sunlight streaming through limestone openings. Mayan guide explains the spiritual significance.", destination: "Tulum, Mexico", country: "Mexico", imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop", basePrice: 18000, duration: 4, category: "ADVENTURE" },
    { externalId: "exp-tulum-temazcal", name: "Temazcal Ceremony", description: "A traditional Mayan sweat lodge ceremony led by a shaman. Four rounds of heat, herbs, and chanting. Emerge renewed. Followed by a cold plunge in the jungle.", destination: "Tulum, Mexico", country: "Mexico", imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop", basePrice: 12000, duration: 2, category: "WELLNESS" },
  ],
  paris: [
    { externalId: "exp-paris-seine", name: "Private Seine Dinner Cruise", description: "A 40-foot Venetian taxi, just for two. Champagne, caviar, and a three-course meal by a private chef. Float past Notre-Dame, the Louvre, and the Eiffel Tower at midnight.", destination: "Paris, France", country: "France", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", basePrice: 38000, duration: 3, category: "CULINARY" },
    { externalId: "exp-paris-louvre", name: "After-Hours Louvre Tour", description: "The museum closes to the public. You and your partner wander the galleries alone. Stand before the Mona Lisa with no crowd. Your art historian guide reveals hidden stories.", destination: "Paris, France", country: "France", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", basePrice: 25000, duration: 2, category: "CULTURE" },
  ],
  dubai: [
    { externalId: "exp-dubai-desert", name: "Private Desert Safari & Dinner", description: "Dune bashing in a vintage Land Rover, falconry demonstration, and a private camp in the dunes. Seven-course Bedouin dinner under the stars. Sleep in a luxury tent if you choose.", destination: "Dubai, UAE", country: "UAE", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", basePrice: 28000, duration: 6, category: "ADVENTURE" },
    { externalId: "exp-dubai-heli", name: "Helicopter to Palm Jumeirah", description: "Private helicopter from Atlantis to the Burj Al Arab. Aerial views of the Palm, the World Islands, and the Dubai skyline. Touch down on the Burj's helipad for photos.", destination: "Dubai, UAE", country: "UAE", imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", basePrice: 45000, duration: 1, category: "AERIAL" },
  ],
  bora_bora: [
    { externalId: "exp-bora-shark", name: "Shark & Ray Snorkel Safari", description: "Swim with blacktip reef sharks and stingrays in their natural lagoon. Your marine biologist guide hand-feeds the rays while you float among them.", destination: "Bora Bora", country: "French Polynesia", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d7e?w=400&h=300&fit=crop", basePrice: 18000, duration: 3, category: "WATER" },
    { externalId: "exp-bora-heli", name: "Mount Otemanu Helicopter Tour", description: "Circle Bora Bora's volcanic peak, then land on a private motu for a champagne picnic. The lagoon's 50 shades of blue from above.", destination: "Bora Bora", country: "French Polynesia", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d7e?w=400&h=300&fit=crop", basePrice: 35000, duration: 1, category: "AERIAL" },
  ],
  seychelles: [
    { externalId: "exp-seychelles-turtle", name: "Endangered Turtle Hatchling Release", description: "Visit the island's turtle sanctuary at dawn. Release hatchlings into the Indian Ocean. Your donation funds a year of conservation work.", destination: "Seychelles", country: "Seychelles", imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=300&fit=crop", basePrice: 15000, duration: 2, category: "WILDLIFE" },
    { externalId: "exp-seychelles-coco", name: "Coco de Mer Forest Walk", description: "Guided hike through Vallée de Mai, a UNESCO World Heritage forest. See the world's largest seed, the Coco de Mer, and the rare black parrot. Picnic by a waterfall.", destination: "Seychelles", country: "Seychelles", imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400&h=300&fit=crop", basePrice: 12000, duration: 4, category: "ADVENTURE" },
  ],
  patagonia: [
    { externalId: "exp-patagonia-glacier", name: "Perito Moreno Ice Trek", description: "Crampons on, ice axe in hand. Trek across the surface of Perito Moreno glacier with an expert guide. Blue ice caves, deep crevasses, and the sound of ice calving into the lake.", destination: "Patagonia, Argentina", country: "Argentina", imageUrl: "https://images.unsplash.com/photo-1518182170546-0766bc6f9213?w=400&h=300&fit=crop", basePrice: 22000, duration: 6, category: "ADVENTURE" },
    { externalId: "exp-patagonia-horse", name: "Gaucho Horseback Ride", description: "Ride with Argentine gauchos across the Patagonian steppe. Asado lunch by a stream. Learn to throw a boleadora and drink mate around the fire.", destination: "Patagonia, Argentina", country: "Argentina", imageUrl: "https://images.unsplash.com/photo-1518182170546-0766bc6f9213?w=400&h=300&fit=crop", basePrice: 16000, duration: 5, category: "ADVENTURE" },
  ],
  kenya: [
    { externalId: "exp-kenya-balloon", name: "Dawn Balloon over the Mara", description: "Lift off at sunrise. Float 1,000 feet above the Great Migration. Champagne breakfast in the bush upon landing. The silence of the sky, broken only by wildebeest calls below.", destination: "Kenya", country: "Kenya", imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop", basePrice: 38000, duration: 3, category: "AERIAL" },
    { externalId: "exp-kenya-bush", name: "Private Bush Dinner", description: "A table for two under an acacia tree, lit by 200 lanterns. Your own chef, Maasai warriors as guards, and the sounds of the African night. Lion roars in the distance.", destination: "Kenya", country: "Kenya", imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=300&fit=crop", basePrice: 25000, duration: 4, category: "CULINARY" },
  ],
  norway: [
    { externalId: "exp-norway-aurora", name: "Aurora Hunt by Snowmobile", description: "Race across frozen fjords on snowmobiles. Stop at a Sami lavvu tent. Warm by the fire, drink cloudberry liqueur, and watch the Northern Lights dance across the Arctic sky.", destination: "Tromsø, Norway", country: "Norway", imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop", basePrice: 28000, duration: 5, category: "ADVENTURE" },
    { externalId: "exp-norway-reindeer", name: "Reindeer Sleigh & Sami Culture", description: "A traditional reindeer sleigh ride through snow-covered forests. Feed the reindeer. Learn about Sami culture from a herder family. Dinner in a lavvu — reindeer stew and stories.", destination: "Tromsø, Norway", country: "Norway", imageUrl: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=300&fit=crop", basePrice: 18000, duration: 4, category: "CULTURE" },
  ],
  amalfi: [
    { externalId: "exp-amalfi-lemons", name: "Private Lemon Grove Tour & Limoncello", description: "Walk through 500-year-old lemon terraces with a fourth-generation farmer. Pick lemons, learn to make limoncello, and eat lemon risotto under a pergola.", destination: "Amalfi Coast, Italy", country: "Italy", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop", basePrice: 14000, duration: 3, category: "CULINARY" },
    { externalId: "exp-amalfi-boat", name: "Riva Boat to Positano", description: "A restored 1960s Riva Aquarama. Your captain navigates the coastline while you sip Prosecco. Stop at hidden coves for swimming. Arrive in Positano for lunch at La Sponda.", destination: "Amalfi Coast, Italy", country: "Italy", imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop", basePrice: 32000, duration: 6, category: "WATER" },
  ],
  swiss_alps: [
    { externalId: "exp-swiss-glacier", name: "Glacier Express & Matterhorn", description: "The world's slowest express train through 291 bridges and 91 tunnels. Panoramic windows. Three-course lunch with Swiss wine. Arrive in Zermatt for a private Matterhorn viewing.", destination: "Zermatt, Switzerland", country: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400&h=300&fit=crop", basePrice: 25000, duration: 8, category: "RAIL" },
    { externalId: "exp-swiss-fondue", name: "Alpine Fondue Igloo Dinner", description: "A private igloo at 2,500 meters. Cheese fondue over an open fire. Swiss wine. The Matterhorn framed by the igloo's window. Return by moonlit sled.", destination: "Zermatt, Switzerland", country: "Switzerland", imageUrl: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=400&h=300&fit=crop", basePrice: 18000, duration: 3, category: "CULINARY" },
  ],
  costa_rica: [
    { externalId: "exp-costa-zip", name: "Cloud Forest Zip-line Canopy Tour", description: "Soar through the Monteverde cloud forest on 15 zip-lines, including a Superman-style line 1,000 feet long. Suspension bridges, Tarzan swings, and a rappel from a 100-foot platform.", destination: "Costa Rica", country: "Costa Rica", imageUrl: "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=400&h=300&fit=crop", basePrice: 12000, duration: 4, category: "ADVENTURE" },
    { externalId: "exp-costa-sloth", name: "Sloth Sanctuary Night Walk", description: "A guided night walk to spot sloths, tree frogs, and kinkajous. Your naturalist guide has a thermal camera. End with hot chocolate and stories by the fire.", destination: "Costa Rica", country: "Costa Rica", imageUrl: "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=400&h=300&fit=crop", basePrice: 9000, duration: 3, category: "WILDLIFE" },
  ],
  portugal: [
    { externalId: "exp-portugal-wine", name: "Douro Valley Wine Train", description: "A vintage train through terraced vineyards. Stop at three quintas for port tastings. Lunch at a riverside estate. Your sommelier explains the difference between tawny and vintage.", destination: "Algarve, Portugal", country: "Portugal", imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop", basePrice: 18000, duration: 8, category: "CULINARY" },
    { externalId: "exp-portugal-surf", name: "Private Surf Lesson at Amado Beach", description: "A pro surfer teaches you both on one of Portugal's most beautiful beaches. Wetsuits, boards, and a beach picnic with local cheese and wine included.", destination: "Algarve, Portugal", country: "Portugal", imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop", basePrice: 10000, duration: 3, category: "WATER" },
  ],
  morocco: [
    { externalId: "exp-morocco-hammam", name: "Royal Hammam Ritual", description: "A two-hour traditional Moroccan bath ritual. Black soap scrub, rhassoul clay mask, argan oil massage, and rose petal bath in a centuries-old hammam. Mint tea service after.", destination: "Marrakech, Morocco", country: "Morocco", imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&h=300&fit=crop", basePrice: 15000, duration: 2, category: "WELLNESS" },
    { externalId: "exp-morocco-souk", name: "Private Souk Shopping with Stylist", description: "A fashion stylist guides you through the medina's hidden workshops. Custom leather bags, handwoven rugs, and Berber jewelry. Tea with artisans in their workshops.", destination: "Marrakech, Morocco", country: "Morocco", imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&h=300&fit=crop", basePrice: 12000, duration: 4, category: "CULTURE" },
  ],
  kyoto: [
    { externalId: "exp-kyoto-tea", name: "Private Tea Ceremony with Master", description: "A two-hour ceremony in a 400-year-old tea house. Learn the philosophy of ichigo ichie — one time, one meeting. Matcha prepared by a tea master whose family has practiced for 12 generations.", destination: "Kyoto, Japan", country: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", basePrice: 20000, duration: 2, category: "CULTURE" },
    { externalId: "exp-kyoto-kimono", name: "Private Kimono Fitting & Photoshoot", description: "Hand-selected antique silk kimonos. Professional dressing by a kitsuke master. A photoshoot in Gion's bamboo groves and stone pathways. Keep the kimono.", destination: "Kyoto, Japan", country: "Japan", imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop", basePrice: 35000, duration: 4, category: "PHOTOGRAPHY" },
  ],
  private_island: [
    { externalId: "exp-private-yacht", name: "Private Yacht & Crew for a Day", description: "A 70-foot yacht with captain, chef, and dive master. Explore neighboring islands, snorkel shipwrecks, and beach-hop. Sunset dinner on a sandbar.", destination: "Caribbean Private Island", country: "British Virgin Islands", imageUrl: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=400&h=300&fit=crop", basePrice: 45000, duration: 8, category: "WATER" },
    { externalId: "exp-private-concert", name: "Private Beach Concert", description: "A Grammy-winning artist performs just for you on your private beach. Acoustic set at sunset. Dinner by your private chef. A night that exists nowhere else.", destination: "Caribbean Private Island", country: "British Virgin Islands", imageUrl: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=400&h=300&fit=crop", basePrice: 150000, duration: 4, category: "ENTERTAINMENT" },
  ],
  antarctica: [
    { externalId: "exp-antarctica-penguins", name: "Emperor Penguin Colony Visit", description: "A 2-hour flight to a remote emperor penguin colony. Stand among 10,000 penguins and their chicks. Your expedition leader has 20 years of Antarctic experience.", destination: "Antarctica", country: "Antarctica", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop", basePrice: 55000, duration: 6, category: "WILDLIFE" },
    { externalId: "exp-antarctica-ice", name: "Ice Climbing & Abseiling", description: "Climb a 200-foot ice wall with crampons and ice axes. Abseil into a blue ice cave. Your guide is a world-record-holding ice climber.", destination: "Antarctica", country: "Antarctica", imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop", basePrice: 28000, duration: 4, category: "ADVENTURE" },
  ],
  around_world: [
    { externalId: "exp-atw-tokyo", name: "Tokyo: Private Michelin Omakase", description: "A 20-course omakase at a restaurant with 3 Michelin stars. Your chef has trained for 30 years. Sake pairing with each course. The restaurant closes for you.", destination: "Multi-Destination", country: "Japan", imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop", basePrice: 45000, duration: 3, category: "CULINARY" },
    { externalId: "exp-atw-maldives", name: "Maldives: Underwater Restaurant Dinner", description: "Dinner 5 meters below the ocean surface. Coral gardens, sharks, and rays surround your table. Seven courses, each paired with wine. The reef lights up at night.", destination: "Multi-Destination", country: "Maldives", imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop", basePrice: 38000, duration: 3, category: "CULINARY" },
  ],
  safari_seychelles: [
    { externalId: "exp-combo-migration", name: "Great Migration River Crossing", description: "Witness the Mara River crossing from a private vehicle. Thousands of wildebeest, zebras, and gazelles. Crocodiles waiting. Your guide positions you at the perfect vantage point.", destination: "Kenya & Seychelles", country: "Kenya", imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=300&fit=crop", basePrice: 32000, duration: 6, category: "WILDLIFE" },
    { externalId: "exp-combo-island", name: "Seychelles: Private Island Beach Day", description: "A helicopter to a uninhabited island. Your own beach for the day. Snorkel, picnic, and nap under a takamaka tree. No footprints but yours.", destination: "Kenya & Seychelles", country: "Seychelles", imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=300&fit=crop", basePrice: 28000, duration: 6, category: "WATER" },
  ],
};

// Map slug keys to package template slugs
const slugMap: Record<string, string> = {
  santorini: "santorini-sunset",
  maldives: "maldives-paradise",
  bali: "bali-retreat",
  tulum: "tulum-mexico",
  paris: "paris-romance",
  dubai: "dubai-luxury",
  bora_bora: "bora-bora",
  seychelles: "seychelles",
  patagonia: "patagonia",
  kenya: "safari-kenya",
  norway: "northern-lights",
  amalfi: "amalfi-coast",
  swiss_alps: "swiss-alps",
  costa_rica: "costa-rica",
  portugal: "portugal-coast",
  morocco: "morocco-marrakech",
  kyoto: "kyoto-blossoms",
  private_island: "private-island",
  antarctica: "antarctica-expedition",
  around_world: "around-the-world",
  safari_seychelles: "safari-seychelles",
};

export async function seedTravelProductsAndComponents() {
  let productsCreated = 0;
  let componentsCreated = 0;

  for (const [key, hotel] of Object.entries(hotelInventory)) {
    const templateSlug = slugMap[key];
    if (!templateSlug) continue;

    const template = await db.packageTemplate.findUnique({
      where: { slug: templateSlug },
    });
    if (!template) continue;

    // Create or update hotel TravelProduct
    const hotelProduct = await db.travelProduct.upsert({
      where: {
        externalId_source_productType: {
          externalId: hotel.externalId,
          source: "SREVOL_CURATED",
          productType: "HOTEL",
        },
      },
      update: {
        name: hotel.name,
        description: hotel.description,
        destination: hotel.destination,
        country: hotel.country,
        imageUrl: hotel.imageUrl,
        galleryUrls: JSON.stringify(hotel.galleryUrls),
        starRating: hotel.starRating,
        reviewScore: hotel.reviewScore,
        reviewCount: hotel.reviewCount,
        amenities: JSON.stringify(hotel.amenities),
        romanceScore: hotel.romanceScore,
        romanceTags: JSON.stringify(hotel.romanceTags),
        basePrice: hotel.basePrice,
        isActive: true,
      },
      create: {
        externalId: hotel.externalId,
        source: "SREVOL_CURATED",
        productType: "HOTEL",
        name: hotel.name,
        description: hotel.description,
        destination: hotel.destination,
        country: hotel.country,
        imageUrl: hotel.imageUrl,
        galleryUrls: JSON.stringify(hotel.galleryUrls),
        starRating: hotel.starRating,
        reviewScore: hotel.reviewScore,
        reviewCount: hotel.reviewCount,
        amenities: JSON.stringify(hotel.amenities),
        romanceScore: hotel.romanceScore,
        romanceTags: JSON.stringify(hotel.romanceTags),
        basePrice: hotel.basePrice,
        isActive: true,
      },
    });
    productsCreated++;

    // Create PackageComponent linking hotel to template
    await db.packageComponent.upsert({
      where: {
        id: `pc-hotel-${templateSlug}`,
      },
      update: {
        templateId: template.id,
        productId: hotelProduct.id,
        componentType: "ACCOMMODATION",
        dayOffset: 0,
        durationDays: template.duration,
        isOptional: false,
      },
      create: {
        id: `pc-hotel-${templateSlug}`,
        templateId: template.id,
        productId: hotelProduct.id,
        componentType: "ACCOMMODATION",
        dayOffset: 0,
        durationDays: template.duration,
        isOptional: false,
      },
    });
    componentsCreated++;

    // Create experience TravelProducts and PackageComponents
    const experiences = experienceInventory[key] || [];
    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i];
      const expProduct = await db.travelProduct.upsert({
        where: {
          externalId_source_productType: {
            externalId: exp.externalId,
            source: "SREVOL_CURATED",
            productType: "EXPERIENCE",
          },
        },
        update: {
          name: exp.name,
          description: exp.description,
          destination: exp.destination,
          country: exp.country,
          imageUrl: exp.imageUrl,
          basePrice: exp.basePrice,
          isActive: true,
        },
        create: {
          externalId: exp.externalId,
          source: "SREVOL_CURATED",
          productType: "EXPERIENCE",
          name: exp.name,
          description: exp.description,
          destination: exp.destination,
          country: exp.country,
          imageUrl: exp.imageUrl,
          basePrice: exp.basePrice,
          isActive: true,
        },
      });
      productsCreated++;

      await db.packageComponent.upsert({
        where: {
          id: `pc-exp-${templateSlug}-${i}`,
        },
        update: {
          templateId: template.id,
          productId: expProduct.id,
          componentType: "EXPERIENCE",
          dayOffset: Math.min(i + 2, template.duration - 1),
          durationDays: 1,
          isOptional: true,
        },
        create: {
          id: `pc-exp-${templateSlug}-${i}`,
          templateId: template.id,
          productId: expProduct.id,
          componentType: "EXPERIENCE",
          dayOffset: Math.min(i + 2, template.duration - 1),
          durationDays: 1,
          isOptional: true,
        },
      });
      componentsCreated++;
    }

    // Create PriceSnapshot for hotel
    await db.priceSnapshot.create({
      data: {
        productId: hotelProduct.id,
        price: hotel.basePrice,
        currency: "USD",
        source: "SREVOL_CURATED",
      },
    });
  }

  return { productsCreated, componentsCreated };
}
