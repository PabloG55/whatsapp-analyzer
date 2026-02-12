import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
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

export const metadata: Metadata = {
  title: "GhostChecker - Free WhatsApp Chat Analyzer & Ghosting Detector",
  description: "Analyze WhatsApp conversations and detect if you're being ghosted. Track message frequency, response times, and conversation gaps. 100% private, client-side analysis.",
  keywords: ["ghostchecker", "ghosting detector", "am I being ghosted", "whatsapp analyzer", "private chat analysis", "conversation insights"],
  authors: [{ name: "GhostChecker" }],
  openGraph: {
    title: "GhostChecker - Detect Ghosting in Your WhatsApp Chats",
    description: "Are you being ghosted? Analyze WhatsApp conversations and get instant ghosting probability scores. 100% private - everything happens in your browser.",
    type: "website",
    locale: "en_US",
    siteName: "GhostChecker",
  },
  twitter: {
    card: "summary_large_image",
    title: "GhostChecker - WhatsApp Ghosting Detector",
    description: "Analyze WhatsApp conversations and detect if you're being ghosted. 100% private, client-side analysis.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Schema Markup for WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "GhostChecker",
              "url": "https://yourdomain.com",
              "description": "Free ghosting detection and WhatsApp chat analysis tool. Detect if you're being ghosted with AI-powered probability scoring. All processing happens client-side.",
              "applicationCategory": "UtilityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "browserRequirements": "Requires JavaScript. Works on all modern browsers.",
              "permissions": "No permissions required. Client-side only."
            })
          }}
        />
        
        {/* Google Analytics 4 - REPLACE WITH YOUR MEASUREMENT ID */}
        {/* Uncomment when ready to track:
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        */}
        
        {/* Google AdSense - REPLACE WITH YOUR PUBLISHER ID */}
        {/* Uncomment after AdSense approval:
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        
        {/* Google Analytics - Modern Next.js integration */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
