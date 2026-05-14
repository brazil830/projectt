'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const modelData: Record<string, Array<{ week: string; actual: number; predicted: number }>> = {
  cardiac: [
    { week: 'W-8', actual: 78, predicted: 78 },
    { week: 'W-6', actual: 76, predicted: 77 },
    { week: 'W-4', actual: 75, predicted: 76 },
    { week: 'W-2', actual: 74, predicted: 74 },
    { week: 'Now', actual: 72, predicted: 72 },
    { week: 'W+2', actual: 0, predicted: 74 },
    { week: 'W+4', actual: 0, predicted: 76 },
    { week: 'W+8', actual: 0, predicted: 80 },
  ],
  renal: [
    { week: 'W-8', actual: 90, predicted: 90 },
    { week: 'W-6', actual: 91, predicted: 91 },
    { week: 'W-4', actual: 91, predicted: 91 },
    { week: 'W-2', actual: 92, predicted: 91 },
    { week: 'Now', actual: 91, predicted: 91 },
    { week: 'W+2', actual: 0, predicted: 91 },
    { week: 'W+4', actual: 0, predicted: 90 },
    { week: 'W+8', actual: 0, predicted: 89 },
  ],
  metabolic: [
    { week: 'W-8', actual: 72, predicted: 72 },
    { week: 'W-6', actual: 70, predicted: 71 },
    { week: 'W-4', actual: 69, predicted: 70 },
    { week: 'W-2', actual: 68, predicted: 68 },
    { week: 'Now', actual: 68, predicted: 68 },
    { week: 'W+2', actual: 0, predicted: 70 },
    { week: 'W+4', actual: 0, predicted: 73 },
    { week: 'W+8', actual: 0, predicted: 76 },
  ],
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-2 py-1.5 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {payload.map((p) =>
          p.value > 0 ? (
            <p key={`tt-${p.name}`} className="text-xs font-mono-data" style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ) : null
        )}
      </div>
    );
  }
  return null;
};

export default function DigitalTwinChart({ model }: { model: 'cardiac' | 'renal' | 'metabolic' }) {
  const data = modelData[model];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="twinGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--warning)" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} domain={[60, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x="Now" stroke="var(--border)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--primary)' }}
          activeDot={{ r: 4 }}
          connectNulls={false}
          name="Actual"
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="var(--warning)"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4 }}
          name="Predicted"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}