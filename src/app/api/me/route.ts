import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        coupleAsPartner1: { include: { partner2: true } },
        coupleAsPartner2: { include: { partner1: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const couple = user.coupleAsPartner1 || user.coupleAsPartner2;
    const partner = user.coupleAsPartner1?.partner2 || user.coupleAsPartner2?.partner1;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      couple: couple
        ? {
            id: couple.id,
            name: couple.name,
            partner: partner
              ? { id: partner.id, name: partner.name, email: partner.email }
              : null,
          }
        : null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await db.$transaction(async (tx) => {
      // Delete related data first
      const couple = await tx.couple.findFirst({
        where: {
          OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
        },
      });

      if (couple) {
        await tx.budgetBucket.deleteMany({ where: { coupleId: couple.id } });
        await tx.booking.deleteMany({ where: { coupleId: couple.id } });
        await tx.countdown.deleteMany({ where: { coupleId: couple.id } });
        await tx.couple.delete({ where: { id: couple.id } });
      }

      await tx.user.delete({ where: { id: session.user.id } });
    });

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
