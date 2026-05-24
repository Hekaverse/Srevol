import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { processPendingAlerts, checkBookingWindowAlerts } from "@/lib/services/alerts/queue";

const alertsSchema = z.object({
  action: z.enum(["process", "check-windows"]).default("process"),
  limit: z.coerce.number().min(1).max(200).optional().default(50),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = alertsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { action, limit } = parsed.data;

    if (action === "process") {
      const results = await processPendingAlerts(limit);
      return NextResponse.json({ success: true, processed: results.length, results });
    }

    if (action === "check-windows") {
      const count = await checkBookingWindowAlerts();
      return NextResponse.json({ success: true, bucketsReady: count });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Alert processing failed" },
      { status: 500 }
    );
  }
}
