"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Calendar, MessageSquare, Users, Clock, Image } from "lucide-react";
import { format } from "date-fns";
import MessageFrequencyChart from "@/components/MessageFrequencyChart";
import ResponseTimeChart from "@/components/ResponseTimeChart";
import ActiveHoursChart from "@/components/ActiveHoursChart";
import LongestResponseChart from "@/components/LongestResponseChart";
import type { ChatAnalytics, MonthYearStats, LongestGapContext } from "@/lib/types";
import { parseWhatsAppFile } from "@/lib/parser";
import { calculateTotals, aggregateMetrics } from "@/lib/metrics";

export default function DashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [rawFileContent, setRawFileContent] = useState<string>("");
  const [includeMedia, setIncludeMedia] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [originalMediaCount, setOriginalMediaCount] = useState(0); // Track original media count

  useEffect(() => {
    const data = localStorage.getItem("whatsapp-analytics");
    const fileContent = localStorage.getItem("whatsapp-file-content");
    
    if (!data) {
      router.push("/");
      return;
    }

    try {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      parsed.dateRange.start = new Date(parsed.dateRange.start);
      parsed.dateRange.end = new Date(parsed.dateRange.end);
      parsed.messages = parsed.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setAnalytics(parsed);
      setRawFileContent(fileContent || "");
      
      // Store original media count (won't change when toggling)
      if (parsed.mediaMessagesCount > 0) {
        setOriginalMediaCount(parsed.mediaMessagesCount);
      }
    } catch (error) {
      console.error("Failed to parse analytics data:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Re-calculate when includeMedia changes
  useEffect(() => {
    if (!rawFileContent || isLoading) return;

    setIsRecalculating(true);
    
    const result = parseWhatsAppFile(rawFileContent, includeMedia);
    if (result.success && result.data) {
      const monthYearStats = aggregateMetrics(result.data.messages);
      result.data.monthYearStats = monthYearStats;
      
      // Update analytics directly
      setAnalytics(result.data);
      
      // Also update localStorage for persistence
      const dataToStore = {
        ...result.data,
        dateRange: {
          start: result.data.dateRange.start.toISOString(),
          end: result.data.dateRange.end.toISOString(),
        },
      };
      
      localStorage.setItem("whatsapp-analytics", JSON.stringify(dataToStore));
    }
    
    setIsRecalculating(false);
  }, [includeMedia, rawFileContent, isLoading]);

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const totals = calculateTotals(analytics.messages);
  const availableMonths = ["all", ...analytics.monthYearStats.map((s) => s.monthYear)];

  // Prepare chart data based on selected month
  const getChartData = () => {
    if (selectedMonth === "all") {
      // Aggregate all months
      const allActiveHoursData: Record<number, Record<string, number>> = {};

      // Aggregate active hours by participant across all months
      analytics.monthYearStats.forEach((stat) => {
        Object.entries(stat.activeHoursByParticipant).forEach(([participant, hours]) => {
          Object.entries(hours).forEach(([hour, count]) => {
            const hourNum = parseInt(hour);
            if (!allActiveHoursData[hourNum]) {
              allActiveHoursData[hourNum] = {};
            }
            allActiveHoursData[hourNum][participant] =
              (allActiveHoursData[hourNum][participant] || 0) + count;
          });
        });
      });

      // Ensure all 24 hours are present, sorted
      const activeHoursArray = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        ...(allActiveHoursData[hour] || {}),
      }));

      // Aggregate gap contexts
      const allGapContexts: Record<string, Record<string, LongestGapContext>> = {};
      analytics.monthYearStats.forEach((stat) => {
        if (stat.longestGapContext) {
          allGapContexts[stat.monthYear] = stat.longestGapContext;
        }
      });

      return {
        frequencyData: analytics.monthYearStats.map((stat) => ({
          monthYear: stat.monthYear,
          ...stat.messageFrequency,
        })),
        responseTimeData: analytics.monthYearStats.map((stat) => ({
          monthYear: stat.monthYear,
          ...stat.averageResponseTime,
        })),
        activeHoursData: activeHoursArray,
        longestResponseData: analytics.monthYearStats.map((stat) => ({
          monthYear: stat.monthYear,
          ...stat.longestTimeWithoutAnswering,
        })),
        gapContexts: allGapContexts,
      };
    } else {
      // Single month view
      const monthStats = analytics.monthYearStats.find((s) => s.monthYear === selectedMonth);
      if (!monthStats) {
        return {
          frequencyData: [],
          responseTimeData: [],
          activeHoursData: [],
          longestResponseData: [],
          gapContexts: {},
        };
      }

      // Transform activeHoursByParticipant to chart format
      const activeHoursData: Record<number, Record<string, number>> = {};
      Object.entries(monthStats.activeHoursByParticipant).forEach(([participant, hours]) => {
        Object.entries(hours).forEach(([hour, count]) => {
          const hourNum = parseInt(hour);
          if (!activeHoursData[hourNum]) {
            activeHoursData[hourNum] = {};
          }
          activeHoursData[hourNum][participant] = count;
        });
      });

      // Ensure all 24 hours are present, sorted
      const activeHoursArray = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        ...(activeHoursData[hour] || {}),
      }));

      return {
        frequencyData: [
          {
            monthYear: monthStats.monthYear,
            ...monthStats.messageFrequency,
          },
        ],
        responseTimeData: [
          {
            monthYear: monthStats.monthYear,
            ...monthStats.averageResponseTime,
          },
        ],
        activeHoursData: activeHoursArray,
        longestResponseData: [
          {
            monthYear: monthStats.monthYear,
            ...monthStats.longestTimeWithoutAnswering,
          },
        ],
        gapContexts: {
          [monthStats.monthYear]: monthStats.longestGapContext || {},
        },
      };
    }
  };

  const chartData = getChartData();

  const handleReset = () => {
    localStorage.removeItem("whatsapp-analytics");
    localStorage.removeItem("whatsapp-file-content");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={handleReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <h1 className="text-3xl font-bold">Chat Analytics</h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalMessages.toLocaleString()}</div>
              {analytics.mediaMessagesCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  + {analytics.mediaMessagesCount} media {includeMedia ? "(included)" : "(excluded)"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.participants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Date Range</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {format(analytics.dateRange.start, "MMM d, yyyy")}
              </div>
              <div className="text-sm text-muted-foreground">
                to {format(analytics.dateRange.end, "MMM d, yyyy")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.ceil(
                  (analytics.dateRange.end.getTime() - analytics.dateRange.start.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Toggle */}
        {originalMediaCount > 0 && (
          <Card className="mb-8">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Image className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Include Media Messages</p>
                  <p className="text-sm text-muted-foreground">
                    {originalMediaCount} &quot;&lt;Media omitted&gt;&quot; messages found. Toggle to include/exclude them from analysis.
                  </p>
                </div>
              </div>
              <Switch
                checked={includeMedia}
                onCheckedChange={setIncludeMedia}
                disabled={isRecalculating}
              />
            </CardContent>
          </Card>
        )}

        {isRecalculating && (
          <div className="mb-8 p-4 border rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">Recalculating metrics...</p>
          </div>
        )}

        {/* Participants Legend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {analytics.participants.map((participant) => (
                <div key={participant.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: participant.color }}
                  />
                  <span className="font-medium">{participant.name}</span>
                  <Badge variant="secondary">{participant.messageCount.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Month Filter */}
        <div className="flex items-center gap-4 mb-6">
          <label className="text-sm font-medium">Filter by Month:</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <Separator className="my-1" />
              {analytics.monthYearStats.map((stat) => (
                <SelectItem key={stat.monthYear} value={stat.monthYear}>
                  {stat.monthYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Charts */}
        <Tabs defaultValue="frequency" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="frequency">Message Frequency</TabsTrigger>
            <TabsTrigger value="response">Response Time</TabsTrigger>
            <TabsTrigger value="hours">Active Hours</TabsTrigger>
            <TabsTrigger value="longest">Longest Gap</TabsTrigger>
          </TabsList>

          <TabsContent value="frequency">
            <Card>
              <CardHeader>
                <CardTitle>Message Frequency</CardTitle>
                <CardDescription>
                  Number of messages sent by each participant over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageFrequencyChart
                  data={chartData.frequencyData}
                  participants={analytics.participants}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle>Average Response Time</CardTitle>
                <CardDescription>
                  Average time (in minutes) between messages from different participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponseTimeChart
                  data={chartData.responseTimeData}
                  participants={analytics.participants}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Most Active Hours</CardTitle>
                <CardDescription>
                  Distribution of messages across hours of the day (24-hour format)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActiveHoursChart 
                  data={chartData.activeHoursData}
                  participants={analytics.participants}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="longest">
            <Card>
              <CardHeader>
                <CardTitle>Longest Time Without Answering</CardTitle>
                <CardDescription>
                  Maximum time gap before responding (per participant, by month/year)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LongestResponseChart
                  data={chartData.longestResponseData}
                  participants={analytics.participants}
                  gapContexts={chartData.gapContexts}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
