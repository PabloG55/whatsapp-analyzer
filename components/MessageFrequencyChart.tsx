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

interface MessageFrequencyChartProps {
  data: Array<{
    monthYear: string;
    [participantName: string]: string | number;
  }>;
  participants: Participant[];
}

export default function MessageFrequencyChart({
  data,
  participants,
}: MessageFrequencyChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthYear" />
        <YAxis />
        <Tooltip />
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
