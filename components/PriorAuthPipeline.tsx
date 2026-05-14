'use client';

import React from 'react';
import { ShieldCheck, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface AuthRequest {
  id: string;
  patientName: string;
  mrn: string;
  procedure: string;
  cptCode: string;
  payer: string;
  status: 'Pending' | 'Submitted' | 'Under Review' | 'Approved' | 'Denied';
  submittedAt: string;
  urgency: 'Routine' | 'Urgent' | 'Stat';
  estimatedValue: string;
}

const authRequests: AuthRequest[] = [
  {
    id: 'auth-001',
    patientName: 'Robert Vaszquez',
    mrn: 'MRN-287603',
    procedure: 'Total Knee Replacement Follow-up Imaging',
    cptCode: '27447',
    payer: 'Medicare Part B',
    status: 'Denied',
    submittedAt: '07:45',
    urgency: 'Routine',
    estimatedValue: '$4,200',
  },
  {
    id: 'auth-002',
    patientName: 'Margaret Thornton',
    mrn: 'MRN-204817',
    procedure: 'Cardiac Stress Test + Echo',
    cptCode: '93306',
    payer: 'BlueCross PPO',
    status: 'Under Review',
    submittedAt: '08:12',
    urgency: 'Urgent',
    estimatedValue: '$1,850',
  },
  {
    id: 'auth-003',
    patientName: 'William Hargreaves',
    mrn: 'MRN-099234',
    procedure: 'Pulmonary Function Testing',
    cptCode: '94010',
    payer: 'Medicare Advantage',
    status: 'Submitted',
    submittedAt: '10:22',
    urgency: 'Stat',
    estimatedValue: '$680',
  },
  {
    id: 'auth-004',
    patientName: 'Elena Kostadinova',
    mrn: 'MRN-278410',
    procedure: 'INR Monitoring + Warfarin Management',
    cptCode: '85610',
    payer: 'Aetna Medicare',
    status: 'Approved',
    submittedAt: '07:30',
    urgency: 'Routine',
    estimatedValue: '$320',
  },
  {
    id: 'auth-005',
    patientName: 'Sofia Nakamura',
    mrn: 'MRN-334521',
    procedure: 'Thyroid Ultrasound with Biopsy',
    cptCode: '76536',
    payer: 'Humana Gold',
    status: 'Pending',
    submittedAt: '—',
    urgency: 'Routine',
    estimatedValue: '$1,100',
  },
];

const statusConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
  Pending: { icon: <Clock size={11} />, cls: 'badge-muted' },
  Submitted: { icon: <ArrowRight size={11} />, cls: 'badge-info' },
  'Under Review': { icon: <AlertCircle size={11} />, cls: 'badge-warning' },
  Approved: { icon: <CheckCircle size={11} />, cls: 'badge-success' },
  Denied: { icon: <XCircle size={11} />, cls: 'badge-danger' },
};

const urgencyConfig: Record<string, string> = {
  Routine: 'badge-muted',
  Urgent: 'badge-warning',
  Stat: 'badge-danger',
};

export default function PriorAuthPipeline() {
  const [selectedRequestId, setSelectedRequestId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const selectedRequest = authRequests.find(r => r.id === selectedRequestId);

  return (
    <div className="card-base overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Prior Authorization Pipeline</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-warning">
            <Clock size={10} />
            7 Pending
          </span>
          <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Submit All
          </button>
        </div>
      </div>

      {/* Pipeline stages summary */}
      <div className="grid grid-cols-5 border-b border-border">
        {[
          { label: 'Pending', count: 2, color: 'text-muted-foreground' },
          { label: 'Submitted', count: 1, color: 'text-primary' },
          { label: 'Review', count: 1, color: 'text-warning' },
          { label: 'Approved', count: 1, color: 'text-success' },
          { label: 'Denied', count: 1, color: 'text-danger' },
        ].map(({ label, count, color }) => (
          <div key={`stage-${label}`} className="flex flex-col items-center py-2 border-r border-border last:border-0">
            <span className={`text-lg font-bold font-mono-data ${color}`}>{count}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="divide-y divide-border/50">
        {authRequests.map((req) => {
          const scfg = statusConfig[req.status];
          return (
            <div
              key={req.id}
              onClick={() => {
                setSelectedRequestId(req.id);
                setIsModalOpen(true);
              }}
              className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-sm font-medium text-foreground truncate">{req.patientName}</p>
                  <span className={scfg.cls + ' flex items-center gap-1 flex-shrink-0'}>
                    {scfg.icon}{req.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{req.procedure}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-mono-data text-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                    CPT {req.cptCode}
                  </span>
                  <span className="text-xs text-muted-foreground">{req.payer}</span>
                  <span className={urgencyConfig[req.urgency]}>{req.urgency}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground font-mono-data">{req.estimatedValue}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{req.submittedAt !== '—' ? `Sub. ${req.submittedAt}` : 'Not submitted'}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-border">
        <p className="text-xs text-muted-foreground">
          91% first-pass approval rate · <span className="text-success">$2,170</span> approved today
        </p>
      </div>

      {/* Authorization Detail Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="w-full max-w-2xl card-base bg-card shadow-2xl overflow-hidden slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <ShieldCheck className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedRequest.patientName}</h3>
                  <p className="text-xs text-muted-foreground">{selectedRequest.mrn}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <AlertCircle size={20} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Requested Procedure</label>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{selectedRequest.procedure}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono-data text-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                        CPT {selectedRequest.cptCode}
                      </span>
                      <span className="text-xs text-muted-foreground">{selectedRequest.payer}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clinical Justification Summary (AI)</label>
                    <div className="p-3 bg-secondary/10 rounded-lg border border-border/50">
                      <p className="text-xs text-foreground/80 leading-relaxed italic">
                        "Patient exhibits persistent Grade 3 joint pain despite 6 months of conservative management. Imaging indicates significant cartilage loss. Proposed {selectedRequest.procedure} is medically necessary under policy {selectedRequest.payer}-2026."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/10 border border-border/50 text-center">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Estimated Value</p>
                    <p className="text-2xl font-bold text-foreground font-mono-data">{selectedRequest.estimatedValue}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status History</label>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" />
                        <div>
                          <p className="text-[10px] font-bold text-foreground">{selectedRequest.status}</p>
                          <p className="text-[9px] text-muted-foreground">Today at {selectedRequest.submittedAt !== '—' ? selectedRequest.submittedAt : '09:00'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted mt-1.5" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground">Request Created</p>
                          <p className="text-[9px] text-muted-foreground">Yesterday, 14:20</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Payer Decision:</span>
                  <span className={statusConfig[selectedRequest.status].cls + ' flex items-center gap-1'}>
                    {statusConfig[selectedRequest.status].icon}{selectedRequest.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toast.info(`Accessing ${selectedRequest.payer} clinical policy portal...`)}
                    className="btn-secondary text-xs"
                  >
                    View Payer Policy
                  </button>
                  {selectedRequest.status === 'Denied' ? (
                    <button 
                      onClick={() => {
                        toast.promise(
                          new Promise((resolve) => setTimeout(resolve, 2000)),
                          {
                            loading: 'Preparing expedited appeal package...',
                            success: 'Appeal submitted to external review board',
                            error: 'Failed to initiate appeal',
                          }
                        );
                      }}
                      className="btn-danger text-xs"
                    >
                      Appeal Decision
                    </button>
                  ) : (
                    <button 
                      onClick={() => toast.success('Opening full authorization packet')}
                      className="btn-primary text-xs"
                    >
                      View Full Packet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}