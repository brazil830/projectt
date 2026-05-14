'use client';

import React, { useState } from 'react';
import { Activity, Lock, Eye, FileText, Code2, Shield, ChevronRight, ExternalLink } from 'lucide-react';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  txHash: string;
  blockHeight: number;
  riskScore: number;
  verified: boolean;
}

const auditEvents: AuditEvent[] = [
  {
    id: 'audit-001',
    timestamp: '18:17:43',
    actor: 'Dr. Rachel Okonkwo',
    role: 'Attending',
    action: 'SOAP_NOTE_FINALIZED',
    resource: 'Encounter',
    resourceId: 'enc-001',
    ipAddress: '10.4.22.18',
    txHash: '0x7f3a...d8c2',
    blockHeight: 4829103,
    riskScore: 0,
    verified: true,
  },
  {
    id: 'audit-002',
    timestamp: '18:16:21',
    actor: 'CodingAgent-v2',
    role: 'AI Agent',
    action: 'ICD10_CODE_ASSIGNED',
    resource: 'MedCode',
    resourceId: 'Z87.891',
    ipAddress: 'agent-internal',
    txHash: '0x2b9e...f104',
    blockHeight: 4829101,
    riskScore: 0,
    verified: true,
  },
  {
    id: 'audit-003',
    timestamp: '18:14:09',
    actor: 'AuthAgent-v1',
    role: 'AI Agent',
    action: 'PRIOR_AUTH_SUBMITTED',
    resource: 'Authorization',
    resourceId: 'auth-enc-004',
    ipAddress: 'agent-internal',
    txHash: '0xc41f...8a3d',
    blockHeight: 4829098,
    riskScore: 2,
    verified: true,
  },
  {
    id: 'audit-004',
    timestamp: '18:11:55',
    actor: 'Dr. Rachel Okonkwo',
    role: 'Attending',
    action: 'PATIENT_RECORD_ACCESSED',
    resource: 'Patient',
    resourceId: 'MRN-198432',
    ipAddress: '10.4.22.18',
    txHash: '0x9d7b...2e56',
    blockHeight: 4829094,
    riskScore: 1,
    verified: true,
  },
  {
    id: 'audit-005',
    timestamp: '18:09:33',
    actor: 'ThreatAgent-v3',
    role: 'AI Agent',
    action: 'ANOMALY_SCAN_COMPLETE',
    resource: 'Security',
    resourceId: 'session-4f8a',
    ipAddress: 'agent-internal',
    txHash: '0x5c3a...9f01',
    blockHeight: 4829091,
    riskScore: 0,
    verified: true,
  },
  {
    id: 'audit-006',
    timestamp: '18:07:12',
    actor: 'Dr. Rachel Okonkwo',
    role: 'Attending',
    action: 'VOICE_SESSION_PURGED',
    resource: 'PHI',
    resourceId: 'enc-002',
    ipAddress: '10.4.22.18',
    txHash: '0x1e8f...c723',
    blockHeight: 4829088,
    riskScore: 0,
    verified: true,
  },
  {
    id: 'audit-007',
    timestamp: '18:04:47',
    actor: 'EMR-Adapter-Epic',
    role: 'System',
    action: 'FHIR_SYNC_COMPLETED',
    resource: 'Encounter',
    resourceId: 'enc-009',
    ipAddress: '172.16.8.4',
    txHash: '0xd2c9...7b44',
    blockHeight: 4829085,
    riskScore: 0,
    verified: true,
  },
];

const actionIcons: Record<string, React.ReactNode> = {
  SOAP_NOTE_FINALIZED: <FileText size={12} className="text-success" />,
  ICD10_CODE_ASSIGNED: <Code2 size={12} className="text-primary" />,
  PRIOR_AUTH_SUBMITTED: <Shield size={12} className="text-warning" />,
  PATIENT_RECORD_ACCESSED: <Eye size={12} style={{ color: 'rgb(var(--info))' }} />,
  ANOMALY_SCAN_COMPLETE: <Lock size={12} className="text-success" />,
  VOICE_SESSION_PURGED: <Lock size={12} className="text-success" />,
  FHIR_SYNC_COMPLETED: <Activity size={12} className="text-primary" />,
};

const riskColor = (score: number) => {
  if (score === 0) return 'text-success';
  if (score <= 2) return 'text-warning';
  return 'text-danger';
};

export default function AuditLedgerFeed() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Blockchain Audit Ledger</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="hipaa-badge px-2 py-0.5 rounded-full text-xs font-medium">
            Tamper-Proof
          </span>
          <button className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            View All <ExternalLink size={11} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {auditEvents.map((event) => (
          <div key={event.id} className="group">
            <button
              className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-secondary/30 transition-all duration-150 text-left"
              onClick={() => setExpanded(expanded === event.id ? null : event.id)}
            >
              <div className="flex-shrink-0 mt-0.5 p-1 rounded bg-muted/50">
                {actionIcons[event.action] || <Activity size={12} className="text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground truncate">
                    {event.action.replace(/_/g, ' ')}
                  </p>
                  <span className="text-xs font-mono-data text-muted-foreground flex-shrink-0">
                    {event.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{event.actor}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs font-mono-data text-muted-foreground">{event.resourceId}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-mono-data ${riskColor(event.riskScore)}`}>
                  R:{event.riskScore}
                </span>
                <ChevronRight
                  size={12}
                  className={`text-muted-foreground transition-transform duration-150 ${expanded === event.id ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {expanded === event.id && (
              <div className="fade-in px-4 pb-3 pt-0 bg-muted/20 border-t border-border/30">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                  {[
                    { label: 'TX Hash', value: event.txHash },
                    { label: 'Block Height', value: event.blockHeight.toLocaleString() },
                    { label: 'IP Address', value: event.ipAddress },
                    { label: 'Risk Score', value: `${event.riskScore}/10` },
                    { label: 'Verified', value: event.verified ? '✓ On-chain verified' : 'Unverified' },
                    { label: 'Role', value: event.role },
                  ].map(({ label, value }) => (
                    <div key={`${event.id}-${label}`} className="flex gap-2">
                      <span className="text-xs text-muted-foreground w-24 flex-shrink-0">{label}:</span>
                      <span className="text-xs font-mono-data text-foreground/80">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Block <span className="font-mono-data text-foreground/70">4,829,103</span> · Hash-only on-chain · PHI off-chain
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">Live</span>
        </div>
      </div>
    </div>
  );
}