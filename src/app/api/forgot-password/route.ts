import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authRateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail } from "@/lib/email";
import { env } from "@/lib/env";
import crypto from "crypto";

export async function POST(request: Request) {
  // Rate limit: 5 requests per 15 minutes per IP
  const limit = await authRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success even if user not found (security)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If a profile exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires,
      },
    });

    const resetUrl = `${env.NEXTAUTH_URL}/reset-password?token=${token}`;
    const emailResult = await sendPasswordResetEmail(user.email, resetUrl);

    if (!emailResult.success) {
      console.error("[forgot-password] Email failed:", emailResult.error);
      // Don't expose email failure to user
    }

    return NextResponse.json({
      success: true,
      message: "If a profile exists, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
