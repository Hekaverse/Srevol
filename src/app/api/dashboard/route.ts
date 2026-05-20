import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const couple = await db.couple.findFirst({
      where: {
        OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
      },
    });

    const buckets = couple
      ? await db.budgetBucket.findMany({
          where: { coupleId: couple.id },
          include: { tier: true },
          orderBy: { createdAt: "desc" },
        })
      : [];

    return NextResponse.json({
      success: true,
      user: session.user,
      couple,
      buckets,
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
