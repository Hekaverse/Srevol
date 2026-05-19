import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createBucketSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBucketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { tierId, coupleId, targetAmount, months, initialDeposit, preferredDestinations, preferredDates } = parsed.data;

    // Verify the couple belongs to the authenticated user
    const couple = await db.couple.findFirst({
      where: {
        id: coupleId,
        OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
      },
    });

    if (!couple) {
      return NextResponse.json({ success: false, error: "Couple not found or access denied" }, { status: 403 });
    }

    const tier = await db.budgetTier.findUnique({ where: { id: tierId } });
    if (!tier) {
      return NextResponse.json({ success: false, error: "Tier not found" }, { status: 404 });
    }

    const finalTarget = targetAmount || tier.maxPrice;
    const finalMonths = months || tier.defaultMonths;
    const monthlyAmount = Math.ceil(finalTarget / finalMonths);
    const inflationBuffer = tier.inflationBuffer || 0.15;
    const protectedTarget = Math.round(finalTarget * (1 + inflationBuffer));

    const bucket = await db.budgetBucket.create({
      data: {
        coupleId,
        tierId,
        targetAmount: finalTarget,
        protectedTarget,
        savedAmount: initialDeposit || 0,
        monthlyAmount,
        months: finalMonths,
        startDate: new Date(),
        preferredDestinations: preferredDestinations ? JSON.stringify(preferredDestinations) : tier.destinations,
        preferredDates: preferredDates ? JSON.stringify(preferredDates) : null,
        status: "SAVING",
        inflationBufferApplied: inflationBuffer,
      },
      include: { tier: true },
    });

    return NextResponse.json({
      success: true,
      bucket: {
        id: bucket.id,
        tierName: bucket.tier.name,
        targetAmount: bucket.targetAmount,
        protectedTarget: bucket.protectedTarget,
        savedAmount: bucket.savedAmount,
        monthlyAmount: bucket.monthlyAmount,
        months: bucket.months,
        status: bucket.status,
        inflationBuffer: bucket.inflationBufferApplied,
      },
    });
  } catch (error) {
    console.error("Bucket creation error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const coupleId = searchParams.get("coupleId");

    if (!coupleId) {
      return NextResponse.json({ success: false, error: "coupleId is required" }, { status: 400 });
    }

    // Verify access
    const couple = await db.couple.findFirst({
      where: {
        id: coupleId,
        OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
      },
    });

    if (!couple) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const buckets = await db.budgetBucket.findMany({
      where: { coupleId },
      include: { tier: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      buckets: buckets.map((b) => ({
        id: b.id,
        tierName: b.tier.name,
        tierSlug: b.tier.slug,
        targetAmount: b.targetAmount,
        protectedTarget: b.protectedTarget,
        savedAmount: b.savedAmount,
        monthlyAmount: b.monthlyAmount,
        months: b.months,
        status: b.status,
        progress: Math.round((b.savedAmount / (b.protectedTarget || b.targetAmount)) * 100),
        inflationBuffer: b.inflationBufferApplied,
        repricedAt: b.repricedAt,
        actualBookedPrice: b.actualBookedPrice,
        priceDifference: b.priceDifference,
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error("Bucket fetch error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
