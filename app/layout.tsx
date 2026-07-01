import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PhytoScan AI — Sistem Identifikasi Kesehatan Tanaman",
  description:
    "Deteksi penyakit daun tanaman secara instan menggunakan kecerdasan buatan berbasis analisis citra visual.",
  keywords: [
    "identifikasi penyakit tanaman",
    "deteksi penyakit daun",
    "pengolahan citra digital",
    "AI pertanian",
    "plant disease detection",
  ],
  authors: [{ name: "PCD Lab" }],
  openGraph: {
    title: "PhytoScan AI — Identifikasi Penyakit Daun",
    description:
      "Deteksi penyakit daun tanaman dengan AI Gemini Vision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
