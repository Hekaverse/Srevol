import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PackageDetailClient from "./PackageDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const template = await db.packageTemplate.findFirst({
    where: { slug: id, isActive: true },
    select: { title: true, description: true, destination: true },
  });

  if (!template) return { title: "Not Found — SREVOL" };

  return {
    title: `${template.title} — SREVOL`,
    description: template.description || `Reserve your departure to ${template.destination} with SREVOL.`,
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PackageDetailPage({ params }: Props) {
  const { id } = await params;

  const template = await db.packageTemplate.findFirst({
    where: { slug: id, isActive: true },
  });

  if (!template) {
    notFound();
  }

  const gallery = template.gallery ? JSON.parse(template.gallery) : [];

  return (
    <PackageDetailClient
      template={{
        id: template.id,
        title: template.title,
        subtitle: template.subtitle ?? "",
        description: template.description ?? "",
        destination: template.destination ?? "",
        image: template.image ?? "",
        gallery,
        basePrice: template.basePrice,
        duration: template.duration,
      }}
    />
  );
}
