"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import type { LongestGapContext } from "@/lib/types";

interface ConversationSnippetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: LongestGapContext | null;
  participantName: string;
  participantColor: string;
}

export default function ConversationSnippetModal({
  open,
  onOpenChange,
  context,
  participantName,
  participantColor,
}: ConversationSnippetModalProps) {
  if (!context) return null;

  const formatGap = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} minutes`;
    } else if (minutes < 1440) {
      const hours = (minutes / 60).toFixed(1);
      return `${hours} hours`;
    } else {
      const days = (minutes / 1440).toFixed(1);
      return `${days} days`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Longest Response Gap
          </DialogTitle>
          <DialogDescription>
            <span style={{ color: participantColor }} className="font-semibold">
              {participantName}
            </span>{" "}
            took <strong>{formatGap(context.gapMinutes)}</strong> to respond
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Messages before the gap */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Conversation before:</p>
            <div className="space-y-2">
              {context.conversationBefore.map((msg, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-muted/50 border"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(msg.timestamp, "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The gap indicator */}
          <div className="flex flex-col items-center gap-2 py-4">
            <Separator />
            <Badge variant="destructive" className="text-sm px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {formatGap(context.gapMinutes)} gap
            </Badge>
            <ArrowDown className="w-5 h-5 text-muted-foreground animate-bounce" />
            <Separator />
          </div>

          {/* Last message received (trigger) */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Last message received:</p>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-sm">{context.lastMessageReceived.sender}</span>
                <span className="text-xs text-muted-foreground">
                  {format(context.lastMessageReceived.timestamp, "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{context.lastMessageReceived.content}</p>
            </div>
          </div>

          {/* First response sent */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">First response:</p>
            <div
              className="p-3 rounded-lg border-2"
              style={{ borderColor: participantColor, backgroundColor: `${participantColor}10` }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-medium text-sm" style={{ color: participantColor }}>
                  {context.firstResponseSent.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(context.firstResponseSent.timestamp, "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{context.firstResponseSent.content}</p>
            </div>
          </div>

          {/* Messages after the response */}
          {context.conversationAfter.length > 1 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Conversation after:</p>
              <div className="space-y-2">
                {context.conversationAfter.slice(1).map((msg, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-muted/50 border"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-sm">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(msg.timestamp, "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
