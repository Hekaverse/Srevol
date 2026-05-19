import { db } from "@/lib/db";
export async function queueAlert(data: {
  bucketId?: string;
  alertType: string;
  title: string;
  message: string;
  payload?: Record<string, unknown>;
  channel?: string;
  scheduledFor?: Date;
}) {
  return db.alertQueue.create({
    data: {
      bucketId: data.bucketId,
      alertType: data.alertType,
      title: data.title,
      message: data.message,
      payload: data.payload ? JSON.stringify(data.payload) : null,
      channel: data.channel || "IN_APP",
      scheduledFor: data.scheduledFor || new Date(),
      status: "PENDING",
    },
  });
}

export async function processPendingAlerts(limit: number = 50) {
  const alerts = await db.alertQueue.findMany({
    where: {
      status: "PENDING",
      scheduledFor: { lte: new Date() },
    },
    take: limit,
    orderBy: { scheduledFor: "asc" },
  });

  const results = [];

  for (const alert of alerts) {
    try {
      // Simulate sending (in production, this calls email/SMS/push services)
      await db.alertQueue.update({
        where: { id: alert.id },
        data: {
          status: "SENT",
          sentAt: new Date(),
        },
      });

      results.push({ id: alert.id, success: true });
    } catch (error) {
      await db.alertQueue.update({
        where: { id: alert.id },
        data: { status: "FAILED" },
      });

      results.push({
        id: alert.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown",
      });
    }
  }

  return results;
}

export async function getAlertsForBucket(bucketId: string) {
  return db.alertQueue.findMany({
    where: { bucketId },
    orderBy: { createdAt: "desc" },
  });
}

export async function checkBookingWindowAlerts() {
  const buckets = await db.budgetBucket.findMany({
    where: {
      status: "SAVING",
      bookingWindowOpens: { lte: new Date() },
    },
    include: { couple: true, tier: true },
  });

  for (const bucket of buckets) {
    // Update status
    await db.budgetBucket.update({
      where: { id: bucket.id },
      data: { status: "READY_TO_BOOK" },
    });

    // Queue alert
    await queueAlert({
      bucketId: bucket.id,
      alertType: "BOOKING_WINDOW_OPENED",
      title: "It's time to book!",
      message: `Your booking window is now open. You've saved ${(bucket.savedAmount / 100).toFixed(0)} toward your ${bucket.tier?.name || "trip"}. Ready to make it real?`,
      channel: "IN_APP",
    });
  }

  return buckets.length;
}
