import { db } from "../src/lib/db";

async function main() {
  const templates = await db.packageTemplate.findMany({
    select: { slug: true, title: true },
  });
  console.log(JSON.stringify(templates.map((t) => t.slug), null, 2));
}

main().finally(() => db.$disconnect());
