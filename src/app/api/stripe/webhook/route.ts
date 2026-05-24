import { NextResponse } from "next/server";
import { getStripeInstance } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event;
  try {
    event = getStripeInstance().webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      metadata: Record<string, string>;
      customer_email: string | null;
      amount_total: number | null;
    };

    const meta = session.metadata;
    const userId = meta.userId;
    const coupleId = meta.coupleId;
    const packageTemplateId = meta.packageTemplateId;
    const months = parseInt(meta.months, 10);
    const monthlyAmount = parseInt(meta.monthlyAmount, 10);
    const totalAmount = parseInt(meta.totalAmount, 10);
    const protectedAmount = parseInt(meta.protectedAmount, 10);
    const destination = meta.destination;
    const duration = parseInt(meta.duration, 10);

    try {
      // Idempotency: check if we already processed this Stripe session
      const existingBooking = await db.booking.findFirst({
        where: {
          coupleId,
          status: "CONFIRMED",
        },
        orderBy: { createdAt: "desc" },
        include: { paymentPlan: true },
      });
      if (existingBooking?.paymentPlan?.stripeCustomerId) {
        // Already processed this flow
        console.log("[stripe/webhook] idempotent skip for session:", session.id);
        return NextResponse.json({ success: true, idempotent: true });
      }

      // Find the package template
      const template = await db.packageTemplate.findUnique({
        where: { id: packageTemplateId },
        include: { tier: true },
      });
      if (!template) {
        throw new Error("PackageTemplate not found: " + packageTemplateId);
      }

      // Find or create concrete Package from template
      let pkg = await db.package.findFirst({
        where: { slug: template.slug },
      });
      if (!pkg) {
        pkg = await db.package.create({
          data: {
            slug: template.slug,
            title: template.title,
            subtitle: template.subtitle,
            description: template.description,
            destination: template.destination,
            image: template.image,
            gallery: template.gallery,
            basePrice: template.basePrice,
            duration: template.duration,
            category: template.category,
            isActive: template.isActive,
            isPremium: template.isPremium,
          },
        });
      }

      // Get tier from template
      const tierId = template.tierId;

      // Get Stripe customer and payment method from session
      const stripeSession = await getStripeInstance().checkout.sessions.retrieve(
        session.id,
        { expand: ["setup_intent", "payment_intent"] }
      );
      const stripeCustomerId = stripeSession.customer as string | null;
      const paymentIntent = stripeSession.payment_intent as { payment_method: string | null } | null;
      const stripePaymentMethodId = paymentIntent?.payment_method || null;

      // Check for available store credit
      const coupleRecord = await db.couple.findUnique({
        where: { id: coupleId },
        select: { referralCredit: true },
      });
      const availableCredit = coupleRecord?.referralCredit || 0;
      const creditToApply = Math.min(availableCredit, totalAmount);
      const finalTotal = totalAmount - creditToApply;

      await db.$transaction(async (tx) => {
        // Deduct applied credit from couple's balance
        if (creditToApply > 0) {
          await tx.couple.update({
            where: { id: coupleId },
            data: { referralCredit: { decrement: creditToApply } },
          });
        }

        // Create booking with accurate pricing
        const booking = await tx.booking.create({
          data: {
            coupleId,
            packageId: pkg!.id,
            tierId: tierId || null,
            status: "CONFIRMED",
            basePrice: totalAmount,
            totalPrice: finalTotal,
            storeCredit: creditToApply,
          },
        });

        // Create payment plan — totalAmount is what will ACTUALLY be collected
        const paymentPlan = await tx.paymentPlan.create({
          data: {
            bookingId: booking.id,
            totalAmount: finalTotal, // Correct: after store credit applied
            months,
            monthlyAmount,
            startDate: new Date(),
            status: "ACTIVE",
            stripeCustomerId: stripeCustomerId || null,
            stripePaymentMethodId: stripePaymentMethodId || null,
          },
        });

        // Record first payment as COMPLETED
        await tx.payment.create({
          data: {
            paymentPlanId: paymentPlan.id,
            amount: monthlyAmount,
            status: "COMPLETED",
            dueDate: new Date(),
            paidAt: new Date(),
          },
        });

        // Create remaining PENDING payments for auto-billing
        for (let i = 1; i < months; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i);
          await tx.payment.create({
            data: {
              paymentPlanId: paymentPlan.id,
              amount: monthlyAmount,
              status: "PENDING",
              dueDate,
            },
          });
        }

        // Create countdown
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + months);
        await tx.countdown.create({
          data: {
            coupleId,
            bookingId: booking.id,
            targetDate,
            message: `Your departure to ${destination}`,
          },
        });

        // Create budget bucket with correct math
        if (tierId) {
          await tx.budgetBucket.create({
            data: {
              coupleId,
              tierId,
              targetAmount: finalTotal,
              protectedTarget: protectedAmount,
              savedAmount: monthlyAmount,
              monthlyAmount,
              months,
              startDate: new Date(),
              status: "SAVING",
              inflationBufferApplied: parseFloat(
                meta.inflationBuffer || "0.15"
              ),
            },
          });
        }

        // Create alert
        await tx.alertQueue.create({
          data: {
            alertType: "BOOKING_CONFIRMED",
            title: "Reservation Confirmed",
            message: `Your ${duration}-day departure to ${destination} is reserved!`,
            channel: "IN_APP",
          },
        });
      });

      // Send confirmation email
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await sendBookingConfirmationEmail(
          user.email,
          destination,
          new Date(
            Date.now() + months * 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        );
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("[stripe/webhook] booking creation failed:", err);
      return NextResponse.json(
        { success: false, error: "Booking creation failed" },
        { status: 500 }
      );
    }
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "payment_intent.payment_failed"
  ) {
    console.warn("[stripe/webhook] payment failed/expired:", event.type);
    return NextResponse.json({ success: true, handled: event.type });
  }

  return NextResponse.json({ success: true, handled: event.type });
}
