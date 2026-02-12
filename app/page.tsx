"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  Clock, 
  MessageSquare, 
  Users, 
  Lock,
  Server,
  Eye,
  ArrowRight,
  Upload,
  Zap,
  TrendingUp
} from "lucide-react";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Shield className="h-3 w-3 mr-1" />
            100% Private & Secure
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Analyze Your WhatsApp Chats
            <br />
            Without Uploading Anything
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Everything happens in your browser. We never see your messages.
            <br />
            <span className="font-semibold text-foreground">We literally cannot access your data.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/analyze">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/blog/how-to-export-whatsapp-chat">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                How to Export Chat
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span>No Sign-Up Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section - PROMINENT */}
      <section id="privacy" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                🔒 Your Privacy is Guaranteed
              </h2>
              <p className="text-xl text-muted-foreground">
                Not just promised - it&apos;s technically impossible for us to see your data
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <Server className="h-10 w-10 text-green-600 mb-2 mx-auto" />
                  <CardTitle className="text-center">No Servers</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Your chat file never leaves your device. No uploads, no cloud storage, no database.
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <Eye className="h-10 w-10 text-green-600 mb-2 mx-auto" />
                  <CardTitle className="text-center">We Can&apos;t See It</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  All analysis happens in your browser using JavaScript. We physically cannot access your messages.
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <Lock className="h-10 w-10 text-green-600 mb-2 mx-auto" />
                  <CardTitle className="text-center">Client-Side Only</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Built with privacy first. No API calls, no tracking, no data collection. Period.
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
              <p className="text-center text-lg font-semibold text-green-700 dark:text-green-400">
                💡 Technical Proof: Open your browser&apos;s Network tab while analyzing - you&apos;ll see zero uploads or API calls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Analytics, Instantly
          </h2>
          <p className="text-xl text-muted-foreground">
            Get deep insights into your WhatsApp conversations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Message Frequency</CardTitle>
              <CardDescription>
                See who sends the most messages over time
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Track message counts per participant, grouped by month and year for trend analysis.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Response Times</CardTitle>
              <CardDescription>
                Measure how fast people reply
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Average response time analysis shows conversation engagement patterns.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Active Hours</CardTitle>
              <CardDescription>
                When are people most active?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              24-hour breakdown showing peak messaging times for each participant.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Longest Gaps</CardTitle>
              <CardDescription>
                Find conversation dry spells
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Identify the longest time without responding, with clickable conversation context.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-pink-600 mb-2" />
              <CardTitle>Multi-Participant</CardTitle>
              <CardDescription>
                Works with any number of people
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Automatically detects all participants in group chats or one-on-one conversations.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Upload className="h-10 w-10 text-indigo-600 mb-2" />
              <CardTitle>Media Toggle</CardTitle>
              <CardDescription>
                Include or exclude media messages
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Filter out &quot;&lt;Media omitted&gt;&quot; messages or include them in your analysis.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to instant insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Your Chat</h3>
              <p className="text-muted-foreground">
                Open WhatsApp, go to the chat you want to analyze, and export it as a .txt file.
              </p>
              <Link href="/blog/how-to-export-whatsapp-chat" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Step-by-step guide →
              </Link>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload the File</h3>
              <p className="text-muted-foreground">
                Drag and drop your .txt file into our analyzer. It stays on your device - we never see it.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">View Insights</h3>
              <p className="text-muted-foreground">
                Get instant analytics with interactive charts showing message patterns, response times, and more.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/analyze">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Analyzing Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
