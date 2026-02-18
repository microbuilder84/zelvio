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

export const metadata: Metadata = {
  title: "Zelvio",
  description: "Il preventivatore più veloce e intuitivo",
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
        <main className="overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
