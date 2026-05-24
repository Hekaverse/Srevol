import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }
  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      package: true,
      countdown: true,
      couple: {
        include: {
          partner1: { select: { name: true } },
          partner2: { select: { name: true } },
        },
      },
    },
  });

  if (!booking || booking.status !== "CONFIRMED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Ensure referral code exists
  if (!booking.couple.referralCode) {
    const code = generateReferralCode(booking.couple.id);
    await db.couple.update({
      where: { id: booking.couple.id },
      data: { referralCode: code },
    });
    booking.couple.referralCode = code;
  }

  // Get tier from booking
  let tierName = "Horizon";
  let tierSlug = "horizon";
  if (booking.tierId) {
    const tier = await db.budgetTier.findUnique({
      where: { id: booking.tierId },
      select: { name: true, slug: true },
    });
    if (tier) {
      tierName = tier.name;
      tierSlug = tier.slug;
    }
  }

  return NextResponse.json({
    success: true,
    booking: {
      id: booking.id,
      destination: booking.package?.destination || booking.package?.title,
      tier: {
        name: tierName,
        slug: tierSlug,
      },
      countdown: booking.countdown
        ? { targetDate: booking.countdown.targetDate.toISOString() }
        : null,
      couple: {
        partner1Name: booking.couple.partner1?.name || null,
        partner2Name: booking.couple.partner2?.name || null,
        referralCode: booking.couple.referralCode,
      },
    },
  });
}

function generateReferralCode(coupleId: string) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SV";
  let hash = 0;
  for (let i = 0; i < coupleId.length; i++) {
    hash = (hash << 5) - hash + coupleId.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 5; i++) {
    code += chars[Math.abs(hash + i * 7) % chars.length];
  }
  return code;
}
