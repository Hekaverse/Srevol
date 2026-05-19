import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createBookingSchema = z.object({
  bucketId: z.string().min(1),
  packageId: z.string().min(1),
  travelDate: z.string().datetime().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { bucketId, packageId, travelDate } = parsed.data;

    const result = await db.$transaction(async (tx) => {
      const bucket = await tx.budgetBucket.findUnique({
        where: { id: bucketId },
        include: { tier: true },
      });

      if (!bucket) throw new Error("Bucket not found");

      // Verify ownership
      const couple = await tx.couple.findFirst({
        where: {
          id: bucket.coupleId,
          OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
        },
      });
      if (!couple) throw new Error("Access denied");

      const pkg = await tx.package.findUnique({ where: { id: packageId } });
      if (!pkg) throw new Error("Package not found");

      // Create booking
      const booking = await tx.booking.create({
        data: {
          coupleId: couple.id,
          packageId,
          status: "CONFIRMED",
          basePrice: pkg.basePrice,
          totalPrice: pkg.basePrice,
          travelDate: travelDate ? new Date(travelDate) : null,
        },
      });

      // Create payment plan
      const monthlyAmount = Math.ceil(pkg.basePrice / bucket.months);
      const paymentPlan = await tx.paymentPlan.create({
        data: {
          bookingId: booking.id,
          totalAmount: pkg.basePrice,
          months: bucket.months,
          monthlyAmount,
          startDate: new Date(),
        },
      });

      // Create countdown
      const targetDate = travelDate
        ? new Date(travelDate)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      const countdown = await tx.countdown.create({
        data: {
          coupleId: couple.id,
          bookingId: booking.id,
          targetDate,
          message: `Your ${bucket.tier.name} escape to ${pkg.destination}`,
        },
      });

      // Update bucket status
      await tx.budgetBucket.update({
        where: { id: bucketId },
        data: { status: "BOOKED", actualBookedPrice: pkg.basePrice },
      });

      return { booking, paymentPlan, countdown };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Booking error:", error);
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
      return NextResponse.json({ success: false, error: "coupleId required" }, { status: 400 });
    }

    // Verify ownership
    const couple = await db.couple.findFirst({
      where: {
        id: coupleId,
        OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
      },
    });
    if (!couple) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    const bookings = await db.booking.findMany({
      where: { coupleId },
      include: { package: true, paymentPlan: { include: { payments: true } }, countdown: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
