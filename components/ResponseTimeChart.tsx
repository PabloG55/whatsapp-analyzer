"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Participant } from "@/lib/types";

interface ResponseTimeChartProps {
  data: Array<{
    monthYear: string;
    [participantName: string]: string | number;
  }>;
  participants: Participant[];
}

export default function ResponseTimeChart({
  data,
  participants,
}: ResponseTimeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="monthYear" />
        <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => (value ? `${Number(value).toFixed(1)} min` : "0 min")} />
        <Legend />
        {participants.map((participant) => (
          <Line
            key={participant.name}
            type="monotone"
            dataKey={participant.name}
            stroke={participant.color}
            strokeWidth={2}
            name={participant.name}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
