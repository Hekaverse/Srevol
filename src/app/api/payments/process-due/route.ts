import { NextResponse } from "next/server";
import { getStripeInstance } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    // Verify cron secret or admin auth
    const authHeader = request.headers.get("authorization");
    const expectedSecret = env.CRON_SECRET || env.SEED_SECRET;
    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripeInstance();
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find pending payments that are due within 3 days
    const duePayments = await db.payment.findMany({
      where: {
        status: "PENDING",
        dueDate: { lte: threeDaysFromNow },
      },
      include: {
        paymentPlan: {
          include: { booking: { include: { couple: true, package: true } } },
        },
      },
    });

    const results: Array<{
      paymentId: string;
      status: "charged" | "failed" | "skipped";
      error?: string;
    }> = [];

    for (const payment of duePayments) {
      const plan = payment.paymentPlan;
      if (!plan.stripeCustomerId || !plan.stripePaymentMethodId) {
        results.push({ paymentId: payment.id, status: "skipped", error: "No saved payment method" });
        continue;
      }

      try {
        // Create a PaymentIntent with the saved payment method
        const paymentIntent = await stripe.paymentIntents.create({
          amount: payment.amount,
          currency: "usd",
          customer: plan.stripeCustomerId,
          payment_method: plan.stripePaymentMethodId,
          off_session: true,
          confirm: true,
          description: `SREVOL Payment — ${plan.booking.package?.title || "Trip"}`,
          metadata: {
            paymentId: payment.id,
            paymentPlanId: plan.id,
            bookingId: plan.bookingId,
            coupleId: plan.booking.coupleId,
          },
        });

        if (paymentIntent.status === "succeeded") {
          await db.$transaction(async (tx) => {
            // Mark payment as completed
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: "COMPLETED",
                paidAt: new Date(),
              },
            });

            // Update bucket savings
            const bucket = await tx.budgetBucket.findFirst({
              where: { coupleId: plan.booking.coupleId },
              orderBy: { createdAt: "desc" },
            });
            if (bucket) {
              await tx.budgetBucket.update({
                where: { id: bucket.id },
                data: { savedAmount: { increment: payment.amount } },
              });
            }

            // Create success alert
            await tx.alertQueue.create({
              data: {
                alertType: "PAYMENT_RECEIVED",
                title: "Payment Received",
                message: `Your ${formatPrice(payment.amount)} contribution has been received.`,
                channel: "IN_APP",
              },
            });
          });

          results.push({ paymentId: payment.id, status: "charged" });
        } else if (paymentIntent.status === "requires_action") {
          // 3D Secure required — mark as needing attention
          await db.payment.update({
            where: { id: payment.id },
            data: { status: "REQUIRES_ACTION" },
          });
          results.push({ paymentId: payment.id, status: "failed", error: "Requires customer authentication" });
        } else {
          await db.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
          });
          results.push({ paymentId: payment.id, status: "failed", error: paymentIntent.status });
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });
        results.push({ paymentId: payment.id, status: "failed", error: errorMessage });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      charged: results.filter((r) => r.status === "charged").length,
      failed: results.filter((r) => r.status === "failed").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      details: results,
    });
  } catch (err) {
    console.error("[payments/process-due] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process payments" },
      { status: 500 }
    );
  }
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
