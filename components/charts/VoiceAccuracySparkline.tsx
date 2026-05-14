'use client';

import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { day: 'day-1', acc: 97.1 },
  { day: 'day-2', acc: 97.4 },
  { day: 'day-3', acc: 96.8 },
  { day: 'day-4', acc: 97.9 },
  { day: 'day-5', acc: 98.0 },
  { day: 'day-6', acc: 97.6 },
  { day: 'day-7', acc: 98.2 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-2 py-1 shadow-lg">
        <p className="text-xs font-mono-data text-success">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function VoiceAccuracySparkline() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="acc"
          stroke="var(--success)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: 'var(--success)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}