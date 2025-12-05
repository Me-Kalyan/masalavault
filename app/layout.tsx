import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MasalaVault - Your Spice Vault, Your Recipes",
    template: "%s | MasalaVault",
  },
  description: "MasalaVault - Your comprehensive Indian cooking companion. Organize your pantry, discover recipes, and master Indian cuisine. Over 100+ authentic Indian recipes with intelligent ingredient matching.",
  keywords: ["Indian recipes", "cooking", "pantry management", "recipe finder", "Indian cuisine", "masala", "spices", "cooking companion"],
  authors: [{ name: "MasalaVault" }],
  creator: "MasalaVault",
  publisher: "MasalaVault",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://masalavault.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "MasalaVault",
    title: "MasalaVault - Your Spice Vault, Your Recipes",
    description: "Your comprehensive Indian cooking companion. Organize your pantry, discover recipes, and master Indian cuisine.",
    images: [
      {
        url: "/icon.svg", // Using icon.svg as fallback until og-image.png is created
        width: 1200,
        height: 630,
        alt: "MasalaVault - Indian Cooking Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MasalaVault - Your Spice Vault, Your Recipes",
    description: "Your comprehensive Indian cooking companion. Organize your pantry, discover recipes, and master Indian cuisine.",
    images: ["/icon.svg"], // Using icon.svg as fallback until og-image.png is created
    creator: "@masalavault",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MasalaVault",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
