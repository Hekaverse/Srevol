import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncPrices } from "@/lib/services/price-intelligence/sync";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const results = await syncPrices();

    return NextResponse.json({
      success: true,
      destinations: results.length,
      productsFetched: results.reduce((s, r) => s + r.productsFetched, 0),
      productsUpdated: results.reduce((s, r) => s + r.productsUpdated, 0),
    });
  } catch (error) {
    console.error("Price sync error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
