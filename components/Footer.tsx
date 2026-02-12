import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/ghost-logo.svg" alt="GhostChecker" className="w-8 h-8" />
              <h3 className="font-bold text-lg">GhostChecker</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              WhatsApp chat analyzer with ghosting detection. 100% private - your data never leaves your device.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/analyze" className="hover:text-foreground transition-colors">
                  Analyze Chat
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog/how-to-export-whatsapp-chat" className="hover:text-foreground transition-colors">
                  How to Export Chat
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-foreground transition-colors">
                  Privacy & Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GhostChecker. All rights reserved.</p>
          <p className="mt-2">Not affiliated with WhatsApp or Meta Platforms, Inc.</p>
        </div>
      </div>
    </footer>
  );
}
