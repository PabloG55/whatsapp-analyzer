import FileUpload from "@/components/FileUpload";
import { Ghost } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/ghost-logo.svg" alt="GhostChecker" className="w-16 h-16" />
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                GhostChecker
              </h1>
              <p className="text-sm text-muted-foreground">WhatsApp Chat Analyzer</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
            Analyze your WhatsApp conversations with detailed insights on message
            frequency, response times, and <strong className="text-foreground">detect ghosting patterns</strong>
          </p>
        </div>

        <FileUpload />
      </div>
    </div>
  );
}
