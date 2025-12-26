import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "Scanalign Media",
  description: "Browse, filter, and share your media library from a fast, responsive gallery.",
  openGraph: {
    title: "Scanalign Media",
    description: "Browse, filter, and share your media library from a fast, responsive gallery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scanalign Media",
    description: "Browse, filter, and share your media library from a fast, responsive gallery.",
  },
  icons: {
    icon: "/Media/J.png",
    shortcut: "/Media/J.png",
    apple: "/Media/J.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-black text-gray-100 antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
