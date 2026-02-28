import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zelvio — Preventivi in pochi minuti",
  description:
    "Crea preventivi chiari, professionali e pronti da inviare in pochi minuti. Zelvio semplifica il lavoro di tecnici e installatori con un flusso rapido e intuitivo.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://zelvioapp.com",
  },
  openGraph: {
    title: "Zelvio — Preventivi in pochi minuti",
    description:
      "Crea preventivi chiari e professionali in pochi minuti. Zelvio è lo strumento semplice e veloce per tecnici e installatori.",
    url: "https://zelvioapp.com",
    siteName: "Zelvio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zelvio — Preventivi in pochi minuti",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zelvio — Preventivi in pochi minuti",
    description:
      "Crea preventivi chiari e professionali in pochi minuti con Zelvio.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
          <Navbar />
        </div>

        <main className="overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}