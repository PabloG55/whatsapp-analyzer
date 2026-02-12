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

interface ActiveHoursChartProps {
  data: Array<{
    hour: number;
    [participantName: string]: number | string;
  }>;
  participants: Participant[];
}

export default function ActiveHoursChart({ data, participants }: ActiveHoursChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    );
  }

  // Format hour labels
  const formattedData = data.map((item) => ({
    ...item,
    hourLabel: `${item.hour.toString().padStart(2, "0")}:00`,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hourLabel" />
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
