// WhatsApp chat file parser with unicode support

import { format } from "date-fns";
import type {
  ParsedMessage,
  ChatAnalytics,
  ParsingResult,
  MessageType,
  Participant,
} from "./types";
import { isValidMessage, isNonEmptyString } from "./type-guards";
import { aggregateMetrics } from "./metrics";

// Regex pattern that handles narrow no-break space (\u202f) between time and AM/PM
const MESSAGE_REGEX =
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}[\s\u202f]?[AP]M)\s-\s([^:]+):\s(.+)/;

// Common system message patterns to filter out
const SYSTEM_MESSAGE_PATTERNS = [
  /joined using this group's invite link/i,
  /left/i,
  /added/i,
  /removed/i,
  /changed the subject to/i,
  /changed this group's icon/i,
  /changed the group description/i,
  /Messages and calls are end-to-end encrypted/i,
  /<Media omitted>/i,
  /This message was deleted/i,
  /You deleted this message/i,
];

function isSystemMessageContent(content: string, includeMedia: boolean = false): boolean {
  // Check for media omitted
  if (!includeMedia && /<Media omitted>/i.test(content)) {
    return true;
  }

  // Check other system messages (excluding media omitted pattern if includeMedia is true)
  const patternsToCheck = includeMedia
    ? SYSTEM_MESSAGE_PATTERNS.filter(p => p.source !== '<Media omitted>')
    : SYSTEM_MESSAGE_PATTERNS;

  return patternsToCheck.some((pattern) => pattern.test(content));
}

function getMonthYear(date: Date): string {
  return format(date, "MMM yyyy"); // "Oct 2025"
}

function parseDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    // Handle narrow no-break space
    const cleanTime = timeStr.replace(/\u202f/g, " ").trim();

    // Parse date parts (MM/DD/YYYY or M/D/YY)
    const [month, day, year] = dateStr.split("/").map(Number);
    const fullYear = year < 100 ? 2000 + year : year;

    // Parse time parts
    const timeMatch = cleanTime.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
    if (!timeMatch) return null;

    let [, hourStr, minuteStr, meridiem] = timeMatch;
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);

    // Convert to 24-hour format
    if (meridiem.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    const date = new Date(fullYear, month - 1, day, hours, minutes);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function parseWhatsAppFile(fileContent: string, includeMedia: boolean = false): ParsingResult {
  const lines = fileContent.split("\n");
  const messages: ParsedMessage[] = [];
  const errors: string[] = [];
  let mediaMessagesCount = 0;

  let currentMessage: Partial<ParsedMessage> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(MESSAGE_REGEX);

    if (match) {
      // Save previous message if exists
      if (currentMessage && isNonEmptyString(currentMessage.sender)) {
        const timestamp = currentMessage.timestamp;
        if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
          messages.push(currentMessage as ParsedMessage);
        }
      }

      // Parse new message
      const [, date, time, sender, content] = match;
      const timestamp = parseDateTime(date, time);

      if (!timestamp) {
        errors.push(`Line ${i + 1}: Failed to parse date/time`);
        currentMessage = null;
        continue;
      }

      // Check if it's a media message
      const isMedia = /<Media omitted>/i.test(content);
      if (isMedia && !includeMedia) {
        mediaMessagesCount++;
        currentMessage = null;
        continue;
      }

      // Skip system messages
      if (isSystemMessageContent(content, includeMedia)) {
        currentMessage = null;
        continue;
      }

      currentMessage = {
        date,
        time,
        sender: sender.trim(),
        content,
        timestamp,
        hour: timestamp.getHours(),
        monthYear: getMonthYear(timestamp),
      };
    } else if (currentMessage) {
      // Multi-line message continuation
      currentMessage.content += "\n" + line;
    }
  }

  // Add last message
  if (currentMessage && isNonEmptyString(currentMessage.sender)) {
    const timestamp = currentMessage.timestamp;
    if (timestamp instanceof Date && !isNaN(timestamp.getTime())) {
      messages.push(currentMessage as ParsedMessage);
    }
  }

  if (messages.length === 0) {
    return {
      success: false,
      error: "No valid messages found. Please check the file format.",
      mediaMessagesCount,
    };
  }

  // Detect participants
  const participants = detectParticipants(messages);
  
  // Aggregate metrics
  const monthYearStats = aggregateMetrics(messages);

  // Build ChatAnalytics data
  const analytics: ChatAnalytics = {
    messages,
    participants,
    monthYearStats,
    dateRange: {
      start: messages[0].timestamp,
      end: messages[messages.length - 1].timestamp,
    },
    totalMessages: messages.length,
    mediaMessagesCount,
  };

  return {
    success: true,
    data: analytics,
    mediaMessagesCount,
  };
}


// Auto-detect participants from messages and create Participant objects
export function detectParticipants(messages: ParsedMessage[]): Participant[] {
  const participantMap = new Map<string, number>();
  
  // Count messages per participant
  messages.forEach((msg) => {
    if (isValidMessage(msg)) {
      const count = participantMap.get(msg.sender) || 0;
      participantMap.set(msg.sender, count + 1);
    }
  });
  
  // Generate colors for participants
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  
  // Create Participant objects
  const participants: Participant[] = [];
  let colorIndex = 0;
  
  participantMap.forEach((messageCount, name) => {
    participants.push({
      name,
      messageCount,
      color: colors[colorIndex % colors.length]
    });
    colorIndex++;
  });
  
  return participants;
}
