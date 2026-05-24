import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const couple = await db.couple.findFirst({
      where: {
        OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
      },
      include: {
        partner1: true,
        partner2: true,
      },
    });

    if (!couple) {
      return NextResponse.json({ success: true, bookings: [] });
    }

    const bookings = await db.booking.findMany({
      where: { coupleId: couple.id },
      include: {
        package: true,
        paymentPlan: { include: { payments: true } },
        countdown: true,
        tier: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = bookings.map((bk) => ({
      ...bk,
      couple: {
        partner1Name: couple.partner1?.name || couple.partner1?.email?.split("@")[0] || "Traveler 1",
        partner2Name: couple.partner2?.name || couple.partner2?.email?.split("@")[0] || "Traveler 2",
      },
    }));

    return NextResponse.json({ success: true, bookings: enriched });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
