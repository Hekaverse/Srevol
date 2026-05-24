import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Invalid invitation link" },
        { status: 400 }
      );
    }

    const couple = await db.couple.findFirst({
      where: {
        invitationToken: token,
        invitationExpires: { gt: new Date() },
      },
      include: {
        partner1: { select: { email: true, name: true } },
      },
    });

    if (!couple) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired invitation" },
        { status: 400 }
      );
    }

    const invitedEmail = couple.invitationEmail;
    if (!invitedEmail) {
      return NextResponse.json(
        { success: false, error: "Invitation email not found" },
        { status: 400 }
      );
    }

    // Check if the invited user already exists
    const existingUser = await db.user.findUnique({
      where: { email: invitedEmail },
    });

    if (existingUser) {
      // Link existing user as partner2
      await db.couple.update({
        where: { id: couple.id },
        data: {
          partner2Id: existingUser.id,
          invitationToken: null,
          invitationEmail: null,
          invitationExpires: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Invitation accepted! You are now linked.",
      });
    }

    // Create a placeholder user for the invited partner
    const placeholderPassword = await bcrypt.hash(
      crypto.randomBytes(32).toString("hex"),
      12
    );
    const placeholderUser = await db.user.create({
      data: {
        email: invitedEmail,
        name: null,
        password: placeholderPassword,
        role: "USER",
      },
    });

    await db.couple.update({
      where: { id: couple.id },
      data: {
        partner2Id: placeholderUser.id,
        invitationToken: null,
        invitationEmail: null,
        invitationExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Invitation accepted! Please complete your registration to set a password.",
      userId: placeholderUser.id,
    });
  } catch (err) {
    console.error("[couple/accept] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
