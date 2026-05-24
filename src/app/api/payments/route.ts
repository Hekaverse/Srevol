import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { processPaymentSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = processPaymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { paymentPlanId, amount } = parsed.data;

    const result = await db.$transaction(async (tx) => {
      const paymentPlan = await tx.paymentPlan.findUnique({
        where: { id: paymentPlanId },
        include: { booking: true },
      });

      if (!paymentPlan) throw new Error("Payment plan not found");

      // Verify ownership
      const couple = await tx.couple.findFirst({
        where: {
          id: paymentPlan.booking.coupleId,
          OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
        },
      });
      if (!couple) throw new Error("Access denied");

      const payment = await tx.payment.create({
        data: {
          paymentPlanId,
          amount,
          status: "COMPLETED",
          dueDate: new Date(),
          paidAt: new Date(),
        },
      });

      // Update bucket savings
      const booking = await tx.booking.findUnique({
        where: { id: paymentPlan.bookingId },
        include: { couple: { include: { budgetBuckets: { orderBy: { createdAt: "desc" }, take: 1 } } } },
      });

      if (booking?.couple?.budgetBuckets[0]) {
        const bucket = booking.couple.budgetBuckets[0];
        await tx.budgetBucket.update({
          where: { id: bucket.id },
          data: { savedAmount: { increment: amount } },
        });
      }

      return payment;
    });

    return NextResponse.json({ success: true, payment: result });
  } catch {
    return NextResponse.json(
      { success: false, error: "Payment failed" },
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
    const paymentPlanId = searchParams.get("paymentPlanId");

    if (!paymentPlanId) {
      return NextResponse.json({ success: false, error: "paymentPlanId required" }, { status: 400 });
    }

    const payments = await db.payment.findMany({
      where: { paymentPlanId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, payments });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
