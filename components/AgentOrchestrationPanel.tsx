'use client';

import React from 'react';
import { Cpu, FileText, Code2, ShieldCheck, Calendar, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from '@/context/SessionContext';

interface AgentDef {
  id: string;
  sessionKey: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  taskByStatus: Record<string, string>;
  completedToday: number;
  avgLatency: string;
  color: string;
  bgColor: string;
}

const agentDefs: AgentDef[] = [
  {
    id: 'agent-documentation',
    sessionKey: 'documentation',
    name: 'Documentation Agent',
    type: 'NLP / Medical LLM',
    icon: <FileText size={14} />,
    taskByStatus: { running: 'Generating SOAP note · enc-002', done: 'SOAP note complete · enc-002', idle: 'Awaiting voice capture', error: 'Error — retrying' },
    completedToday: 18,
    avgLatency: '1.2s',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10 border-purple-400/20',
  },
  {
    id: 'agent-coding',
    sessionKey: 'coding',
    name: 'Medical Coding Agent',
    type: 'ICD-10 / CPT / E&M',
    icon: <Code2 size={14} />,
    taskByStatus: { running: 'ICD-10 mapping · enc-005', done: 'Codes approved · enc-005', idle: 'Awaiting SOAP finalization', error: 'Coding conflict — review needed' },
    completedToday: 14,
    avgLatency: '0.8s',
    color: 'text-primary',
    bgColor: 'bg-primary/10 border-primary/20',
  },
  {
    id: 'agent-auth',
    sessionKey: 'priorAuth',
    name: 'Prior Auth Agent',
    type: 'Payer API / Rules Engine',
    icon: <ShieldCheck size={14} />,
    taskByStatus: { running: 'Submitting auth · enc-004 BlueCross', done: 'Auth submitted · enc-004', idle: 'No pending authorizations', error: '⚠ Auth denied · enc-004 BlueCross' },
    completedToday: 7,
    avgLatency: '3.4s',
    color: 'text-warning',
    bgColor: 'bg-warning/10 border-warning/20',
  },
  {
    id: 'agent-scheduling',
    sessionKey: 'scheduling',
    name: 'Scheduling Agent',
    type: 'Calendar / FHIR',
    icon: <Calendar size={14} />,
    taskByStatus: { running: 'Optimizing schedule · afternoon slots', done: 'Schedule optimized', idle: 'Awaiting next encounter', error: 'Scheduling conflict detected' },
    completedToday: 22,
    avgLatency: '0.4s',
    color: 'text-success',
    bgColor: 'bg-success/10 border-success/20',
  },
  {
    id: 'agent-threat',
    sessionKey: 'threatDetection',
    name: 'Threat Detection Agent',
    type: 'Zero-Trust / Post-Quantum',
    icon: <AlertTriangle size={14} />,
    taskByStatus: { running: 'Monitoring · 0 anomalies detected', done: 'Scan complete · all clear', idle: 'Standby', error: '⚠ Anomaly detected — investigating' },
    completedToday: 0,
    avgLatency: '32ms',
    color: 'text-danger',
    bgColor: 'bg-danger/10 border-danger/20',
  },
];

const statusDotMap: Record<string, string> = {
  running: 'bg-primary animate-pulse',
  done: 'bg-success',
  idle: 'bg-muted-foreground',
  error: 'bg-warning animate-pulse',
};

const statusLabelMap: Record<string, string> = {
  running: 'Processing',
  done: 'Done',
  idle: 'Idle',
  error: 'Alert',
};

export default function AgentOrchestrationPanel() {
  const { agentStatuses } = useSession();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const activeCount = Object.values(agentStatuses).filter((s) => s === 'running').length;

  const selectedAgent = agentDefs.find(a => a.id === selectedAgentId);
  const selectedStatus = selectedAgent ? (agentStatuses[selectedAgent.sessionKey] ?? 'idle') : 'idle';

  // Dynamic log generator
  useEffect(() => {
    if (!selectedAgent || selectedStatus !== 'running') return;

    const logInterval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false });
      const actions = [
        `Processing data stream chunk_${Math.floor(Math.random() * 1000)}`,
        'Validating clinical ruleset matches',
        'Cross-referencing EMR history',
        'Optimizing inference parameters',
        'Syncing with local knowledge base',
        'Applying HIPAA privacy masks'
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLogs(prev => [...prev.slice(-15), `[${timestamp}] ${randomAction}`]);
    }, 3000);

    return () => clearInterval(logInterval);
  }, [selectedAgent, selectedStatus]);

  // Initial logs when agent is selected
  useEffect(() => {
    if (selectedAgent) {
      setLogs([
        `[${new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}] Initializing ${selectedAgent.name}...`,
        `[${new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}] System check: OK`,
        `[${new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}] Session token validated`
      ]);
    } else {
      setLogs([]);
    }
  }, [selectedAgentId]);

  if (selectedAgent) {
    return (
      <div className="card-base overflow-hidden fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedAgentId(null)}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <TrendingUp size={16} className="-rotate-90" />
            </button>
            <div className={`p-1.5 rounded-md ${selectedAgent.bgColor} ${selectedAgent.color}`}>
              {selectedAgent.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{selectedAgent.name}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedAgent.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedAgent.bgColor} ${selectedAgent.color}`}>
              {statusLabelMap[selectedStatus]}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-secondary/10 border border-border/50">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">Throughput</p>
              <p className="text-lg font-bold text-foreground">{selectedAgent.completedToday} <span className="text-[10px] font-normal text-muted-foreground">tasks</span></p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10 border border-border/50">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">Latency</p>
              <p className="text-lg font-bold text-foreground">{selectedAgent.avgLatency}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10 border border-border/50">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-tighter">Error Rate</p>
              <p className="text-lg font-bold text-foreground">0.2%</p>
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={10} className="text-primary" />
              Real-time Activity Log
            </h4>
            <div className="bg-background rounded-lg border border-border p-3 font-mono-data text-[10px] space-y-1.5 min-h-[200px] max-h-[300px] overflow-y-auto scrollbar-thin">
              {logs.map((log, i) => (
                <p key={i} className={log.includes('Initializing') || log.includes('validated') ? 'text-success' : 'text-muted-foreground'}>
                  {log}
                </p>
              ))}
              <p className="text-primary animate-pulse mt-2">
                [LOGS] {selectedAgent.taskByStatus[selectedStatus]}
              </p>
              <p className="text-primary/50 text-[8px] animate-pulse">
                &gt; LISTENING FOR SYSTEM EVENTS...
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={() => {
                setLogs([`[${new Date().toLocaleTimeString([], { hour12: false })}] REBOOTING SYSTEM...`]);
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 2000)),
                  {
                    loading: `Restarting ${selectedAgent.name}...`,
                    success: () => {
                      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString([], { hour12: false })}] Agent successfully restored and active`]);
                      return 'Agent rebooted and session restored';
                    },
                    error: 'Failed to restart agent',
                  }
                );
              }}
              className="btn-primary text-[10px] py-1.5 px-3"
            >
              Restart Agent
            </button>
            <button 
              onClick={() => toast.info(`Viewing documentation for ${selectedAgent.type}`)}
              className="btn-secondary text-[10px] py-1.5 px-3"
            >
              View Documentation
            </button>
            <button 
              onClick={() => {
                toast.error(`${selectedAgent.name} session terminated`);
                setSelectedAgentId(null);
              }}
              className="text-[10px] text-danger hover:underline ml-auto"
            >
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Agent Orchestration</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-medium">{activeCount} Running</span>
        </div>
      </div>
      <div className="p-3 space-y-2">
        {agentDefs.map((agent) => {
          const status = agentStatuses[agent.sessionKey] ?? 'idle';
          const task = agent.taskByStatus[status] ?? agent.taskByStatus['idle'];
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] ${agent.bgColor}`}
            >
              <div className={`p-1.5 rounded-md ${agent.bgColor} ${agent.color} flex-shrink-0 mt-0.5`}>
                {agent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={`text-xs font-semibold ${agent.color}`}>{agent.name}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDotMap[status]}`} />
                    <span className="text-xs text-muted-foreground">{statusLabelMap[status]}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{task}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-muted-foreground">
                    <span className="font-mono-data text-foreground/70">{agent.completedToday}</span> today
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <span className="font-mono-data text-foreground/70">{agent.avgLatency}</span> avg
                  </span>
                </div>
              </div>
              <ChevronRight size={12} className="text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}