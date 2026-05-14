'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  time: string;
  source: string;
}

const alerts: Alert[] = [
  {
    id: 'alt-001',
    type: 'Critical',
    title: 'Prior Authorization Denied',
    description: 'Authorization for MRI scan denied by BlueCross. Requires clinical justification.',
    time: '5 min ago',
    source: 'Prior Auth Agent',
  },
  {
    id: 'alt-002',
    type: 'Warning',
    title: 'Coding Conflict Detected',
    description: 'ICD-10 code conflict detected for patient MRN-287603. Manual review required.',
    time: '15 min ago',
    source: 'Medical Coding Agent',
  },
  {
    id: 'alt-003',
    type: 'Info',
    title: 'System Update Available',
    description: 'New security patch available. Scheduled maintenance window: 2:00 AM - 4:00 AM.',
    time: '1 hour ago',
    source: 'System',
  },
  {
    id: 'alt-004',
    type: 'Warning',
    title: 'Patient No-Show Alert',
    description:
      'Patient Margaret Thornton missed scheduled appointment. Automated follow-up initiated.',
    time: '2 hours ago',
    source: 'Scheduling Agent',
  },
];

const typeConfig: Record<string, { icon: React.ReactNode; cls: string; bg: string }> = {
  Critical: {
    icon: <XCircle size={14} />,
    cls: 'text-danger',
    bg: 'bg-danger/10 border-danger/20',
  },
  Warning: {
    icon: <AlertTriangle size={14} />,
    cls: 'text-warning',
    bg: 'bg-warning/10 border-warning/20',
  },
  Info: {
    icon: <Activity size={14} />,
    cls: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
  },
};

export default function AlertsDashboard() {
  const handleMarkAllRead = () => {
    toast.success('All alerts marked as read');
  };

  const handleAlertClick = (alert: (typeof alerts)[0]) => {
    toast.success(`Viewing alert: ${alert.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-danger">1</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
            <XCircle className="text-danger" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">2</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
            <AlertTriangle className="text-warning" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">1</p>
              <p className="text-xs text-muted-foreground">Info</p>
            </div>
            <Activity className="text-primary" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">4</p>
              <p className="text-xs text-muted-foreground">Resolved Today</p>
            </div>
            <CheckCircle className="text-success" size={20} />
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
          </div>
          <button onClick={handleMarkAllRead} className="btn-secondary text-xs">
            Mark All Read
          </button>
        </div>

        <div className="divide-y divide-border/50">
          {alerts.map((alert) => {
            const tcfg = typeConfig[alert.type];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-4 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer border-l-4 ${tcfg.bg.replace('/10', '')}`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-secondary/30">
                  <span className={tcfg.cls}>{tcfg.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">{alert.title}</p>
                    <span className={`badge-${alert.type.toLowerCase()}`}>{alert.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{alert.source}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
