import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

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

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, referralCode: incomingRef } = body;

    // Check if user already has a couple
    const existing = await db.couple.findFirst({
      where: { partner1Id: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "You already have a traveling party" },
        { status: 409 }
      );
    }

    // Check referral code
    let referredByCoupleId: string | undefined;
    let initialCredit = 0;
    if (incomingRef) {
      const cleanRef = incomingRef.toUpperCase().trim();
      const referrer = await db.couple.findUnique({
        where: { referralCode: cleanRef },
      });
      if (referrer) {
        referredByCoupleId = referrer.id;
        // Give BOTH parties $50 credit
        await db.couple.update({
          where: { id: referrer.id },
          data: { referralCredit: { increment: 5000 } }, // $50 in cents
        });
        initialCredit = 5000; // New couple also gets $50
      }
    }

    const couple = await db.couple.create({
      data: {
        partner1Id: session.user.id,
        name: name || null,
        referralCode: "PENDING", // placeholder, will update
        referredByCoupleId,
        referralCredit: initialCredit,
      },
    });

    // Generate real referral code
    const referralCode = generateReferralCode(couple.id);
    await db.couple.update({
      where: { id: couple.id },
      data: { referralCode },
    });

    return NextResponse.json({
      success: true,
      couple: { ...couple, referralCode },
    });
  } catch (err) {
    console.error("[couple/create] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create couple" },
      { status: 500 }
    );
  }
}

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
        partner1: { select: { id: true, name: true, email: true } },
        partner2: { select: { id: true, name: true, email: true } },
      },
    });

    // Ensure referral code exists
    if (couple && !couple.referralCode) {
      const code = generateReferralCode(couple.id);
      await db.couple.update({
        where: { id: couple.id },
        data: { referralCode: code },
      });
      couple.referralCode = code;
    }

    return NextResponse.json({ success: true, couple });
  } catch (err) {
    console.error("[couple/get] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch couple" },
      { status: 500 }
    );
  }
}
