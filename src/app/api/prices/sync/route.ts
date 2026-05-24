import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminRateLimit } from "@/lib/rate-limit";
import { syncPrices } from "@/lib/services/price-intelligence/sync";

export async function POST(request: Request) {
  try {
    const limit = await adminRateLimit(request);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

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
  } catch {
    return NextResponse.json(
      { success: false, error: "Price sync failed" },
      { status: 500 }
    );
  }
}
