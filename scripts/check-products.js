const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.travelProduct.count({ where: { productType: "HOTEL" } });
  const flights = await prisma.travelProduct.count({ where: { productType: "FLIGHT" } });
  const activities = await prisma.travelProduct.count({ where: { productType: "ACTIVITY" } });

  console.log("Travel Products:");
  console.log("  Hotels:", hotels);
  console.log("  Flights:", flights);
  console.log("  Activities:", activities);

  if (hotels > 0) {
    const sample = await prisma.travelProduct.findMany({
      where: { productType: "HOTEL" },
      take: 3,
      select: { name: true, destination: true, basePrice: true, starRating: true },
    });
    console.log("\nSample hotels:", JSON.stringify(sample, null, 2));
  }

  await prisma.$disconnect();
}

main();
