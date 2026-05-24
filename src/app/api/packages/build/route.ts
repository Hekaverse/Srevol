import { NextResponse } from "next/server";
import { assemblePackage } from "@/lib/services/package-builder/assembler";
import { buildPackageSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = buildPackageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { destination, duration, budgetMax } = parsed.data;

    const assembled = await assemblePackage({
      destination,
      duration,
      budgetMax,
    });

    if (!assembled) {
      return NextResponse.json(
        { success: false, error: "Could not assemble package for this destination" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      package: assembled,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to build package" },
      { status: 500 }
    );
  }
}
