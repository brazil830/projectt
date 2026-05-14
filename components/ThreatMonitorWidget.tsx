'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Lock, Eye, AlertTriangle } from 'lucide-react';

interface ThreatEvent {
  id: string;
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high';
  message: string;
  time: string;
  resolved: boolean;
}

const recentEvents: ThreatEvent[] = [
  {
    id: 'threat-001',
    type: 'PHI_PURGE',
    severity: 'info',
    message: 'Voice session PHI purged successfully',
    time: '18:17',
    resolved: true,
  },
  {
    id: 'threat-002',
    type: 'ACCESS_ANOMALY',
    severity: 'low',
    message: 'Off-hours access pattern detected — flagged for review',
    time: '17:44',
    resolved: true,
  },
  {
    id: 'threat-003',
    type: 'CRYPTO_ROTATION',
    severity: 'info',
    message: 'Post-quantum key rotation completed',
    time: '16:00',
    resolved: true,
  },
];

export default function ThreatMonitorWidget() {
  const [latency, setLatency] = useState(32);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(28 + Math.random() * 12));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const severityColors: Record<string, string> = {
    info: 'text-primary',
    low: 'text-warning',
    medium: 'text-warning',
    high: 'text-danger',
  };

  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Threat Monitor</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">All Clear</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 border-b border-border">
        {[
          { label: 'Latency', value: `${latency}ms`, icon: <Zap size={12} />, color: 'text-primary' },
          { label: 'PHI Retained', value: '0 records', icon: <Lock size={12} />, color: 'text-success' },
          { label: 'Threats Today', value: '0', icon: <AlertTriangle size={12} />, color: 'text-success' },
        ].map(({ label, value, icon, color }) => (
          <div key={`metric-${label}`} className="flex flex-col items-center py-3 border-r border-border last:border-0">
            <div className={`flex items-center gap-1 ${color} mb-1`}>
              {icon}
              <span className="text-sm font-bold font-mono-data">{value}</span>
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Security Layers */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Security Layers</p>
        <div className="space-y-1.5">
          {[
            { label: 'Zero-Trust Architecture', status: 'Active' },
            { label: 'Post-Quantum Encryption', status: 'Active' },
            { label: 'Blockchain Audit Ledger', status: 'Active' },
            { label: 'PHI Zero-Retention', status: 'Enforced' },
          ].map(({ label, status }) => (
            <div key={`layer-${label}`} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Eye size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <span className="badge-success text-xs">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recent Events</p>
        <div className="space-y-2">
          {recentEvents.map((evt) => (
            <div key={evt.id} className="flex items-start gap-2">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${evt.resolved ? 'bg-success' : 'bg-warning animate-pulse'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${severityColors[evt.severity]} truncate`}>{evt.message}</p>
                <p className="text-xs text-muted-foreground font-mono-data">{evt.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}