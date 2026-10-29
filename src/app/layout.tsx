
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | PixelKit Tools",
    default: "PixelKit Tools - Free Client-Side Image Utilities",
  },
  description:
    "Compress, resize, and convert images directly in your browser. Fast, private, and 100% client-side with zero server uploads.",
  keywords: [
    "image compressor",
    "image resizer",
    "image converter",
    "webp to jpeg",
    "png to jpeg",
    "browser image tools",
    "client-side image optimization",
  ],
  authors: [{ name: "PixelKit Tools" }],
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "23Rz3lsgw6tZKtWTFhUGdEDi8d2pCQanTTaqpHhr6y0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
