// Ghosting detection algorithm for WhatsApp conversations
// Calculates probability (0-100%) that a participant is ghosting you

import type { ParsedMessage } from "./types";

export interface GhostingScore {
  participant: string;
  overallScore: number; // 0-100
  factors: {
    frequencyDrop: number; // 0-100
    responseTimeIncrease: number; // 0-100
    gapIncrease: number; // 0-100
  };
  risk: "low" | "medium" | "high";
  insights: string[];
  rawData: {
    recent30DaysCount: number;
    previous30DaysCount: number;
    recentAvgResponseMinutes: number;
    previousAvgResponseMinutes: number;
    longestGapRecentMinutes: number;
    avgGapHistoricalMinutes: number;
  };
}

/**
 * Calculate ghosting probability for a specific participant
 * Based on 3 factors: message frequency drop, response time increase, conversation gaps
 */
export function calculateGhostingScore(
  messages: ParsedMessage[],
  targetParticipant: string,
  otherParticipants: string[]
): GhostingScore {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Separate recent and previous periods
  const recentMessages = sortedMessages.filter(
    (m) => m.timestamp >= thirtyDaysAgo
  );
  const previousMessages = sortedMessages.filter(
    (m) => m.timestamp >= sixtyDaysAgo && m.timestamp < thirtyDaysAgo
  );

  // Factor 1: Message Frequency Drop (30% weight)
  const recent30DaysCount = recentMessages.filter(
    (m) => m.sender === targetParticipant
  ).length;
  const previous30DaysCount = previousMessages.filter(
    (m) => m.sender === targetParticipant
  ).length;

  const frequencyDrop =
    previous30DaysCount > 0
      ? Math.max(
          0,
          ((previous30DaysCount - recent30DaysCount) / previous30DaysCount) *
            100
        )
      : 0;

  // Factor 2: Response Time Increase (35% weight)
  const recentResponseTimes = calculateResponseTimes(
    recentMessages,
    targetParticipant,
    otherParticipants
  );
  const previousResponseTimes = calculateResponseTimes(
    previousMessages,
    targetParticipant,
    otherParticipants
  );

  const recentAvgResponse =
    recentResponseTimes.length > 0
      ? recentResponseTimes.reduce((a, b) => a + b, 0) /
        recentResponseTimes.length
      : 0;
  const previousAvgResponse =
    previousResponseTimes.length > 0
      ? previousResponseTimes.reduce((a, b) => a + b, 0) /
        previousResponseTimes.length
      : 0;

  const responseTimeIncrease =
    previousAvgResponse > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((recentAvgResponse - previousAvgResponse) / previousAvgResponse) *
              100
          )
        )
      : 0;

  // Factor 3: Longest Gap Increase (35% weight)
  const longestGapRecent = findLongestGap(
    recentMessages,
    targetParticipant,
    otherParticipants
  );
  const avgGapHistorical = calculateAverageGap(
    sortedMessages,
    targetParticipant,
    otherParticipants
  );

  const gapIncrease =
    avgGapHistorical > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((longestGapRecent - avgGapHistorical) / avgGapHistorical) * 100
          )
        )
      : 0;

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    frequencyDrop * 0.3 + responseTimeIncrease * 0.35 + gapIncrease * 0.35
  );

  // Determine risk level
  let risk: "low" | "medium" | "high";
  if (overallScore <= 30) risk = "low";
  else if (overallScore <= 60) risk = "medium";
  else risk = "high";

  // Generate insights
  const insights = generateInsights(
    frequencyDrop,
    responseTimeIncrease,
    gapIncrease,
    recent30DaysCount,
    previous30DaysCount,
    recentAvgResponse,
    previousAvgResponse,
    longestGapRecent,
    avgGapHistorical
  );

  return {
    participant: targetParticipant,
    overallScore,
    factors: {
      frequencyDrop: Math.round(frequencyDrop),
      responseTimeIncrease: Math.round(responseTimeIncrease),
      gapIncrease: Math.round(gapIncrease),
    },
    risk,
    insights,
    rawData: {
      recent30DaysCount,
      previous30DaysCount,
      recentAvgResponseMinutes: Math.round(recentAvgResponse),
      previousAvgResponseMinutes: Math.round(previousAvgResponse),
      longestGapRecentMinutes: Math.round(longestGapRecent),
      avgGapHistoricalMinutes: Math.round(avgGapHistorical),
    },
  };
}

/**
 * Calculate response times for a participant
 * Returns array of response times in minutes
 */
function calculateResponseTimes(
  messages: ParsedMessage[],
  participant: string,
  others: string[]
): number[] {
  const responseTimes: number[] = [];

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currentMsg = messages[i];

    // Check if this is a response from participant to someone else
    if (
      currentMsg.sender === participant &&
      others.includes(prevMsg.sender) &&
      prevMsg.sender !== participant
    ) {
      const timeDiff =
        (currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime()) /
        1000 /
        60; // minutes

      // Only count responses within 24 hours
      if (timeDiff <= 24 * 60) {
        responseTimes.push(timeDiff);
      }
    }
  }

  return responseTimes;
}

/**
 * Find longest gap between receiving a message and responding
 * Returns gap in minutes
 */
function findLongestGap(
  messages: ParsedMessage[],
  participant: string,
  others: string[]
): number {
  let longestGap = 0;

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currentMsg = messages[i];

    if (
      currentMsg.sender === participant &&
      others.includes(prevMsg.sender) &&
      prevMsg.sender !== participant
    ) {
      const gap =
        (currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime()) /
        1000 /
        60; // minutes

      // Only count gaps up to 7 days (excessive gaps are conversation ends, not ghosting)
      if (gap <= 7 * 24 * 60) {
        longestGap = Math.max(longestGap, gap);
      }
    }
  }

  return longestGap;
}

/**
 * Calculate average gap between receiving and responding
 * Returns average gap in minutes
 */
function calculateAverageGap(
  messages: ParsedMessage[],
  participant: string,
  others: string[]
): number {
  const gaps: number[] = [];

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currentMsg = messages[i];

    if (
      currentMsg.sender === participant &&
      others.includes(prevMsg.sender) &&
      prevMsg.sender !== participant
    ) {
      const gap =
        (currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime()) /
        1000 /
        60; // minutes

      if (gap <= 24 * 60) {
        gaps.push(gap);
      }
    }
  }

  return gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
}

/**
 * Generate human-readable insights based on factors
 */
function generateInsights(
  frequencyDrop: number,
  responseTimeIncrease: number,
  gapIncrease: number,
  recentCount: number,
  previousCount: number,
  recentAvg: number,
  previousAvg: number,
  longestGap: number,
  avgGap: number
): string[] {
  const insights: string[] = [];

  // Message frequency insights
  if (frequencyDrop > 50) {
    insights.push(
      `Message frequency dropped significantly: ${Math.round(frequencyDrop)}% fewer messages in the last 30 days`
    );
  } else if (frequencyDrop > 30) {
    insights.push(
      `Message frequency declining: ${Math.round(frequencyDrop)}% fewer messages recently`
    );
  } else if (frequencyDrop > 0) {
    insights.push(`Slight decrease in message frequency (${Math.round(frequencyDrop)}%)`);
  } else {
    insights.push("Message frequency stable or increasing");
  }

  // Response time insights
  if (responseTimeIncrease > 100) {
    insights.push(
      `Response times more than doubled: now averaging ${formatMinutes(recentAvg)} (was ${formatMinutes(previousAvg)})`
    );
  } else if (responseTimeIncrease > 50) {
    insights.push(
      `Response times significantly slower: ${Math.round(responseTimeIncrease)}% increase`
    );
  } else if (responseTimeIncrease > 20) {
    insights.push(
      `Response times moderately slower: ${Math.round(responseTimeIncrease)}% increase`
    );
  } else {
    insights.push("Response times relatively stable");
  }

  // Gap insights
  if (gapIncrease > 200) {
    insights.push(
      `Longest recent gap is ${formatMinutes(longestGap)} (avg: ${formatMinutes(avgGap)}) - major delay`
    );
  } else if (gapIncrease > 100) {
    insights.push(
      `Recent gaps much longer than usual: ${formatMinutes(longestGap)} vs typical ${formatMinutes(avgGap)}`
    );
  } else if (gapIncrease > 50) {
    insights.push(
      `Conversation gaps increasing: longest gap ${formatMinutes(longestGap)}`
    );
  }

  // Overall assessment
  if (recentCount < 5) {
    insights.push(
      "⚠ Very few messages in last 30 days - limited data for analysis"
    );
  }

  return insights;
}

/**
 * Format minutes into human-readable time
 */
function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  } else if (minutes < 24 * 60) {
    const hours = Math.round(minutes / 60);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    const days = Math.round(minutes / (24 * 60));
    return `${days} day${days > 1 ? "s" : ""}`;
  }
}

/**
 * Calculate ghosting scores for all participants
 */
export function calculateAllGhostingScores(
  messages: ParsedMessage[],
  participants: string[]
): GhostingScore[] {
  return participants.map((participant) => {
    const others = participants.filter((p) => p !== participant);
    return calculateGhostingScore(messages, participant, others);
  });
}
