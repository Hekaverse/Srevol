import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import CookieConsent from "@/components/CookieConsent";
import Toaster from "@/components/Toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SREVOL — For Lovers Who Travel",
  description: "The couples travel experience. Plan, save, and countdown to your perfect getaway together. Honeymoons, anniversaries, and romantic escapes made effortless.",
  keywords: ["couples travel", "honeymoon", "romantic getaway", "travel payment plans", "anniversary trips"],
  openGraph: {
    title: "SREVOL — For Lovers Who Travel",
    description: "Plan your perfect escape together. The couples-first travel experience.",
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
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-rich-brown font-sans">
        <Providers>
          {children}
          <CookieConsent />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
