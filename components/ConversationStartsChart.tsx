"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Participant } from "@/lib/types";

interface ConversationStartsChartProps {
  data: Array<{
    monthYear: string;
    [participantName: string]: string | number;
  }>;
  participants: Participant[];
  isOneToOneChat: boolean;
}

export default function ConversationStartsChart({
  data,
  participants,
  isOneToOneChat,
}: ConversationStartsChartProps) {
  if (!isOneToOneChat) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground text-center">
        Conversation starts are available for 1:1 chats only.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthYear" />
        <YAxis allowDecimals={false} />
        <Tooltip formatter={(value) => `${Number(value)} starts`} />
        <Legend />
        {participants.map((participant) => (
          <Bar
            key={participant.name}
            dataKey={participant.name}
            fill={participant.color}
            name={participant.name}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
