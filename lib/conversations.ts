import type { ParsedMessage } from "./types";

const MINUTE_MS = 60 * 1000;

export const CONVERSATION_DEAD_GAP_MINUTES = 8 * 60;

export interface ConversationSession {
  sessionId: number;
  startIndex: number;
  endIndex: number;
  starter: string;
  startedAt: Date;
  monthYear: string;
  precedingGapMinutes: number | null;
}

export function buildConversationSessions(
  messages: ParsedMessage[],
  deadGapMinutes: number = CONVERSATION_DEAD_GAP_MINUTES
): {
  sessions: ConversationSession[];
  messageToSession: number[];
} {
  if (messages.length === 0) {
    return { sessions: [], messageToSession: [] };
  }

  const thresholdMs = deadGapMinutes * MINUTE_MS;
  const messageToSession: number[] = new Array(messages.length);
  const sessions: ConversationSession[] = [];

  let currentSessionId = 0;
  let currentSessionStartIndex = 0;
  messageToSession[0] = currentSessionId;

  for (let i = 1; i < messages.length; i++) {
    const gapMs = messages[i].timestamp.getTime() - messages[i - 1].timestamp.getTime();

    if (gapMs > thresholdMs) {
      sessions.push(
        createSession(messages, currentSessionId, currentSessionStartIndex, i - 1)
      );
      currentSessionId += 1;
      currentSessionStartIndex = i;
    }

    messageToSession[i] = currentSessionId;
  }

  sessions.push(
    createSession(
      messages,
      currentSessionId,
      currentSessionStartIndex,
      messages.length - 1
    )
  );

  return { sessions, messageToSession };
}

function createSession(
  messages: ParsedMessage[],
  sessionId: number,
  startIndex: number,
  endIndex: number
): ConversationSession {
  const startMessage = messages[startIndex];
  const precedingGapMinutes =
    startIndex === 0
      ? null
      : (startMessage.timestamp.getTime() - messages[startIndex - 1].timestamp.getTime()) /
        MINUTE_MS;

  return {
    sessionId,
    startIndex,
    endIndex,
    starter: startMessage.sender,
    startedAt: startMessage.timestamp,
    monthYear: startMessage.monthYear,
    precedingGapMinutes,
  };
}

export function groupConversationStartsByMonth(
  sessions: ConversationSession[]
): Map<string, Record<string, number>> {
  const startsByMonth = new Map<string, Record<string, number>>();

  sessions.forEach((session) => {
    if (!startsByMonth.has(session.monthYear)) {
      startsByMonth.set(session.monthYear, {});
    }

    const monthData = startsByMonth.get(session.monthYear)!;
    monthData[session.starter] = (monthData[session.starter] || 0) + 1;
  });

  return startsByMonth;
}

export function countConversationStartsBySender(
  sessions: ConversationSession[]
): Record<string, number> {
  const startsBySender: Record<string, number> = {};

  sessions.forEach((session) => {
    startsBySender[session.starter] = (startsBySender[session.starter] || 0) + 1;
  });

  return startsBySender;
}
