import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const text = await request.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON", raw: text.slice(0, 200) },
        { status: 400 }
      );
    }
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, partnerEmail } = parsed.data;

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and couple in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: "USER",
        },
      });

      // Create a placeholder partner user if partnerEmail provided
      let partner = null;
      if (partnerEmail && partnerEmail !== email) {
        partner = await tx.user.create({
          data: {
            email: partnerEmail,
            name: null,
            password: null,
            role: "USER",
          },
        });
      }

      // Create couple
      const couple = await tx.couple.create({
        data: {
          name: `${name} & Partner`,
          partner1Id: user.id,
          partner2Id: partner?.id || user.id,
        },
      });

      return { user, couple };
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: result.user.id,
        coupleId: result.couple.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
