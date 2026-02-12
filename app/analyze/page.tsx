import FileUpload from "@/components/FileUpload";
import { MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              WhatsApp Chat Analyzer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Analyze your WhatsApp conversations with detailed insights on message
            frequency, response times, and activity patterns
          </p>
        </div>

        <FileUpload />
      </div>
    </div>
  );
}
