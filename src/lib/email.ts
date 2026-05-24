import { Resend } from "resend";
import { env } from "./env";

/**
 * Resend email client.
 * Falls back to console logging in development if RESEND_API_KEY is not set.
 */
const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

const fromEmail = env.RESEND_FROM_EMAIL || "noreply@srevol.com";

export interface SendResult {
  success: boolean;
  id?: string;
  error?: string;
}

/* ─── Password Reset ─── */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<SendResult> {
  const subject = "Reset your SREVOL access credentials";
  const html = `
    <div style="max-width: 480px; margin: 0 auto; font-family: Georgia, serif; color: #FAF7F2; background: #0C0C0C; padding: 48px 32px; border-radius: 16px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #C76B4A;">SREVOL</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #FAF7F2;">You requested a password reset. Click the button below to choose a new password.</p>
      <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #C76B4A; color: #0C0C0C; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px;">Reset Password</a>
      <p style="font-size: 13px; color: #8A827A; line-height: 1.5;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #8A827A;">SREVOL — The Private Carrier for Two.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/* ─── Partner Invitation ─── */
export async function sendPartnerInvitationEmail(
  to: string,
  inviterName: string,
  acceptUrl: string
): Promise<SendResult> {
  const subject = `${inviterName} invited you to fly together on SREVOL`;
  const html = `
    <div style="max-width: 480px; margin: 0 auto; font-family: Georgia, serif; color: #FAF7F2; background: #0C0C0C; padding: 48px 32px; border-radius: 16px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #C76B4A;">SREVOL</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #FAF7F2;"><strong>${inviterName}</strong> invited you to join them on SREVOL — a private carrier experience built for two.</p>
      <a href="${acceptUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #C76B4A; color: #0C0C0C; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px;">Accept Invitation</a>
      <p style="font-size: 13px; color: #8A827A; line-height: 1.5;">This invitation expires in 7 days. If you don't have a profile yet, you'll be prompted to create one.</p>
      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #8A827A;">SREVOL — The Private Carrier for Two.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/* ─── Payment Reminder ─── */
export async function sendPaymentReminderEmail(
  to: string,
  amount: string,
  dueDate: string
): Promise<SendResult> {
  const subject = "Your SREVOL holding contribution is due soon";
  const html = `
    <div style="max-width: 480px; margin: 0 auto; font-family: Georgia, serif; color: #FAF7F2; background: #0C0C0C; padding: 48px 32px; border-radius: 16px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #C76B4A;">SREVOL</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #FAF7F2;">Your monthly holding contribution of <strong>${amount}</strong> is due on <strong>${dueDate}</strong>.</p>
      <a href="${env.NEXTAUTH_URL}/dashboard" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #C76B4A; color: #0C0C0C; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px;">Enter Departure Lounge</a>
      <p style="font-size: 13px; color: #8A827A; line-height: 1.5;">Thank you for securing your departure. Every contribution brings you closer.</p>
      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #8A827A;">SREVOL — The Private Carrier for Two.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/* ─── Booking Confirmation ─── */
export async function sendBookingConfirmationEmail(
  to: string,
  destination: string,
  travelDate: string
): Promise<SendResult> {
  const subject = `Your ${destination} reservation is confirmed`;
  const html = `
    <div style="max-width: 480px; margin: 0 auto; font-family: Georgia, serif; color: #FAF7F2; background: #0C0C0C; padding: 48px 32px; border-radius: 16px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #C76B4A;">SREVOL</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #FAF7F2;">Congratulations — your reservation to <strong>${destination}</strong> on <strong>${travelDate}</strong> is confirmed.</p>
      <a href="${env.NEXTAUTH_URL}/dashboard" style="display: inline-block; margin: 24px 0; padding: 14px 28px; background: #C76B4A; color: #0C0C0C; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px;">View Itinerary</a>
      <p style="font-size: 13px; color: #8A827A; line-height: 1.5;">We'll send you curated prompts and departure milestones as your departure approaches.</p>
      <hr style="border: none; border-top: 1px solid #252525; margin: 32px 0;" />
      <p style="font-size: 12px; color: #8A827A;">SREVOL — The Private Carrier for Two.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/* ─── Low-level send ─── */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set. Would have sent email to ${to} with subject "${subject}"`
    );
    return { success: true, id: "dev-mock-id" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `SREVOL <${fromEmail}>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`[email] Sent to ${to}: ${subject} (${data?.id})`);
    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] Exception:", message);
    return { success: false, error: message };
  }
}
