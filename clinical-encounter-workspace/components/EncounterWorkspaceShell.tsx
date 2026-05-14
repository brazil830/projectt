'use client';

import React, { useState } from 'react';
import EncounterHeader from './EncounterHeader';
import VoiceCapturePanel from './VoiceCapturePanel';
import LiveTranscriptPanel from './LiveTranscriptPanel';
import SOAPNoteEditor from './SOAPNoteEditor';
import MedicalCodingPanel from './MedicalCodingPanel';
import AgentStatusBar from './AgentStatusBar';
import DigitalTwinWidget from './DigitalTwinWidget';

export default function EncounterWorkspaceShell() {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'soap' | 'coding' | 'auth'>('soap');

  return (
    <div className="flex flex-col gap-4 h-full">
      <EncounterHeader isRecording={isRecording} />

      {/* Main 3-pane layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 2xl:grid-cols-5 gap-4 flex-1 min-h-0">
        {/* LEFT: Voice + Transcript */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <VoiceCapturePanel isRecording={isRecording} setIsRecording={setIsRecording} />
          <LiveTranscriptPanel isRecording={isRecording} />
        </div>

        {/* CENTER/RIGHT: SOAP + Coding + Digital Twin */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl px-1 py-1 w-fit">
            {[
              { id: 'soap' as const, label: 'SOAP Note' },
              { id: 'coding' as const, label: 'ICD-10 / CPT Coding' },
              { id: 'auth' as const, label: 'Prior Authorization' },
            ].map((tab) => (
              <button
                key={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'soap' && <SOAPNoteEditor />}
          {activeTab === 'coding' && <MedicalCodingPanel />}
          {activeTab === 'auth' && <PriorAuthTab />}

          <DigitalTwinWidget />
        </div>
      </div>

      {/* Bottom Agent Bar */}
      <AgentStatusBar isRecording={isRecording} />
    </div>
  );
}

function PriorAuthTab() {
  return (
    <div className="card-base p-4 flex-1">
      <h3 className="text-sm font-semibold text-foreground mb-3">Prior Authorization Status</h3>
      <div className="space-y-3">
        {[
          {
            id: 'pa-1',
            procedure: 'Cardiac Stress Test + Echo',
            cpt: '93306',
            payer: 'BlueCross PPO',
            status: 'Under Review',
            submitted: '08:12',
          },
          {
            id: 'pa-2',
            procedure: 'MRI Lumbar Spine without contrast',
            cpt: '72148',
            payer: 'BlueCross PPO',
            status: 'Pending',
            submitted: '—',
          },
        ].map((item) => (
          <div key={`pa-${item.id}`} className="p-3 rounded-lg border border-border bg-muted/20">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-sm font-medium text-foreground">{item.procedure}</p>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                item.status === 'Under Review' ? 'badge-warning' :
                item.status === 'Approved' ? 'badge-success' : 'badge-muted'
              }`}>{item.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-data text-foreground/60 bg-muted px-1.5 py-0.5 rounded">CPT {item.cpt}</span>
              <span className="text-xs text-muted-foreground">{item.payer}</span>
              {item.submitted !== '—' && <span className="text-xs text-muted-foreground">Sub. {item.submitted}</span>}
            </div>
            {item.status === 'Pending' && (
              <button className="btn-primary text-xs py-1.5 mt-2">Submit Authorization Request</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}