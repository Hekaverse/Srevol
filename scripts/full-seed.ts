import { seedBudgetTiers, seedPackageTemplates } from "../src/lib/services/seed";
import { seedTravelProductsAndComponents } from "../src/lib/services/seed-components";
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding budget tiers...");
  const tiers = await seedBudgetTiers();
  console.log(`  → ${tiers} tiers`);

  console.log("Seeding package templates...");
  const templates = await seedPackageTemplates();
  console.log(`  → ${templates} templates`);

  console.log("Seeding travel products & components...");
  const components = await seedTravelProductsAndComponents();
  console.log(`  → ${components.productsCreated} products, ${components.componentsCreated} components`);
}

main()
  .then(() => console.log("\n✓ Full seed complete"))
  .catch((e) => console.error("\n✗ Seed failed:", e))
  .finally(() => db.$disconnect());
