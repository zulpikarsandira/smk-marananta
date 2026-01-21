import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "MARANTAA | Portal Layanan Terpadu Pendidikan",
  description: "Portal layanan pendidikan terintegrasi dengan gaya Modern Minimalis. Akses PTSP, PPDB, Statistik, dan Alumni dalam satu pintu.",
};

import DesktopRedirector from "@/components/DesktopRedirector";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-white text-zinc-950 antialiased selection:bg-blue-600/10 selection:text-blue-600`}>
        <DesktopRedirector />
        <Navbar />
        <main className="min-h-screen pt-[88px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
