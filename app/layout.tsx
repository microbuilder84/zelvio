import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ⭐ Import della Navbar
import Navbar from "./components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ⭐ Metadata completo e definitivo
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
    canonical: "https://zelvio.com",
  },
  openGraph: {
    title: "Zelvio — Preventivi in pochi minuti",
    description:
      "Crea preventivi chiari e professionali in pochi minuti. Zelvio è lo strumento semplice e veloce per tecnici e installatori.",
    url: "https://zelvio.com",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {/* ⭐ Navbar sticky premium */}
        <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
          <Navbar />
        </div>

        {/* ⭐ Contenuto della pagina */}
        <main className="overflow-x-hidden">{children}</main>
      </body>
    </html>
  );
}