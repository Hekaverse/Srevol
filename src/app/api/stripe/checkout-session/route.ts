import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStripeInstance } from "@/lib/stripe";
import { env } from "@/lib/env";
import { apiRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { packageTemplateId, months, totalAmount } = body;

    if (!packageTemplateId || typeof months !== "number" || !totalAmount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user has a couple
    const couple = await db.couple.findFirst({
      where: {
        OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
      },
    });

    if (!couple) {
      return NextResponse.json(
        { success: false, error: "Register a traveling party first" },
        { status: 400 }
      );
    }

    // Fetch package template
    const template = await db.packageTemplate.findUnique({
      where: { id: packageTemplateId },
      include: { tier: true },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const stripe = getStripeInstance();
    const monthlyAmount = Math.ceil(totalAmount / months);
    const inflationBuffer = template.tier?.inflationBuffer || 0.15;
    const protectedAmount = Math.round(totalAmount * (1 + inflationBuffer));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${template.title} — First Payment`,
              description: `${template.destination} · ${template.duration} days · ${months}-month plan`,
              images: template.image ? [template.image] : undefined,
            },
            unit_amount: monthlyAmount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
      metadata: {
        userId: session.user.id,
        coupleId: couple.id,
        packageTemplateId: template.id,
        packageTitle: template.title,
        destination: template.destination,
        duration: String(template.duration),
        months: String(months),
        monthlyAmount: String(monthlyAmount),
        totalAmount: String(totalAmount),
        protectedAmount: String(protectedAmount),
        inflationBuffer: String(inflationBuffer),
      },
      success_url: `${env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXTAUTH_URL}/checkout/cancel`,
      customer_email: session.user.email || undefined,
    });

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("[stripe/checkout-session] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
