import CustomCursor from "@/components/CustomCursor";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Horcrux // Amaan",
  description: "Software Engineer. Architecting production-grade systems, low-latency pipelines, and high-performance interfaces.",
  icons: {
    icon: "/favicon.ico",
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#080808] text-[#f0ede8] selection:bg-white/10 selection:text-white"
        suppressHydrationWarning
      >
        {/* Grain */}
        <div className="noise-overlay" />

        {/* Single ambient haze — neutral, barely-there */}
        <div className="aurora-container">
          <div className="aurora-blob aurora-1" />
          <div className="aurora-blob aurora-2" />
        </div>

        <CustomCursor />
        {children}
      </body>
    </html>
  );
}