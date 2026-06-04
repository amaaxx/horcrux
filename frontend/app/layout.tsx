import CustomCursor from "@/components/CustomCursor";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Horcrux // Amaan",
  description: "Digital artifacts and complex systems. A high-performance portfolio engine designed by Amaan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="bg-[#05050a] text-neutral-200 selection:bg-accent/25 selection:text-white" suppressHydrationWarning>
        
        {/* Global Noise Overlay & fixed background auroras promoted to GPU layer */}
        <div className="noise-overlay" />
        
        <div className="aurora-container">
          <div className="aurora-blob aurora-1" />
          <div className="aurora-blob aurora-2" />
          <div className="aurora-blob aurora-3" />
        </div>

        <CustomCursor />
        {children}
      </body>
    </html>
  );
}