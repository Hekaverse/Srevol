import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import RouteIndex from "@/components/RouteIndex";
import RouteNetworkMap from "@/components/RouteNetworkMap";
import CTASection from "@/components/CTASection";
import ReferralCapture from "@/components/ReferralCapture";

export const metadata: Metadata = {
  title: "SREVOL — The Private Carrier for Two",
  description: "Reserve your route. Lock your fare. The private carrier experience built exclusively for two.",
};

export default function Home() {
  return (
    <>
      <Suspense>
        <ReferralCapture />
      </Suspense>
      <HeroSection />
      <PhilosophySection />
      <RouteIndex />
      <RouteNetworkMap />
      <CTASection />
    </>
  );
}
