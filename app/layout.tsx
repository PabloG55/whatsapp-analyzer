import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Free WhatsApp Chat Analyzer - 100% Private & Client-Side",
  description: "Analyze your WhatsApp conversations with detailed statistics. Everything happens in your browser - we never see your data. No uploads, no servers, 100% private.",
  keywords: ["whatsapp analyzer", "private chat analysis", "client-side message statistics", "whatsapp insights", "chat statistics"],
  authors: [{ name: "WhatsApp Analyzer" }],
  openGraph: {
    title: "Free WhatsApp Chat Analyzer - 100% Private & Client-Side",
    description: "Analyze your WhatsApp conversations with detailed statistics. Everything happens in your browser - we never see your data.",
    type: "website",
    locale: "en_US",
    siteName: "WhatsApp Chat Analyzer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WhatsApp Chat Analyzer - 100% Private & Client-Side",
    description: "Analyze your WhatsApp conversations with detailed statistics. Everything happens in your browser - we never see your data.",
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
              "name": "WhatsApp Chat Analyzer",
              "url": "https://yourdomain.com",
              "description": "Free, privacy-focused WhatsApp chat analysis tool. All processing happens client-side in your browser.",
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
      </body>
    </html>
  );
}
