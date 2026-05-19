import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      env: process.env.NODE_ENV || "development",
      checks: {
        database: "ok",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "0.1.0",
        env: process.env.NODE_ENV || "development",
        checks: {
          database: "error",
        },
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 503 }
    );
  }
}
