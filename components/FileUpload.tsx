"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { parseWhatsAppFile } from "@/lib/parser";
import { aggregateMetrics } from "@/lib/metrics";

interface FileUploadProps {
  onUploadComplete?: (data: string) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.endsWith(".txt")) {
      return "Please upload a .txt file";
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File size exceeds 10MB limit";
    }

    return null;
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      // Read file
      const text = await file.text();
      setProgress(40);

      // Parse file (default: exclude media)
      const result = parseWhatsAppFile(text, false);
      setProgress(70);

      if (!result.success || !result.data) {
        setError(result.error || "Failed to parse file");
        setIsProcessing(false);
        return;
      }

      // Calculate metrics
      const monthYearStats = aggregateMetrics(result.data.messages);
      result.data.monthYearStats = monthYearStats;
      setProgress(90);

      // Store in localStorage
      localStorage.setItem("whatsapp-analytics", JSON.stringify(result.data));
      localStorage.setItem("whatsapp-file-content", text);
      setProgress(100);

      // Navigate to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (file) {
      processFile(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload WhatsApp Chat</CardTitle>
        <CardDescription>
          Upload a WhatsApp chat export file (.txt) to analyze conversation patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${file ? "bg-muted/50" : ""}
          `}
        >
          <input
            type="file"
            id="file-upload"
            accept=".txt"
            onChange={handleInputChange}
            className="hidden"
            disabled={isProcessing}
          />
          <Label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            {file ? (
              <>
                <FileText className="w-12 h-12 text-primary" />
                <div>
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse
                  </p>
                </div>
              </>
            )}
          </Label>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              {progress < 40 && "Reading file..."}
              {progress >= 40 && progress < 70 && "Parsing messages..."}
              {progress >= 70 && progress < 90 && "Calculating metrics..."}
              {progress >= 90 && "Almost done..."}
            </p>
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={!file || isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing..." : "Analyze Chat"}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1 pt-4">
          <p className="font-semibold">How to export WhatsApp chat:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Open the chat in WhatsApp</li>
            <li>Tap the three dots (⋮) → More → Export chat</li>
            <li>Select "Without Media"</li>
            <li>Upload the .txt file here</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
