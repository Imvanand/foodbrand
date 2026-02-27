import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kalsafoods.com'),
  title: {
    default: "Kalsa Foods | Inspired by Generations of Home Cooking",
    template: "%s | Kalsa Foods"
  },
  description: "Experience the authentic taste of India with Kalsa Foods Premium Indian Masala. Carefully sourced, finely ground, and hygienically packed, our spices bring rich aroma and bold flavor to every dish.",
  keywords: ["Indian Spices", "Organic Masala", "Kalsa Foods", "Authentic Indian Spices", "Healthy Spices", "Handmade Masala", "Spice Mix Masala"],
  authors: [{ name: "Kalsa Foods" }],
  creator: "Kalsa Foods",
  publisher: "Kalsa Foods",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kalsafoods.com",
    title: "Kalsa Foods | Inspired by Generations of Home Cooking",
    description: "Experience the authentic taste of India with Kalsa Foods Premium Indian Masala. Carefully sourced, finely ground, and hygienically packed.",
    siteName: "Kalsa Foods",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kalsa Foods - Premium Indian Masala",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalsa Foods | Premium Indian Masala",
    description: "Authentic taste of India with Kalsa Foods Premium Spices.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon/ta.png",
    shortcut: "/favicon/ta.png",
    apple: "/favicon/ta.png",
  },
};

import ChatWidget from "@/components/ChatWidget/ChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable}`}>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
