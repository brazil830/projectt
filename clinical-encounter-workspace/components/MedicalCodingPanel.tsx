'use client';

import React, { useState } from 'react';
import { Code2, CheckCircle, AlertCircle, RefreshCw, Plus, Sparkles, Info } from 'lucide-react';
import { toast } from 'sonner';

interface MedCode {
  id: string;
  type: 'ICD-10' | 'CPT' | 'E&M';
  code: string;
  description: string;
  confidence: number;
  status: 'auto-accepted' | 'review' | 'rejected' | 'manual';
  modifier?: string;
  rvu?: number;
}

const suggestedCodes: MedCode[] = [
  {
    id: 'code-001',
    type: 'ICD-10',
    code: 'I10',
    description: 'Essential (primary) hypertension',
    confidence: 97,
    status: 'auto-accepted',
    rvu: undefined,
  },
  {
    id: 'code-002',
    type: 'ICD-10',
    code: 'E78.5',
    description: 'Hyperlipidemia, unspecified',
    confidence: 94,
    status: 'auto-accepted',
    rvu: undefined,
  },
  {
    id: 'code-003',
    type: 'ICD-10',
    code: 'R06.09',
    description: 'Other forms of dyspnea',
    confidence: 88,
    status: 'review',
    rvu: undefined,
  },
  {
    id: 'code-004',
    type: 'ICD-10',
    code: 'R51.9',
    description: 'Headache, unspecified',
    confidence: 91,
    status: 'auto-accepted',
    rvu: undefined,
  },
  {
    id: 'code-005',
    type: 'ICD-10',
    code: 'Z82.49',
    description: 'Family history of ischemic heart disease and other diseases of the circulatory system',
    confidence: 85,
    status: 'review',
    rvu: undefined,
  },
  {
    id: 'code-006',
    type: 'CPT',
    code: '99205',
    description: 'Office/outpatient visit, new patient — high medical decision making',
    confidence: 96,
    status: 'auto-accepted',
    modifier: '25',
    rvu: 3.17,
  },
  {
    id: 'code-007',
    type: 'CPT',
    code: '93306',
    description: 'Echocardiography, transthoracic, real-time with image documentation',
    confidence: 89,
    status: 'review',
    rvu: 2.78,
  },
  {
    id: 'code-008',
    type: 'E&M',
    code: '99205',
    description: 'E&M Level 5 — New Patient, High Complexity',
    confidence: 95,
    status: 'auto-accepted',
    rvu: 3.17,
  },
];

const typeColors: Record<string, string> = {
  'ICD-10': 'text-primary bg-primary/10 border-primary/20',
  CPT: 'text-warning bg-warning/10 border-warning/20',
  'E&M': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
};

const statusConfig: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
  'auto-accepted': {
    cls: 'badge-success',
    icon: <CheckCircle size={10} />,
    label: 'Auto-accepted',
  },
  review: {
    cls: 'badge-warning',
    icon: <AlertCircle size={10} />,
    label: 'Review',
  },
  rejected: {
    cls: 'badge-danger',
    icon: <AlertCircle size={10} />,
    label: 'Rejected',
  },
  manual: {
    cls: 'badge-muted',
    icon: <Plus size={10} />,
    label: 'Manual',
  },
};

export default function MedicalCodingPanel() {
  const [codes, setCodes] = useState<MedCode[]>(suggestedCodes);
  const [filter, setFilter] = useState<string>('all');
  const [regenerating, setRegenerating] = useState(false);

  const filtered = filter === 'all' ? codes : codes.filter((c) => c.type === filter);

  const acceptCode = (id: string) => {
    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'auto-accepted' } : c))
    );
    toast.success('Code accepted');
  };

  const rejectCode = (id: string) => {
    setCodes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' } : c))
    );
    toast.error('Code rejected');
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    // Backend: POST /api/coding/suggest { encounterId, transcriptId }
    setTimeout(() => {
      setRegenerating(false);
      toast.success('Coding suggestions refreshed by AI agent');
    }, 2000);
  };

  const autoAccepted = codes.filter((c) => c.status === 'auto-accepted').length;
  const needsReview = codes.filter((c) => c.status === 'review').length;
  const totalRVU = codes
    .filter((c) => c.rvu && c.status === 'auto-accepted')
    .reduce((sum, c) => sum + (c.rvu || 0), 0);

  return (
    <div className="card-base flex flex-col overflow-hidden flex-1">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">ICD-10 / CPT / E&M Coding</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-success text-xs">{autoAccepted} accepted</span>
          {needsReview > 0 && <span className="badge-warning text-xs">{needsReview} review</span>}
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="btn-secondary flex items-center gap-1 text-xs py-1"
          >
            <RefreshCw size={11} className={regenerating ? 'animate-spin' : ''} />
            {regenerating ? 'Running...' : 'Re-analyze'}
          </button>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-3 border-b border-border flex-shrink-0">
        {[
          { label: 'Total Codes', value: codes.length, color: 'text-foreground' },
          { label: 'Needs Review', value: needsReview, color: needsReview > 0 ? 'text-warning' : 'text-success' },
          { label: 'Total RVU', value: totalRVU.toFixed(2), color: 'text-primary' },
        ].map(({ label, value, color }) => (
          <div key={`coding-metric-${label}`} className="flex flex-col items-center py-2.5 border-r border-border last:border-0">
            <span className={`text-lg font-bold font-mono-data ${color}`}>{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-border flex-shrink-0">
        {['all', 'ICD-10', 'CPT', 'E&M'].map((f) => (
          <button
            key={`filter-${f}`}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 ${
              filter === f
                ? 'bg-primary/20 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles size={11} className="text-primary" />
          AI Suggested
        </div>
      </div>

      {/* Code list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2">
        {filtered.map((code) => {
          const scfg = statusConfig[code.status];
          return (
            <div
              key={code.id}
              className={`p-3 rounded-lg border transition-all duration-150 group ${
                code.status === 'rejected' ?'border-danger/20 bg-danger/5 opacity-60'
                  : code.status === 'review' ?'border-warning/30 bg-warning/5' :'border-border bg-muted/10 hover:bg-secondary/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span className={`code-chip px-1.5 py-0.5 rounded border text-xs font-bold flex-shrink-0 ${typeColors[code.type]}`}>
                    {code.type}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-mono-data text-foreground">{code.code}</span>
                      {code.modifier && (
                        <span className="text-xs font-mono-data text-muted-foreground bg-muted px-1 py-0.5 rounded">
                          Mod: {code.modifier}
                        </span>
                      )}
                      {code.rvu && (
                        <span className="text-xs text-muted-foreground font-mono-data">
                          RVU: {code.rvu}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{code.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-1.5 rounded-full bg-muted overflow-hidden"
                      style={{ width: '40px' }}
                    >
                      <div
                        className={`h-full rounded-full ${
                          code.confidence >= 95 ? 'bg-success' :
                          code.confidence >= 85 ? 'bg-primary' : 'bg-warning'
                        }`}
                        style={{ width: `${code.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono-data text-muted-foreground w-8 text-right">
                      {code.confidence}%
                    </span>
                  </div>
                  <span className={`${scfg.cls} flex items-center gap-1`}>
                    {scfg.icon}{scfg.label}
                  </span>
                </div>
              </div>

              {code.status === 'review' && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                  <Info size={11} className="text-warning" />
                  <span className="text-xs text-warning flex-1">Physician review required before submission</span>
                  <button
                    onClick={() => acceptCode(code.id)}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-success/20 text-success hover:bg-success/30 transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectCode(code.id)}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-danger/20 text-danger hover:bg-danger/30 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between flex-shrink-0">
        <p className="text-xs text-muted-foreground">
          Coding Agent v2 · ICD-10-CM 2026 · CPT 2026
        </p>
        <button
          onClick={() => toast.success('Codes submitted for payer validation')}
          className="btn-primary text-xs py-1.5 flex items-center gap-1"
        >
          <CheckCircle size={12} />
          Submit Codes
        </button>
      </div>
    </div>
  );
}