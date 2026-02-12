// Metrics calculation for WhatsApp chat analysis

import type { ParsedMessage, MonthYearStats, LongestGapContext } from "./types";

// Message frequency: count messages per participant per month/year
export function calculateMessageFrequency(
  messages: ParsedMessage[]
): Map<string, Record<string, number>> {
  const frequencyMap = new Map<string, Record<string, number>>();

  messages.forEach((msg) => {
    const { monthYear, sender } = msg;

    if (!frequencyMap.has(monthYear)) {
      frequencyMap.set(monthYear, {});
    }

    const monthData = frequencyMap.get(monthYear)!;
    monthData[sender] = (monthData[sender] || 0) + 1;
  });

  return frequencyMap;
}

// Average response time: calculate time between consecutive messages from different senders
export function calculateAverageResponseTime(
  messages: ParsedMessage[]
): Map<string, Record<string, number[]>> {
  const responseTimesMap = new Map<string, Record<string, number[]>>();

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currentMsg = messages[i];

    // Only calculate if senders are different (one responding to another)
    if (prevMsg.sender !== currentMsg.sender) {
      const timeDiff =
        currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime();

      // Ignore gaps > 24 hours (likely separate conversations)
      const maxGap = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (timeDiff <= maxGap && timeDiff > 0) {
        const { monthYear, sender } = currentMsg;

        if (!responseTimesMap.has(monthYear)) {
          responseTimesMap.set(monthYear, {});
        }

        const monthData = responseTimesMap.get(monthYear)!;
        if (!monthData[sender]) {
          monthData[sender] = [];
        }

        monthData[sender].push(timeDiff);
      }
    }
  }

  return responseTimesMap;
}

// Convert response times to averages
export function getAverageResponseTimes(
  responseTimesMap: Map<string, Record<string, number[]>>
): Map<string, Record<string, number>> {
  const averagesMap = new Map<string, Record<string, number>>();

  responseTimesMap.forEach((monthData, monthYear) => {
    const averages: Record<string, number> = {};

    Object.entries(monthData).forEach(([sender, times]) => {
      if (times.length > 0) {
        const sum = times.reduce((acc, time) => acc + time, 0);
        // Convert to minutes for easier reading
        averages[sender] = sum / times.length / 1000 / 60;
      }
    });

    if (Object.keys(averages).length > 0) {
      averagesMap.set(monthYear, averages);
    }
  });

  return averagesMap;
}

// Most active hours: count messages per hour (0-23) per month/year
export function calculateActiveHours(
  messages: ParsedMessage[]
): Map<string, Record<number, number>> {
  const activeHoursMap = new Map<string, Record<number, number>>();

  messages.forEach((msg) => {
    const { monthYear, hour } = msg;

    if (!activeHoursMap.has(monthYear)) {
      activeHoursMap.set(monthYear, {});
    }

    const monthData = activeHoursMap.get(monthYear)!;
    monthData[hour] = (monthData[hour] || 0) + 1;
  });

  return activeHoursMap;
}

// Most active hours by participant
export function calculateActiveHoursByParticipant(
  messages: ParsedMessage[]
): Map<string, Record<string, Record<number, number>>> {
  const activeHoursMap = new Map<string, Record<string, Record<number, number>>>();

  messages.forEach((msg) => {
    const { monthYear, hour, sender } = msg;

    if (!activeHoursMap.has(monthYear)) {
      activeHoursMap.set(monthYear, {});
    }

    const monthData = activeHoursMap.get(monthYear)!;
    if (!monthData[sender]) {
      monthData[sender] = {};
    }

    monthData[sender][hour] = (monthData[sender][hour] || 0) + 1;
  });

  return activeHoursMap;
}

// Longest time without answering: find the longest gap between receiving and sending
export function calculateLongestTimeWithoutAnswering(
  messages: ParsedMessage[]
): {
  longestGapsMap: Map<string, Record<string, number>>;
  contextMap: Map<string, Record<string, LongestGapContext>>;
} {
  const longestGapsMap = new Map<string, Record<string, number>>();
  const contextMap = new Map<string, Record<string, LongestGapContext>>();

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = messages[i - 1];
    const currentMsg = messages[i];

    // When someone responds to a different person
    if (prevMsg.sender !== currentMsg.sender) {
      const timeDiff =
        currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime();

      // Convert to minutes
      const timeDiffMinutes = timeDiff / 1000 / 60;

      // Only consider gaps < 7 days (excessive gaps are likely not "not answering")
      const maxGap = 7 * 24 * 60; // 7 days in minutes
      if (timeDiffMinutes <= maxGap && timeDiffMinutes > 0) {
        const { monthYear, sender } = currentMsg;

        if (!longestGapsMap.has(monthYear)) {
          longestGapsMap.set(monthYear, {});
        }
        if (!contextMap.has(monthYear)) {
          contextMap.set(monthYear, {});
        }

        const monthData = longestGapsMap.get(monthYear)!;
        const monthContext = contextMap.get(monthYear)!;
        const currentLongest = monthData[sender] || 0;

        // If this is a new longest gap for this participant
        if (timeDiffMinutes > currentLongest) {
          monthData[sender] = timeDiffMinutes;

          // Store context: 3 messages before and after
          const conversationBefore = messages.slice(Math.max(0, i - 3), i);
          const conversationAfter = messages.slice(i, Math.min(messages.length, i + 4));

          monthContext[sender] = {
            gapMinutes: timeDiffMinutes,
            lastMessageReceived: prevMsg,
            firstResponseSent: currentMsg,
            conversationBefore,
            conversationAfter,
          };
        }
      }
    }
  }

  return { longestGapsMap, contextMap };
}

// Aggregate all metrics into MonthYearStats array
export function aggregateMetrics(messages: ParsedMessage[]): MonthYearStats[] {
  const frequencyMap = calculateMessageFrequency(messages);
  const responseTimesMap = calculateAverageResponseTime(messages);
  const averageResponseMap = getAverageResponseTimes(responseTimesMap);
  const activeHoursMap = calculateActiveHours(messages);
  const activeHoursByParticipantMap = calculateActiveHoursByParticipant(messages);
  const { longestGapsMap, contextMap } = calculateLongestTimeWithoutAnswering(messages);

  // Get all unique month/year combinations
  const allMonthYears = new Set<string>();
  messages.forEach((msg) => allMonthYears.add(msg.monthYear));

  // Create stats array sorted chronologically
  const stats: MonthYearStats[] = Array.from(allMonthYears)
    .sort((a, b) => {
      // Parse "Oct 2025" format for sorting
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    })
    .map((monthYear) => ({
      monthYear,
      messageFrequency: frequencyMap.get(monthYear) || {},
      averageResponseTime: averageResponseMap.get(monthYear) || {},
      activeHours: activeHoursMap.get(monthYear) || {},
      activeHoursByParticipant: activeHoursByParticipantMap.get(monthYear) || {},
      longestTimeWithoutAnswering: longestGapsMap.get(monthYear) || {},
      longestGapContext: contextMap.get(monthYear) || {},
    }));

  return stats;
}

// Helper: Get stats for a specific month/year
export function getStatsForMonth(
  stats: MonthYearStats[],
  monthYear: string
): MonthYearStats | undefined {
  return stats.find((s) => s.monthYear === monthYear);
}

// Helper: Get all available month/year options
export function getAvailableMonthYears(stats: MonthYearStats[]): string[] {
  return stats.map((s) => s.monthYear);
}

// Helper: Calculate totals across all months for comparison
export function calculateTotals(messages: ParsedMessage[]): {
  totalFrequency: Record<string, number>;
  totalActiveHours: Record<number, number>;
  totalActiveHoursByParticipant: Record<string, Record<number, number>>;
  overallAverageResponseTime: Record<string, number>;
  overallLongestTimeWithoutAnswering: Record<string, number>;
} {
  const totalFrequency: Record<string, number> = {};
  const totalActiveHours: Record<number, number> = {};
  const totalActiveHoursByParticipant: Record<string, Record<number, number>> = {};

  messages.forEach((msg) => {
    totalFrequency[msg.sender] = (totalFrequency[msg.sender] || 0) + 1;
    totalActiveHours[msg.hour] = (totalActiveHours[msg.hour] || 0) + 1;

    if (!totalActiveHoursByParticipant[msg.sender]) {
      totalActiveHoursByParticipant[msg.sender] = {};
    }
    totalActiveHoursByParticipant[msg.sender][msg.hour] =
      (totalActiveHoursByParticipant[msg.sender][msg.hour] || 0) + 1;
  });

  // Calculate overall average response time
  const responseTimesMap = calculateAverageResponseTime(messages);
  const allResponseTimes: Record<string, number[]> = {};

  responseTimesMap.forEach((monthData) => {
    Object.entries(monthData).forEach(([sender, times]) => {
      if (!allResponseTimes[sender]) {
        allResponseTimes[sender] = [];
      }
      allResponseTimes[sender].push(...times);
    });
  });

  const overallAverageResponseTime: Record<string, number> = {};
  Object.entries(allResponseTimes).forEach(([sender, times]) => {
    if (times.length > 0) {
      const sum = times.reduce((acc, time) => acc + time, 0);
      overallAverageResponseTime[sender] = sum / times.length / 1000 / 60;
    }
  });

  // Calculate overall longest time without answering
  const { longestGapsMap } = calculateLongestTimeWithoutAnswering(messages);
  const overallLongestTimeWithoutAnswering: Record<string, number> = {};

  longestGapsMap.forEach((monthData) => {
    Object.entries(monthData).forEach(([sender, gap]) => {
      const currentLongest = overallLongestTimeWithoutAnswering[sender] || 0;
      overallLongestTimeWithoutAnswering[sender] = Math.max(currentLongest, gap);
    });
  });

  return {
    totalFrequency,
    totalActiveHours,
    totalActiveHoursByParticipant,
    overallAverageResponseTime,
    overallLongestTimeWithoutAnswering,
  };
}
