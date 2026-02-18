// Core data structures for WhatsApp chat analysis

export interface ParsedMessage {
  date: string; // MM/DD/YYYY format
  time: string; // HH:MM AM/PM format
  sender: string;
  content: string;
  timestamp: Date; // Parsed JavaScript Date object
  hour: number; // 0-23 for active hours analysis
  monthYear: string; // "Oct 2025" format for grouping
}

export interface Participant {
  name: string;
  messageCount: number;
  color: string; // For charts
}

export interface MonthYearStats {
  monthYear: string;
  messageFrequency: Record<string, number>; // participant name -> count
  averageResponseTime: Record<string, number>; // participant name -> avg ms
  conversationStarts: Record<string, number>; // participant name -> conversation starts (1:1 only)
  activeHours: Record<number, number>; // hour (0-23) -> message count
  activeHoursByParticipant: Record<string, Record<number, number>>; // participant -> hour -> count
  longestTimeWithoutAnswering: Record<string, number>; // participant name -> longest gap in minutes
  longestGapContext: Record<string, LongestGapContext>; // participant name -> gap context
}

export interface LongestGapContext {
  gapMinutes: number;
  lastMessageReceived: ParsedMessage;
  firstResponseSent: ParsedMessage;
  conversationBefore: ParsedMessage[]; // 3 messages before the gap
  conversationAfter: ParsedMessage[]; // 3 messages after the response
}

export interface ChatAnalytics {
  participants: Participant[];
  messages: ParsedMessage[];
  monthYearStats: MonthYearStats[];
  dateRange: {
    start: Date;
    end: Date;
  };
  totalMessages: number;
  mediaMessagesCount: number; // Count of media messages
}

export interface ParsingResult {
  success: boolean;
  data?: ChatAnalytics;
  error?: string;
  errorLine?: number;
  mediaMessagesCount?: number; // Count of filtered media messages
}

// Type for system messages that should be filtered out
export interface SystemMessage {
  type: "system";
  content: string;
  timestamp?: Date;
}

// Union type for all message types
export type MessageType = ParsedMessage | SystemMessage;
