import { NextResponse } from "next/server";
import { apiRateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send internal notification
    if (env.RESEND_API_KEY) {
      await sendEmail({
        to: env.RESEND_FROM_EMAIL || "support@srevol.com",
        subject: `Contact Form: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #FAF7F2; background: #0C0C0C; padding: 32px; border-radius: 16px;">
            <h2 style="color: #C76B4A;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
