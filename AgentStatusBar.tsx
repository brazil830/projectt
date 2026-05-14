'use client';

import React, { useState } from 'react';
import { Cpu, FileText, Code2, ShieldCheck, Calendar, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { useSession } from '@/context/SessionContext';

interface AgentBarDef {
  id: string;
  sessionKey: string;
  name: string;
  shortName: string;
  icon: React.ReactNode;
  color: string;
  dotColor: string;
  taskByStatus: Record<string, string>;
  progressByStatus: Record<string, number>;
}

const agentBarDefs: AgentBarDef[] = [
  {
    id: 'bar-agent-doc',
    sessionKey: 'documentation',
    name: 'Documentation Agent',
    shortName: 'Doc',
    icon: <FileText size={13} />,
    color: 'text-purple-400',
    dotColor: 'bg-purple-400',
    taskByStatus: { running: 'Transcribing voice input...', done: 'SOAP note generated', idle: 'Awaiting voice input', error: 'Transcription error' },
    progressByStatus: { running: 60, done: 100, idle: 0, error: 100 },
  },
  {
    id: 'bar-agent-coding',
    sessionKey: 'coding',
    name: 'Medical Coding Agent',
    shortName: 'Coding',
    icon: <Code2 size={13} />,
    color: 'text-primary',
    dotColor: 'bg-primary',
    taskByStatus: { running: 'Mapping ICD-10 codes from SOAP...', done: 'Codes mapped', idle: 'Awaiting SOAP', error: 'Coding conflict' },
    progressByStatus: { running: 75, done: 100, idle: 0, error: 100 },
  },
  {
    id: 'bar-agent-auth',
    sessionKey: 'priorAuth',
    name: 'Prior Auth Agent',
    shortName: 'Auth',
    icon: <ShieldCheck size={13} />,
    color: 'text-warning',
    dotColor: 'bg-warning',
    taskByStatus: { running: 'Submitting auth request...', done: 'Auth submitted', idle: 'No pending auth', error: '⚠ Auth denied — retry?' },
    progressByStatus: { running: 50, done: 100, idle: 0, error: 100 },
  },
  {
    id: 'bar-agent-sched',
    sessionKey: 'scheduling',
    name: 'Scheduling Agent',
    shortName: 'Schedule',
    icon: <Calendar size={13} />,
    color: 'text-success',
    dotColor: 'bg-success',
    taskByStatus: { running: 'Optimizing follow-up slots...', done: 'Follow-up booked: Jun 8', idle: 'Awaiting encounter', error: 'Scheduling conflict' },
    progressByStatus: { running: 80, done: 100, idle: 0, error: 100 },
  },
  {
    id: 'bar-agent-threat',
    sessionKey: 'threatDetection',
    name: 'Threat Detection Agent',
    shortName: 'Security',
    icon: <AlertTriangle size={13} />,
    color: 'text-danger',
    dotColor: 'bg-success',
    taskByStatus: { running: 'Monitoring session · 0 anomalies', done: 'Scan complete · all clear', idle: 'Standby', error: '⚠ Anomaly detected' },
    progressByStatus: { running: 100, done: 100, idle: 0, error: 100 },
  },
];

const statusDotMap: Record<string, string> = {
  running: 'bg-primary animate-pulse',
  done: 'bg-success',
  idle: 'bg-muted-foreground',
  error: 'bg-warning animate-pulse',
};

interface AgentStatusBarProps {
  isRecording: boolean;
}

export default function AgentStatusBar({ isRecording }: AgentStatusBarProps) {
  const [expanded, setExpanded] = useState(false);
  const { agentStatuses } = useSession();

  return (
    <div className="card-base overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/30 transition-all duration-150"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Cpu size={14} className="text-primary" />
          <span className="text-xs font-semibold text-foreground">Multi-Agent Orchestration</span>
          <div className="flex items-center gap-1.5">
            {agentBarDefs.map((a) => {
              const status = agentStatuses[a.sessionKey] ?? 'idle';
              return (
                <div key={`dot-${a.id}`} className={`w-2 h-2 rounded-full ${statusDotMap[status]}`} title={a.name} />
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            {agentBarDefs.map((a) => {
              const status = agentStatuses[a.sessionKey] ?? 'idle';
              return (
                <div key={`summary-${a.id}`} className="flex items-center gap-1">
                  <span className={`text-xs ${a.color}`}>{a.shortName}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusDotMap[status]}`} />
                </div>
              );
            })}
          </div>
          {expanded ? <ChevronDown size={13} className="text-muted-foreground" /> : <ChevronUp size={13} className="text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="fade-in border-t border-border px-4 py-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {agentBarDefs.map((agent) => {
            const status = agentStatuses[agent.sessionKey] ?? 'idle';
            const task = agent.taskByStatus[status] ?? agent.taskByStatus['idle'];
            const progress = agent.progressByStatus[status] ?? 0;
            const effectiveStatus = isRecording && agent.sessionKey === 'documentation' ? 'running' : status;
            const effectiveTask = isRecording && agent.sessionKey === 'documentation' ? 'Transcribing voice input...' : task;
            const effectiveProgress = isRecording && agent.sessionKey === 'documentation' ? 60 : progress;
            return (
              <div key={agent.id} className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-1.5 ${agent.color}`}>
                    {agent.icon}
                    <span className="text-xs font-semibold">{agent.shortName}</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${statusDotMap[effectiveStatus]}`} />
                </div>
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{effectiveTask}</p>
                {effectiveProgress > 0 && (
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        effectiveStatus === 'error' ? 'bg-warning' :
                        effectiveStatus === 'done' ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ width: `${effectiveProgress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}