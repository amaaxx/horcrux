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
    icon: "/favicon.ico", // Ensure you have a favicon or remove this line
  },
};

export default function RootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body 
  className="bg-background text-white selection:bg-accent/30 selection:text-accent"
  suppressHydrationWarning
>
  {children}
</body>
    </html>
  );
}