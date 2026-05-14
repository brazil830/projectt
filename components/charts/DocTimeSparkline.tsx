'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const data = [
  { day: 'Mon', minutes: 8.2 },
  { day: 'Tue', minutes: 6.4 },
  { day: 'Wed', minutes: 5.1 },
  { day: 'Thu', minutes: 4.8 },
  { day: 'Fri', minutes: 4.2 },
  { day: 'Mon', minutes: 3.9 },
  { day: 'Tue', minutes: 4.1 },
  { day: 'Wed', minutes: 3.7 },
  { day: 'Thu', minutes: 3.5 },
  { day: 'Fri', minutes: 3.3 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-2 py-1 shadow-lg">
        <p className="text-xs font-mono-data text-primary">{payload[0].value} min</p>
      </div>
    );
  }
  return null;
};

export default function DocTimeSparkline() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="docTimeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="minutes"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#docTimeGrad)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--primary)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}