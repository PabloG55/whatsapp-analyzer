"use client";

import { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ghost, TrendingDown, Clock, MessageCircle } from "lucide-react";
import type { GhostingScore } from "@/lib/ghosting";
import type { Participant } from "@/lib/types";

interface GhostingProbabilityChartProps {
  ghostingScores: GhostingScore[];
  participants: Participant[];
}

// Format minutes to human-readable time
function formatTime(minutes: number): string {
  if (minutes < 1) {
    return "< 1 min";
  } else if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  } else if (minutes < 24 * 60) {
    const hours = Math.round(minutes / 60 * 10) / 10; // 1 decimal place
    return `${hours}h`;
  } else {
    const days = Math.round(minutes / (24 * 60) * 10) / 10;
    return `${days}d`;
  }
}

export default function GhostingProbabilityChart({
  ghostingScores,
  participants,
}: GhostingProbabilityChartProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<string>(
    ghostingScores[0]?.participant || ""
  );

  if (ghostingScores.length === 0) {
    return (
      <div className="text-center py-12">
        <Ghost className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          No ghosting data available. Need at least 60 days of conversation history.
        </p>
      </div>
    );
  }

  const selectedScore = ghostingScores.find((s) => s.participant === selectedParticipant);

  if (!selectedScore) {
    return null;
  }

  // Prepare data for radial chart
  const chartData = [
    {
      name: "Ghosting Score",
      value: selectedScore.overallScore,
      fill: selectedScore.risk === "high" 
        ? "#ef4444" 
        : selectedScore.risk === "medium" 
        ? "#f59e0b" 
        : "#10b981",
    },
  ];

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "destructive";
    if (risk === "medium") return "default";
    return "secondary";
  };

  const getRiskLabel = (risk: string) => {
    if (risk === "high") return "👻 High Risk";
    if (risk === "medium") return "⚠ Medium Risk";
    return "✅ Low Risk";
  };

  return (
    <div className="space-y-6">
      {/* Participant Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Select Person:</label>
        <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
          <SelectTrigger className="w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ghostingScores.map((score) => {
              const participant = participants.find((p) => p.name === score.participant);
              return (
                <SelectItem key={score.participant} value={score.participant}>
                  <div className="flex items-center gap-2">
                    {participant && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: participant.color }}
                      />
                    )}
                    {score.participant}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radial Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Ghosting Probability</CardTitle>
            <CardDescription className="text-center">
              0-100% likelihood based on conversation patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  data={chartData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    fill={chartData[0].fill}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold">{selectedScore.overallScore}%</div>
                <Badge variant={getRiskColor(selectedScore.risk)} className="mt-2">
                  {getRiskLabel(selectedScore.risk)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Explanation */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
            <CardDescription>What this score means</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedScore.risk === "high" && (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <div className="flex items-start gap-3">
                  <Ghost className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-300">High Ghosting Risk</p>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      Multiple indicators suggest this person's communication pattern has significantly changed.
                      They may be distancing themselves from the conversation.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {selectedScore.risk === "medium" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-300">Medium Risk</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      Some changes in communication pattern detected. Could be temporary (busy period, life
                      changes) or early signs of disengagement.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {selectedScore.risk === "low" && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-300">Low Risk</p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Communication patterns appear stable and healthy. No significant signs of ghosting detected.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This is an algorithmic analysis based on recent conversation patterns 
                (last 30 days vs. previous 30 days). Real-life context matters more than any score.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Factor Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Factor Breakdown</CardTitle>
          <CardDescription>
            How each factor contributes to the overall score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frequency Drop */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Message Frequency Drop</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight: 30%</span>
                  <span className="font-medium">{selectedScore.factors.frequencyDrop}%</span>
                </div>
                <Progress value={selectedScore.factors.frequencyDrop} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                Recent: {selectedScore.rawData.recent30DaysCount} msgs →
                Previous: {selectedScore.rawData.previous30DaysCount} msgs
              </div>
            </div>

            {/* Response Time */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Response Time Increase</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight: 35%</span>
                  <span className="font-medium">{selectedScore.factors.responseTimeIncrease}%</span>
                </div>
                <Progress value={selectedScore.factors.responseTimeIncrease} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                Recent avg: {formatTime(selectedScore.rawData.recentAvgResponseMinutes)} →
                Previous: {formatTime(selectedScore.rawData.previousAvgResponseMinutes)}
              </div>
            </div>

            {/* Gap Increase */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Conversation Gap Increase</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Weight: 35%</span>
                  <span className="font-medium">{selectedScore.factors.gapIncrease}%</span>
                </div>
                <Progress value={selectedScore.factors.gapIncrease} className="h-2" />
              </div>
              <div className="text-xs text-muted-foreground">
                Longest recent: {formatTime(selectedScore.rawData.longestGapRecentMinutes)} →
                Avg: {formatTime(selectedScore.rawData.avgGapHistoricalMinutes)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      {selectedScore.insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>
              Detailed analysis of conversation patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {selectedScore.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Ghosting Detection Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Our algorithm compares the <strong>last 30 days</strong> of conversation with the{" "}
            <strong>previous 30 days</strong> to detect changes in communication patterns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <p className="font-semibold text-foreground mb-1">Message Frequency (30%)</p>
              <p className="text-xs">
                Are they sending fewer messages? A significant drop indicates declining engagement.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Response Time (35%)</p>
              <p className="text-xs">
                Are they taking longer to respond? Slower replies may signal reduced interest.
              </p>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Conversation Gaps (35%)</p>
              <p className="text-xs">
                Are silences getting longer? Growing gaps can indicate pulling away.
              </p>
            </div>
          </div>
          <p className="text-xs pt-2">
            The final score is a weighted combination of all three factors. Remember: life happens! 
            Context matters more than algorithms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
