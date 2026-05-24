import { seedTravelProductsAndComponents } from "../src/lib/services/seed-components";

async function main() {
  console.log("Seeding travel products and package components...");
  const result = await seedTravelProductsAndComponents();
  console.log(`Created ${result.productsCreated} products and ${result.componentsCreated} components.`);
}

main().catch(console.error);
