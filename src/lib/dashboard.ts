import { db } from "./db";
import { auth } from "./auth";

export interface DashboardData {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
  couple: {
    id: string;
    name: string | null;
    partner2Name: string | null;
    partner2Initial: string | null;
    invitationPending: boolean;
    invitationExpires: Date | null;
    referralCode: string | null;
    referralCredit: number;
  } | null;
  buckets: Array<{
    id: string;
    targetAmount: number;
    protectedTarget: number;
    savedAmount: number;
    monthlyAmount: number;
    months: number;
    status: string;
    inflationBufferApplied: number;
    repricedAt: Date | null;
    actualBookedPrice: number | null;
    tier: { name: string; slug: string };
  }>;
  bookings: Array<{
    id: string;
    status: string;
    totalPrice: number;
    createdAt: Date;
    package: { title: string | null; destination: string | null; image: string | null } | null;
    countdown: { targetDate: Date; message: string | null } | null;
    tier: { name: string; slug: string } | null;
  }>;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return null;

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

  return {
    user,
    couple: couple
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
      : null,
    buckets: buckets.map((b) => ({
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
    })),
    bookings: bookings.map((bk) => ({
      id: bk.id,
      status: bk.status,
      totalPrice: bk.totalPrice,
      createdAt: bk.createdAt,
      package: bk.package,
      countdown: bk.countdown,
      tier: bk.tier,
    })),
  };
}
