'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { GitBranch, Activity, AlertTriangle, ChevronDown, ChevronUp, Pill } from 'lucide-react';

const DigitalTwinChart = dynamic(
  () => import('./charts/DigitalTwinChart'),
  { ssr: false, loading: () => <div className="h-28 animate-pulse bg-muted rounded" /> }
);

interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'none' | 'minor' | 'moderate' | 'major';
  description: string;
}

const drugInteractions: DrugInteraction[] = [
  {
    id: 'di-001',
    drug1: 'Amlodipine 5mg',
    drug2: 'Ibuprofen',
    severity: 'moderate',
    description: 'NSAIDs may reduce antihypertensive efficacy. Recommend discontinuing ibuprofen.',
  },
  {
    id: 'di-002',
    drug1: 'Atorvastatin 20mg',
    drug2: 'Amlodipine 5mg',
    severity: 'minor',
    description: 'Amlodipine may slightly increase atorvastatin exposure. Monitor for myopathy.',
  },
];

const severityConfig: Record<string, string> = {
  none: 'badge-success',
  minor: 'badge-info',
  moderate: 'badge-warning',
  major: 'badge-danger',
};

export default function DigitalTwinWidget() {
  const [expanded, setExpanded] = useState(false);
  const [activeModel, setActiveModel] = useState<'cardiac' | 'renal' | 'metabolic'>('cardiac');

  const modelScores = {
    cardiac: { score: 72, risk: 'Moderate', color: 'text-warning', trend: '-3 from last visit' },
    renal: { score: 91, risk: 'Low', color: 'text-success', trend: 'Stable' },
    metabolic: { score: 68, risk: 'Moderate', color: 'text-warning', trend: '+5 (lipids elevated)' },
  };

  const active = modelScores[activeModel];

  return (
    <div className="card-base overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-all duration-150"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Digital Twin Engine</h2>
          <span className="badge-info text-xs">Patient Model Active</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Cardiac Risk: <span className="text-warning font-semibold">Moderate</span>
          </span>
          {expanded ? <ChevronUp size={13} className="text-muted-foreground" /> : <ChevronDown size={13} className="text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="fade-in border-t border-border p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Model selector + score */}
            <div>
              <div className="flex gap-1 mb-3">
                {(['cardiac', 'renal', 'metabolic'] as const).map((m) => (
                  <button
                    key={`twin-model-${m}`}
                    onClick={() => setActiveModel(m)}
                    className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-all duration-150 ${
                      activeModel === m
                        ? 'bg-primary/20 text-primary border border-primary/30' :'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="var(--muted)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={active.color.includes('warning') ? 'var(--warning)' : 'var(--success)'}
                      strokeWidth="3"
                      strokeDasharray={`${active.score * 0.88} 88`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-xl font-bold font-mono-data ${active.color}`}>{active.score}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground capitalize">{activeModel} Model</p>
                  <p className={`text-sm font-semibold ${active.color}`}>{active.risk} Risk</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Activity size={11} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{active.trend}</span>
                  </div>
                </div>
              </div>

              <div className="h-28">
                <DigitalTwinChart model={activeModel} />
              </div>
            </div>

            {/* Drug interactions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pill size={13} className="text-warning" />
                <p className="text-xs font-semibold text-foreground">Drug Simulation Results</p>
                <span className="badge-warning text-xs">{drugInteractions.filter((d) => d.severity !== 'none').length} interactions</span>
              </div>
              <div className="space-y-2">
                {drugInteractions.map((di) => (
                  <div
                    key={di.id}
                    className={`p-3 rounded-lg border ${
                      di.severity === 'moderate' ? 'border-warning/30 bg-warning/5' :
                      di.severity === 'major'? 'border-danger/30 bg-danger/5' : 'border-border bg-muted/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-foreground">
                        {di.drug1} ↔ {di.drug2}
                      </p>
                      <span className={`${severityConfig[di.severity]} capitalize flex-shrink-0`}>
                        {di.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{di.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={12} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-primary leading-relaxed">
                    <span className="font-semibold">Digital Twin Prediction:</span> Initiating amlodipine 5mg + discontinuing ibuprofen projected to reduce BP to 128/82 within 8 weeks (97.2% model confidence).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}