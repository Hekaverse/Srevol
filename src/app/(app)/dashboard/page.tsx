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

  const data = await getDashboardData();
  if (!data) {
    redirect("/login");
  }

  return (
    <DashboardView
      user={data.user}
      couple={data.couple}
      buckets={data.buckets}
      bookings={data.bookings}
    />
  );
}
