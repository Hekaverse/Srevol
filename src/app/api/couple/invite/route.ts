import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendPartnerInvitationEmail } from "@/lib/email";
import { env } from "@/lib/env";
import crypto from "crypto";

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
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Partner email is required" },
        { status: 400 }
      );
    }

    const couple = await db.couple.findFirst({
      where: { partner1Id: session.user.id },
    });

    if (!couple) {
      return NextResponse.json(
        { success: false, error: "Register a traveling party first" },
        { status: 400 }
      );
    }

    if (couple.partner2Id) {
      return NextResponse.json(
        { success: false, error: "You already have a partner" },
        { status: 409 }
      );
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await db.couple.update({
      where: { id: couple.id },
      data: {
        invitationToken: token,
        invitationEmail: email.toLowerCase(),
        invitationExpires: expires,
      },
    });

    const acceptUrl = `${env.NEXTAUTH_URL}/couple/accept?token=${token}`;
    const inviterName = session.user.name || "Your partner";

    const emailResult = await sendPartnerInvitationEmail(
      email,
      inviterName,
      acceptUrl
    );

    if (!emailResult.success) {
      console.error("[couple/invite] Email failed:", emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent",
    });
  } catch (err) {
    console.error("[couple/invite] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
