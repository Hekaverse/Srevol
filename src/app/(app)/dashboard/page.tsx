import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Always render the dashboard for authenticated users.
  // If data fetching fails, show empty state — never bounce them to login.
  let data;
  try {
    data = await getDashboardData();
  } catch {
    data = null;
  }

  return (
    <DashboardView
      user={
        data?.user ?? {
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.name ?? null,
          role: (session.user as any).role ?? "USER",
        }
      }
      couple={data?.couple ?? null}
      buckets={data?.buckets ?? []}
      bookings={data?.bookings ?? []}
    />
  );
}
