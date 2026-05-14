'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Mic, Code2, ShieldCheck, AlertTriangle, Zap, TrendingDown, TrendingUp, CheckCircle } from 'lucide-react';

const VoiceAccuracySparkline = dynamic(
  () => import('./charts/VoiceAccuracySparkline'),
  { ssr: false, loading: () => <div className="h-16 animate-pulse bg-muted rounded" /> }
);

const DocTimeSparkline = dynamic(
  () => import('./charts/DocTimeSparkline'),
  { ssr: false, loading: () => <div className="h-16 animate-pulse bg-muted rounded" /> }
);

export default function MetricsBentoGrid() {
  return (
    // 8 cards → grid-cols-4 → row 1: hero (spans 2) + 2 regular, row 2: 4 regular
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-4">

      {/* HERO: Documentation Time Reduction (spans 2 cols) */}
      <div className="card-base p-5 lg:col-span-2 relative overflow-hidden">
        <div className="blob-primary absolute -top-8 -right-8 w-40 h-40 pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                Avg Documentation Time
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">vs. 15.2 min industry baseline</p>
            </div>
            <span className="badge-success">
              <TrendingDown size={10} />
              <span>−78%</span>
            </span>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-bold text-foreground font-mono-data">3.3</span>
            <span className="text-lg text-muted-foreground mb-1">min</span>
          </div>
          <div className="h-16">
            <DocTimeSparkline />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-success font-medium">Target achieved</span> · 70% reduction goal met
          </p>
        </div>
      </div>

      {/* Voice-to-Text Accuracy */}
      <div className="card-base p-5 relative overflow-hidden">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Mic size={16} className="text-primary" />
          </div>
          <span className="badge-success">
            <TrendingUp size={10} />
            <span>+0.4%</span>
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1">
          Voice Accuracy
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold text-foreground font-mono-data">98.2</span>
          <span className="text-base text-muted-foreground mb-0.5">%</span>
        </div>
        <div className="h-12">
          <VoiceAccuracySparkline />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Zero-edit transcriptions today</p>
      </div>

      {/* Coding Queue */}
      <div className="card-base p-5 border-warning/20" style={{ borderColor: 'rgba(245,158,11,0.25)' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
            <Code2 size={16} className="text-warning" />
          </div>
          <span className="badge-warning">
            <AlertTriangle size={10} />
            <span>2 Flagged</span>
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1">
          Coding Queue
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold text-foreground font-mono-data">14</span>
          <span className="text-sm text-muted-foreground mb-0.5">codes pending</span>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="flex-1 bg-success/20 rounded px-2 py-1 text-center">
            <p className="text-xs font-semibold text-success">12</p>
            <p className="text-xs text-muted-foreground">Auto-accepted</p>
          </div>
          <div className="flex-1 bg-warning/20 rounded px-2 py-1 text-center">
            <p className="text-xs font-semibold text-warning">2</p>
            <p className="text-xs text-muted-foreground">Review</p>
          </div>
        </div>
      </div>

      {/* Encounters Today */}
      <div className="card-base p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-success/10 border border-success/20">
            <Stethoscope size={16} className="text-success" />
          </div>
          <span className="badge-info">Today</span>
        </div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1">
          Encounters
        </p>
        <div className="flex items-end gap-1 mb-3">
          <span className="text-3xl font-bold text-foreground font-mono-data">18</span>
          <span className="text-sm text-muted-foreground mb-0.5">/ 22 scheduled</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all duration-700" style={{ width: '81%' }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">4 remaining · Est. 1h 12m</p>
      </div>

      {/* Prior Auth */}
      <div className="card-base p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
            <ShieldCheck size={16} className="text-accent" />
          </div>
          <span className="badge-warning">7 Pending</span>
        </div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1">
          Prior Authorizations
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold text-foreground font-mono-data">91</span>
          <span className="text-base text-muted-foreground mb-0.5">%</span>
        </div>
        <p className="text-xs text-muted-foreground">First-pass approval rate</p>
        <div className="flex items-center gap-1 mt-2">
          <CheckCircle size={11} className="text-success" />
          <span className="text-xs text-success">3 approved today</span>
        </div>
      </div>

      {/* PHI Compliance */}
      <div className="card-base p-5 border-success/20" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle size={16} className="text-success" />
          </div>
          <span className="phi-badge px-2 py-0.5 rounded-full text-xs font-medium">HIPAA</span>
        </div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1">
          PHI Zero-Retention
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold text-success font-mono-data">0</span>
          <span className="text-sm text-muted-foreground mb-0.5">records stored</span>
        </div>
        <p className="text-xs text-muted-foreground">Last purge: <span className="font-mono-data text-success">0.8s</span> ago</p>
      </div>

      {/* Threat Detection */}
      <div className="card-base p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Zap size={16} className="text-primary" />
          </div>
          <span className="badge-info">
            <span>Active</span>
          </span>
        </div>
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1">
          Threat Detection
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-3xl font-bold text-foreground font-mono-data">32</span>
          <span className="text-base text-muted-foreground mb-0.5">ms</span>
        </div>
        <p className="text-xs text-muted-foreground">Avg response latency</p>
        <div className="flex items-center gap-1 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">0 threats today</span>
        </div>
      </div>
    </div>
  );
}

function Stethoscope({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}