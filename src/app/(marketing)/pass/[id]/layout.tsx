import type { Metadata } from "next";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id, status: "CONFIRMED" },
    include: {
      package: { select: { title: true, destination: true, image: true } },
      tier: { select: { name: true } },
    },
  });

  const title = booking?.package?.title || "SREVOL Boarding Pass";
  const destination = booking?.package?.destination || "Your Destination";
  const tier = booking?.tier?.name || "Horizon";

  return {
    title: `${title} — SREVOL Boarding Pass`,
    description: `We've secured our ${tier} Class departure to ${destination} on SREVOL.`,
    openGraph: {
      title: `${title} — SREVOL Boarding Pass`,
      description: `We've secured our ${tier} Class departure to ${destination} on SREVOL.`,
      type: "article",
      images: booking?.package?.image
        ? [
            {
              url: booking.package.image,
              width: 1200,
              height: 630,
              alt: `${title} — ${destination}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — SREVOL Boarding Pass`,
      description: `We've secured our ${tier} Class departure to ${destination} on SREVOL.`,
      images: booking?.package?.image ? [booking.package.image] : undefined,
    },
  };
}

export default function PassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
