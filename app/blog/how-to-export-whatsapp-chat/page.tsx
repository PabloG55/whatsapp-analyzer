'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Footer from '@/components/Footer'
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle2,
  Shield,
  FileText,
  MessageCircle,
  Download,
  Share2,
  Settings,
  Search,
  Lock,
  Eye,
  HelpCircle,
  Smartphone,
  ExternalLink,
} from 'lucide-react'

export default function ExportWhatsAppChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Article Title and Meta */}
        <article className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="bg-blue-600">Guide</Badge>
              <Badge variant="secondary">How-To</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              How to Export Your WhatsApp Chat for Analysis (2026 Guide)
            </h1>
            <p className="text-xl text-slate-600">
              Learn how to safely export your WhatsApp conversations and prepare them for detailed analysis. Step-by-step instructions for both iPhone and Android devices.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-t pt-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>8 min read</span>
              </div>
              <span>•</span>
              <span>Updated January 2026</span>
            </div>
          </div>

          {/* Introduction Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Introduction: Unlock Insights From Your Chats</h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              WhatsApp conversations contain valuable insights about your communication patterns, word frequency, sentiment, and interaction trends. Whether you're curious about your personal messaging habits or analyzing group dynamics, exporting your chats is the first step toward data-driven insights.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              This comprehensive guide walks you through the entire process of exporting WhatsApp conversations from both iOS and Android devices. We've included detailed screenshots and instructions to ensure you can complete this process regardless of your technical experience level.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              By the end of this guide, you'll have your chat data ready for analysis, visualization, and discovery. Let's get started!
            </p>
          </section>

          {/* Privacy and Security Notice */}
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Privacy Assurance:</strong> Your chat data remains completely private and under your control. WhatsApp Analyzer processes your data locally on your device—we never store, transmit, or access your personal messages. You have full control over what data you analyze.
            </AlertDescription>
          </Alert>

          {/* What You'll Get Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">What You'll Get After Exporting</h2>
            <p className="text-slate-700">
              Once you export your WhatsApp chat, you'll have access to:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: MessageCircle, text: 'Complete message history with timestamps' },
                { icon: FileText, text: 'Participant information and message metadata' },
                { icon: Eye, text: 'Message frequencies and response patterns' },
                { icon: Search, text: 'Searchable text for detailed analysis' },
                { icon: Lock, text: 'Full privacy control - data stays with you' },
                { icon: CheckCircle2, text: 'Ready-to-analyze format for WhatsApp Analyzer' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors">
                  <item.icon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <p className="text-sm text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* iPhone Instructions */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Export WhatsApp Chat on iPhone</h2>
              <Badge variant="outline">iOS 14+</Badge>
            </div>
            <p className="text-slate-700">
              Follow these detailed steps to export your WhatsApp conversations on an iPhone:
            </p>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Open WhatsApp and Select Your Chat',
                  description: 'Launch the WhatsApp application on your iPhone. Navigate to the "Chats" tab and scroll to find the conversation you want to export. You can export individual chats or group conversations.',
                  details: [
                    'Tap the WhatsApp app icon on your home screen',
                    'Make sure you\'re on the "Chats" tab (appears as a chat bubble icon)',
                    'Find the conversation you want to analyze',
                    'Keep this chat in mind for the next step',
                  ],
                },
                {
                  step: 2,
                  title: 'Access Chat Options',
                  description: 'Locate and tap the chat to select it. You\'ll now access the options menu where export settings are available.',
                  details: [
                    'Press and hold on the chat name (or swipe left on the chat)',
                    'A menu will appear with several options',
                    'Look for "More Options" or tap the three dots (...) menu icon',
                    'Select the option to access full chat controls',
                  ],
                },
                {
                  step: 3,
                  title: 'Select Export Option',
                  description: 'In the options menu, find and tap "Export Chat". You\'ll be presented with choices about whether to include media files or export text only.',
                  details: [
                    'Tap on "Export Chat" from the menu',
                    'Choose "Without Media" for faster export and smaller file size (recommended for analysis)',
                    'Or choose "With Media" if you want to include photos and videos (larger file size)',
                    'For analysis purposes, "Without Media" is typically sufficient',
                  ],
                },
                {
                  step: 4,
                  title: 'Choose Export Destination',
                  description: 'Select where you want to save the exported file. You can send it via email, save to Files app, cloud storage, or another app.',
                  details: [
                    'Tap "Mail" to send to your email address',
                    'Or tap "Save to Files" to save directly to your device',
                    'You can also choose cloud storage like iCloud Drive, Google Drive, or Dropbox',
                    'Select the destination and follow the app-specific instructions',
                  ],
                },
                {
                  step: 5,
                  title: 'Complete Export and Download',
                  description: 'Confirm the export and navigate to where you saved the file. The exported chat will be in .txt format, ready for analysis.',
                  details: [
                    'Confirm your selection and wait for the export to complete',
                    'You\'ll receive a confirmation message',
                    'Navigate to where you saved the file (Mail inbox, Files app, or cloud storage)',
                    'Download the .txt file to your computer to begin analysis',
                  ],
                },
              ].map((item) => (
                <Card key={item.step} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-600">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Pro Tip:</strong> Export "Without Media" for a faster process and smaller file size. Media files can be exported separately if needed.
              </AlertDescription>
            </Alert>
          </section>

          {/* Android Instructions */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Export WhatsApp Chat on Android</h2>
              <Badge variant="outline">Android 6+</Badge>
            </div>
            <p className="text-slate-700">
              Follow these detailed steps to export your WhatsApp conversations on an Android device:
            </p>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Open WhatsApp and Find Your Chat',
                  description: 'Launch WhatsApp and navigate to the Chats tab. Locate the conversation you want to export and have it ready.',
                  details: [
                    'Tap the WhatsApp app icon to launch it',
                    'Ensure you\'re viewing the Chats tab (default view)',
                    'Scroll through your conversations to find the one you want to export',
                    'The chat should be clearly visible before proceeding',
                  ],
                },
                {
                  step: 2,
                  title: 'Long Press to Open Chat Menu',
                  description: 'Press and hold the chat conversation. A context menu will appear with various options including export functionality.',
                  details: [
                    'Tap and hold (long press) on the chat conversation',
                    'You\'ll see a context menu appear at the top of the screen',
                    'The menu will include options like mute, archive, and more options (...)',
                    'Look for additional options to access the export feature',
                  ],
                },
                {
                  step: 3,
                  title: 'Access More Options',
                  description: 'Tap the "More Options" or three-dot menu icon to reveal the full list of available actions, including the export chat option.',
                  details: [
                    'Tap on the three dots (...) menu icon at the top right',
                    'A dropdown menu will appear with additional choices',
                    'You should see "Export Chat" or similar option listed',
                    'Click on it to proceed with the export process',
                  ],
                },
                {
                  step: 4,
                  title: 'Select Export Type and Destination',
                  description: 'Choose whether to include media files, and select where to save the exported file. You can email it, save to cloud storage, or use file managers.',
                  details: [
                    'A dialog box will ask "Export chat without media?" or similar',
                    'Choose "Without Media" for text-only export (recommended)',
                    'Or choose "With Media" if you need all attachments',
                    'Select your destination: Gmail, Google Drive, Drive, Files, etc.',
                  ],
                },
                {
                  step: 5,
                  title: 'Complete and Retrieve Export',
                  description: 'Finalize the export process and locate your downloaded .txt file. It\'s now ready to be uploaded to WhatsApp Analyzer.',
                  details: [
                    'Confirm your selection in the final dialog box',
                    'Wait for the export process to complete',
                    'The file will be sent to your chosen destination',
                    'Retrieve the .txt file and prepare it for analysis',
                  ],
                },
              ].map((item) => (
                <Card key={item.step} className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="mt-1">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-600">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Pro Tip:</strong> Most Android devices save exports to your Google Drive or Download folder automatically. Check these locations if you can't find your file.
              </AlertDescription>
            </Alert>
          </section>

          {/* Next Steps Section */}
          <section className="space-y-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-slate-900">Next Steps: Analyze Your Chat</h2>
            <p className="text-slate-700">
              Now that you have your exported WhatsApp chat, it's time to uncover the insights hidden within your conversations. WhatsApp Analyzer transforms your raw chat data into beautiful visualizations and detailed statistics.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-6 border border-blue-100">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Your Exported File
                </h3>
                <p className="text-sm text-slate-600">
                  Have your .txt file ready. This is the chat export from your iPhone or Android device.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 border border-blue-100">
                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  Upload to Analyzer
                </h3>
                <p className="text-sm text-slate-600">
                  Head to our analysis tool and upload your file. No signup required.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/analyze">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Analyzing Your Chats Now
                </Button>
              </Link>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-700">
              Have questions about exporting WhatsApp chats? Find answers to common concerns below.
            </p>

            <div className="space-y-4">
              {[
                {
                  question: 'Is exporting my WhatsApp chat safe and private?',
                  answer: 'Yes, absolutely. The export feature is built into WhatsApp by WhatsApp Inc. itself, and the exported file remains on your device. When you use WhatsApp Analyzer, your data is processed locally on your device—we don\'t access, store, or transmit your personal messages. Your privacy is completely protected.',
                },
                {
                  question: 'Can I export multiple chats at once?',
                  answer: 'The standard WhatsApp export function exports one chat at a time. However, you can repeat the process for each conversation you want to analyze. Many users export their most important chats for detailed insights.',
                },
                {
                  question: 'What format will my exported chat be in?',
                  answer: 'WhatsApp exports chats as plain text (.txt) files. This universal format is compatible with any analyzer tool, including WhatsApp Analyzer. The text format preserves all message content including timestamps, sender information, and full message text.',
                },
                {
                  question: 'Should I include media files in my export?',
                  answer: 'For chat analysis, we recommend exporting "Without Media" as it creates a smaller, faster file to process. Media files (photos, videos, documents) are not necessary for analyzing message patterns, sentiment, frequency, and communication statistics.',
                },
                {
                  question: 'I can\'t find the Export Chat option. What should I do?',
                  answer: 'Make sure you\'re using a recent version of WhatsApp (iOS 14+ or Android 6+). Update WhatsApp from the App Store or Google Play Store. If the option still doesn\'t appear, try restarting your phone and reopening WhatsApp. The export feature is available in all modern versions.',
                },
                {
                  question: 'Can I analyze group chats the same way as private chats?',
                  answer: 'Yes! Group chats can be exported and analyzed using the same process. Group chat analysis provides fascinating insights into participant engagement, dominant speakers, conversation patterns, and group dynamics over time.',
                },
                {
                  question: 'How far back in message history can I export?',
                  answer: 'WhatsApp will export your entire message history for the selected chat, regardless of how many years of messages you have. This means you can analyze conversations spanning months or years to identify long-term trends.',
                },
                {
                  question: 'Is there a file size limit for exporting?',
                  answer: 'WhatsApp can handle large chats, but extremely large files (100MB+) may require more time to process. If you\'re exporting a very active group chat with years of history, consider exporting without media to reduce file size.',
                },
              ].map((faq, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Troubleshooting Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Troubleshooting Tips</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Export Button Not Showing?',
                  steps: [
                    'Update WhatsApp to the latest version',
                    'Force close and reopen the app',
                    'Ensure you\'re long-pressing or right-clicking the chat',
                  ],
                },
                {
                  title: 'File Not Received in Email?',
                  steps: [
                    'Check spam/junk mail folder',
                    'Verify you have stable internet connection',
                    'Try using a different email service',
                  ],
                },
                {
                  title: 'File Too Large to Upload?',
                  steps: [
                    'Export as "Without Media" next time',
                    'Delete old messages and re-export',
                    'Split large chats into smaller exports',
                  ],
                },
                {
                  title: 'Encoding Issues in Analyzer?',
                  steps: [
                    'Ensure your .txt file is UTF-8 encoded',
                    'Try opening and re-saving the file',
                    'Use a basic text editor to verify content',
                  ],
                },
              ].map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-blue-600 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Final CTA */}
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 text-white">
            <CardHeader className="pb-4">
              <CardTitle>Ready to Analyze Your Chats?</CardTitle>
              <CardDescription className="text-purple-100">
                You now have everything you need to export your WhatsApp conversations and uncover fascinating insights about your communication patterns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/analyze">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Go to GhostChecker
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Author Bio and Meta */}
          <div className="border-t pt-8 space-y-4">
            <div className="flex items-center gap-4">
              <img src="/ghost-logo.svg" alt="GhostChecker" className="h-12 w-12" />
              <div>
                <p className="font-semibold text-slate-900">GhostChecker</p>
                <p className="text-sm text-slate-600">Your trusted platform for WhatsApp chat insights and ghosting detection</p>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
