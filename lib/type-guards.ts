// Type guards for safe type narrowing

import type { MessageType, ParsedMessage, SystemMessage } from "./types";

export function isValidMessage(msg: MessageType): msg is ParsedMessage {
  return (
    "sender" in msg &&
    "content" in msg &&
    "timestamp" in msg &&
    "hour" in msg &&
    "monthYear" in msg
  );
}

export function isSystemMessage(msg: MessageType): msg is SystemMessage {
  return "type" in msg && msg.type === "system";
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// Type guard for parsed localStorage data
export function isValidChatAnalytics(data: unknown): data is {
  participants: unknown[];
  messages: unknown[];
  monthYearStats: unknown[];
  dateRange: { start: string; end: string };
  totalMessages: number;
} {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    Array.isArray(obj.participants) &&
    Array.isArray(obj.messages) &&
    Array.isArray(obj.monthYearStats) &&
    typeof obj.dateRange === "object" &&
    obj.dateRange !== null &&
    typeof (obj.dateRange as Record<string, unknown>).start === "string" &&
    typeof (obj.dateRange as Record<string, unknown>).end === "string" &&
    typeof obj.totalMessages === "number"
  );
}
