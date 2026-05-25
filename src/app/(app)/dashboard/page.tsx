import { headers, cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let userId: string | undefined;
  let method = "";
  let errorMsg = "";

  // Method 1: auth() — same as /trips page (which works)
  try {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
      method = "auth()";
    }
  } catch (e: any) {
    errorMsg += `auth() failed: ${e.message}. `;
  }

  // Method 2: getToken with headers cookie string
  if (!userId) {
    try {
      const h = await headers();
      const token = await getToken({
        req: { headers: { cookie: h.get("cookie") || "" } } as any,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token?.sub) {
        userId = token.sub;
        method = "getToken(headers)";
      }
    } catch (e: any) {
      errorMsg += `getToken(headers) failed: ${e.message}. `;
    }
  }

  // Method 3: getToken with cookies helper
  if (!userId) {
    try {
      const c = await cookies();
      const cookieHeader = c.getAll().map((ck) => `${ck.name}=${ck.value}`).join("; ");
      const token = await getToken({
        req: { headers: { cookie: cookieHeader } } as any,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (token?.sub) {
        userId = token.sub;
        method = "getToken(cookies)";
      }
    } catch (e: any) {
      errorMsg += `getToken(cookies) failed: ${e.message}. `;
    }
  }

  // If absolutely nothing works, show a diagnostic page instead of silently redirecting
  if (!userId) {
    return (
      <div className="min-h-screen bg-obsidian pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-ember font-serif text-2xl">Departure Lounge Unavailable</p>
          <p className="text-warm-white/50 mt-4">
            We couldn&apos;t verify your session on this page. Other pages work because they use a different auth path.
          </p>
          <div className="mt-8 p-6 bg-obsidian-light/30 rounded-xl border border-obsidian-muted/20 text-left">
            <p className="text-xs text-warm-white/30 font-mono mb-2">DEBUG:</p>
            <p className="text-xs text-warm-white/40 font-mono break-all">{errorMsg || "All methods returned null — no session token found."}</p>
          </div>
          <a
            href="/login"
            className="inline-block mt-8 px-8 py-3 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all"
          >
            Re-authenticate
          </a>
          <a
            href="/trips"
            className="inline-block mt-4 ml-4 px-8 py-3 text-sm font-medium text-warm-white border border-warm-white/20 rounded-full hover:border-warm-white/40 transition-all"
          >
            Try Manifest (works)
          </a>
        </div>
      </div>
    );
  }

  // Fetch dashboard data
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-obsidian pt-32 pb-24 text-center">
        <p className="text-warm-white/50">User not found in database (auth method: {method}).</p>
      </div>
    );
  }

  let couple = await db.couple.findFirst({
    where: {
      OR: [{ partner1Id: user.id }, { partner2Id: user.id }],
    },
    include: {
      partner1: { select: { id: true, name: true, email: true } },
      partner2: { select: { id: true, name: true, email: true } },
    },
  });

  if (couple && !couple.referralCode) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "SV";
    let hash = 0;
    for (let i = 0; i < couple.id.length; i++) {
      hash = (hash << 5) - hash + couple.id.charCodeAt(i);
      hash |= 0;
    }
    for (let i = 0; i < 5; i++) {
      code += chars[Math.abs(hash + i * 7) % chars.length];
    }
    await db.couple.update({
      where: { id: couple.id },
      data: { referralCode: code },
    });
    couple = await db.couple.findUnique({
      where: { id: couple.id },
      include: {
        partner1: { select: { id: true, name: true, email: true } },
        partner2: { select: { id: true, name: true, email: true } },
      },
    });
  }

  const buckets = await db.budgetBucket.findMany({
    where: couple ? { coupleId: couple.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      tier: { select: { name: true, slug: true } },
    },
  });

  const bookings = couple
    ? await db.booking.findMany({
        where: { coupleId: couple.id },
        orderBy: { createdAt: "desc" },
        include: {
          package: { select: { title: true, destination: true, image: true } },
          countdown: { select: { targetDate: true, message: true } },
          tier: { select: { name: true, slug: true } },
        },
        take: 3,
      })
    : [];

  return (
    <DashboardView
      user={user}
      couple={
        couple
          ? {
              id: couple.id,
              name: couple.name,
              partner2Name: couple.partner2?.name || null,
              partner2Initial: couple.partner2?.name?.[0] || null,
              invitationPending: !couple.partner2Id && !!couple.invitationToken,
              invitationExpires: couple.invitationExpires,
              referralCode: couple.referralCode,
              referralCredit: couple.referralCredit,
            }
          : null
      }
      buckets={buckets.map((b) => ({
        id: b.id,
        targetAmount: b.targetAmount,
        protectedTarget: b.protectedTarget,
        savedAmount: b.savedAmount,
        monthlyAmount: b.monthlyAmount,
        months: b.months,
        status: b.status,
        inflationBufferApplied: b.inflationBufferApplied,
        repricedAt: b.repricedAt,
        actualBookedPrice: b.actualBookedPrice,
        tier: b.tier,
      }))}
      bookings={bookings.map((bk) => ({
        id: bk.id,
        status: bk.status,
        totalPrice: bk.totalPrice,
        createdAt: bk.createdAt,
        package: bk.package,
        countdown: bk.countdown,
        tier: bk.tier,
      }))}
    />
  );
}
