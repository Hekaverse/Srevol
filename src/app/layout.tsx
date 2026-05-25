import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import Toaster from "@/components/Toaster";
import CustomCursor from "@/components/CustomCursor";
import FilmGrain from "@/components/FilmGrain";
import LoadingScreen from "@/components/LoadingScreen";
import GenerativeSky from "@/components/GenerativeSky";
import WindowFrame from "@/components/WindowFrame";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SREVOL — The Private Carrier for Two",
  description: "Reserve your route. Lock your fare. The private carrier for two — from essential departures to transcendent routes.",
  keywords: ["private carrier", "couples carrier", "luxury carrier", "fare lock", "milestone departure", "celebration route", "romantic route"],
  openGraph: {
    title: "SREVOL — The Private Carrier for Two",
    description: "Reserve your route. Lock your fare. Let the anticipation carry you there.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-warm-white font-sans">
        <LoadingScreen />
        <GenerativeSky />
        <WindowFrame />
        <CustomCursor />
        <FilmGrain />
        <Providers>
          {children}
          <CookieConsent />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
