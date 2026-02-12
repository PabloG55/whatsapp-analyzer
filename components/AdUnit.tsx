/**
 * AdUnit Component - Google AdSense Placeholder
 * 
 * This component is ready for Google AdSense integration.
 * To activate:
 * 1. Get approved for Google AdSense
 * 2. Add your AdSense publisher ID to the script in app/layout.tsx
 * 3. Replace the placeholder content below with actual ad units
 */

"use client";

import { useEffect } from "react";

interface AdUnitProps {
  slot?: string; // AdSense ad slot ID
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  className?: string;
}

export default function AdUnit({
  slot = "XXXXXX", // Replace with your ad slot ID
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  useEffect(() => {
    try {
      // Push ads once approved and script loaded
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === "production") {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // Development/staging placeholder
  if (process.env.NODE_ENV !== "production") {
    return (
      <div className={`border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800 ${className}`}>
        <p className="text-sm text-muted-foreground">📢 Ad Placeholder</p>
        <p className="text-xs text-muted-foreground mt-1">
          Google AdSense will appear here in production
        </p>
      </div>
    );
  }

  // Production AdSense code (commented out until approved)
  return (
    <div className={className}>
      {/* 
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Your publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
      */}
      {/* Placeholder until AdSense approved */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800">
        <p className="text-sm text-muted-foreground">📢 Ad Space</p>
        <p className="text-xs text-muted-foreground mt-1">
          Awaiting AdSense approval
        </p>
      </div>
    </div>
  );
}
