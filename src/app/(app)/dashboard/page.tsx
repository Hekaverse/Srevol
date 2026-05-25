import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Use the same JWT verification as middleware — this is reliable on Vercel.
  // auth() from NextAuth v5 server components is flaky in production.
  const cookieStore = await cookies();
  const token = await getToken({
    req: { headers: { cookie: cookieStore.toString() } } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.sub) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: token.sub },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    redirect("/login");
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

  // Ensure referral code exists
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
