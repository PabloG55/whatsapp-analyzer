"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Participant } from "@/lib/types";
import type { LongestGapContext } from "@/lib/types";
import ConversationSnippetModal from "./ConversationSnippetModal";

interface LongestResponseChartProps {
  data: Array<{
    monthYear: string;
    [participantName: string]: string | number;
  }>;
  participants: Participant[];
  gapContexts: Record<string, Record<string, LongestGapContext>>; // monthYear -> participant -> context
}

export default function LongestResponseChart({
  data,
  participants,
  gapContexts,
}: LongestResponseChartProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState<LongestGapContext | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    );
  }

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes.toFixed(0)} min`;
    } else if (minutes < 1440) {
      const hours = (minutes / 60).toFixed(1);
      return `${hours} hrs`;
    } else {
      const days = (minutes / 1440).toFixed(1);
      return `${days} days`;
    }
  };

  const handleBarClick = (data: any, participant: Participant) => {
    const monthYear = data.monthYear;
    const context = gapContexts[monthYear]?.[participant.name];
    
    if (context) {
      setSelectedContext(context);
      setSelectedParticipant(participant);
      setModalOpen(true);
    }
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => (value ? formatMinutes(Number(value)) : "0 min")} />
          <Legend />
          {participants.map((participant) => (
            <Bar
              key={participant.name}
              dataKey={participant.name}
              fill={participant.color}
              name={participant.name}
              onClick={(data) => handleBarClick(data, participant)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground mt-2 text-center">
        💡 Click on a bar to see the conversation context
      </p>

      <ConversationSnippetModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        context={selectedContext}
        participantName={selectedParticipant?.name || ""}
        participantColor={selectedParticipant?.color || "#000"}
      />
    </>
  );
}

