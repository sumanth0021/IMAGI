import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import PWARegister from "@/components/PWARegister";
import RouteLoadingOverlay from "@/components/RouteLoadingOverlay";
import DatabaseStatusClientShell from "@/components/DatabaseStatusClientShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IMAGI",
  description: "A premium space for storytellers and filmmakers",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DatabaseStatusClientShell>
          <PWARegister />
          <Suspense fallback={null}>
            <RouteLoadingOverlay />
          </Suspense>
          {children}
          <PWAInstallPrompt />
        </DatabaseStatusClientShell>
      </body>
    </html>
  );
}
