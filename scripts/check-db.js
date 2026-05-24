const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.packageTemplate.findMany({
    select: { slug: true, title: true, description: true },
  });
  console.log(JSON.stringify(templates, null, 2));
  await prisma.$disconnect();
}

main();
