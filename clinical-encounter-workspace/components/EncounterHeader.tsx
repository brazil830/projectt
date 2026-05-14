'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Save,
  Send,
  MoreHorizontal,
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'sonner';

interface EncounterHeaderProps {
  isRecording: boolean;
}

const DEFAULT_ENCOUNTER = {
  patientName: 'Priya Chandrasekaran',
  mrn: 'MRN-311045',
  age: 38,
  dob: '04/17/1988',
  gender: 'F',
  room: '4A-09',
  organization: 'Valley Medical',
  scheduledTime: '09:00',
  encounterType: 'New Patient',
  insurancePlan: 'UnitedHealth PPO',
  status: 'In Progress',
  allergies: ['Penicillin (anaphylaxis)', 'Sulfonamides (rash)'],
  alerts: ['Elevated BP 148/92 — consider antihypertensive workup'],
  vitals: {
    bp: '148/92', hr: '88 bpm', rr: '18', spo2: '97%', temp: '98.6°F', weight: '62 kg', bpAlert: true,
  },
};

export default function EncounterHeader({ isRecording }: EncounterHeaderProps) {
  const { activeEncounter, triggerPhiPurge } = useSession();

  // Use session encounter if available, otherwise fall back to default
  const enc = activeEncounter
    ? {
        patientName: activeEncounter.patientName,
        mrn: activeEncounter.mrn,
        age: activeEncounter.age,
        dob: activeEncounter.dob,
        gender: 'F',
        room: activeEncounter.room,
        organization: 'Valley Medical',
        scheduledTime: activeEncounter.scheduledTime,
        encounterType: activeEncounter.encounterType,
        insurancePlan: activeEncounter.insurancePlan,
        status: activeEncounter.status,
        allergies: activeEncounter.allergies,
        alerts: activeEncounter.alerts,
        vitals: activeEncounter.vitals,
      }
    : DEFAULT_ENCOUNTER;

  const handleSaveDraft = () => {
    triggerPhiPurge();
    toast.success('Draft saved — PHI session refreshed');
  };

  const handleFinalize = () => {
    triggerPhiPurge();
    toast.success('Note finalized and queued for Epic sync');
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <Link href="/">
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 mt-0.5">
            <ArrowLeft size={16} />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-foreground">{enc.patientName}</h1>
            <span className="badge-info">{enc.status}</span>
            {isRecording && (
              <span className="badge-danger flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                Recording
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User size={11} />
              <span className="font-mono-data">{enc.mrn}</span>
              <span>·</span>
              <span>{enc.age}{enc.gender}</span>
              <span>·</span>
              <span>DOB: {enc.dob}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 size={11} />
              <span>Room {enc.room} · {enc.organization}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar size={11} />
              <span>{enc.scheduledTime} · {enc.encounterType} · {enc.insurancePlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals strip */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40 border border-border text-xs">
          {[
            { label: 'BP', value: enc.vitals.bp, alert: enc.vitals.bpAlert },
            { label: 'HR', value: enc.vitals.hr, alert: false },
            { label: 'RR', value: enc.vitals.rr, alert: false },
            { label: 'SpO₂', value: enc.vitals.spo2, alert: false },
            { label: 'Temp', value: enc.vitals.temp, alert: false },
            { label: 'Wt', value: enc.vitals.weight, alert: false },
          ].map(({ label, value, alert }) => (
            <div key={`vital-${label}`} className="text-center">
              <p className="text-muted-foreground">{label}</p>
              <p className={`font-semibold font-mono-data ${alert ? 'text-warning' : 'text-foreground'}`}>
                {alert && <AlertCircle size={9} className="inline mr-0.5 text-warning" />}
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"
          >
            <Save size={13} />
            Save Draft
          </button>
          <button
            onClick={handleFinalize}
            className="btn-primary flex items-center gap-1.5 text-xs py-1.5"
          >
            <Send size={13} />
            Finalize & Sync
          </button>
          <button className="btn-secondary p-1.5">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Allergy / Alert banner */}
      {(enc.allergies.length > 0 || enc.alerts.length > 0) && (
        <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/25">
          <AlertCircle size={13} className="text-danger flex-shrink-0" />
          <p className="text-xs text-danger font-medium">
            {enc.allergies.length > 0 && (
              <>ALLERGIES: {enc.allergies.join(', ')}</>
            )}
            {enc.alerts.length > 0 && (
              <span className="text-warning ml-2">⚠ ALERTS: {enc.alerts.join(' · ')}</span>
            )}
          </p>
          <CheckCircle2 size={13} className="text-muted-foreground ml-auto flex-shrink-0" />
        </div>
      )}
    </div>
  );
}