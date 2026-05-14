'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Stethoscope,
  Eye,
  FileEdit,
  Code2,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { toast } from 'sonner';

interface Encounter {
  id: string;
  mrn: string;
  patientName: string;
  age: number;
  chiefComplaint: string;
  room: string;
  provider: string;
  status: 'Scheduled' | 'In Progress' | 'Transcribing' | 'Documenting' | 'Coding' | 'Auth Pending' | 'Completed' | 'Synced';
  soapStatus: 'Not Started' | 'AI Draft' | 'Review' | 'Finalized';
  codingStatus: 'Pending' | 'Auto-coded' | 'Review' | 'Approved';
  emrSync: 'Not Synced' | 'Syncing' | 'Synced' | 'Failed';
  scheduledTime: string;
  duration: string;
  encounterType: 'New Patient' | 'Follow-up' | 'Urgent' | 'Procedure';
  insurancePlan: string;
}

const mockEncounters: Encounter[] = [
  { id: 'enc-001', mrn: 'MRN-204817', patientName: 'Margaret Thornton', age: 67, chiefComplaint: 'Chest pain, shortness of breath', room: '4A-12', provider: 'Dr. Okonkwo', status: 'Completed', soapStatus: 'Finalized', codingStatus: 'Approved', emrSync: 'Synced', scheduledTime: '08:00', duration: '18 min', encounterType: 'Follow-up', insurancePlan: 'BlueCross PPO' },
  { id: 'enc-002', mrn: 'MRN-198432', patientName: 'James Okafor', age: 52, chiefComplaint: 'Type 2 DM management, HbA1c review', room: '4B-07', provider: 'Dr. Okonkwo', status: 'Documenting', soapStatus: 'AI Draft', codingStatus: 'Auto-coded', emrSync: 'Not Synced', scheduledTime: '08:30', duration: '12 min', encounterType: 'Follow-up', insurancePlan: 'Aetna HMO' },
  { id: 'enc-003', mrn: 'MRN-311045', patientName: 'Priya Chandrasekaran', age: 38, chiefComplaint: 'New onset hypertension, headache', room: '4A-09', provider: 'Dr. Okonkwo', status: 'In Progress', soapStatus: 'Not Started', codingStatus: 'Pending', emrSync: 'Not Synced', scheduledTime: '09:00', duration: '—', encounterType: 'New Patient', insurancePlan: 'UnitedHealth PPO' },
  { id: 'enc-004', mrn: 'MRN-287603', patientName: 'Robert Vaszquez', age: 74, chiefComplaint: 'Post-op follow-up, knee replacement', room: '4C-02', provider: 'Dr. Okonkwo', status: 'Auth Pending', soapStatus: 'Finalized', codingStatus: 'Review', emrSync: 'Not Synced', scheduledTime: '09:30', duration: '22 min', encounterType: 'Procedure', insurancePlan: 'Medicare Part B' },
  { id: 'enc-005', mrn: 'MRN-156789', patientName: 'Amara Diallo', age: 29, chiefComplaint: 'Anxiety disorder, medication review', room: '4B-11', provider: 'Dr. Okonkwo', status: 'Coding', soapStatus: 'Review', codingStatus: 'Review', emrSync: 'Not Synced', scheduledTime: '10:00', duration: '15 min', encounterType: 'Follow-up', insurancePlan: 'Cigna PPO' },
  { id: 'enc-006', mrn: 'MRN-099234', patientName: 'William Hargreaves', age: 81, chiefComplaint: 'COPD exacerbation, O2 sat 91%', room: '4A-15', provider: 'Dr. Okonkwo', status: 'In Progress', soapStatus: 'Not Started', codingStatus: 'Pending', emrSync: 'Not Synced', scheduledTime: '10:15', duration: '—', encounterType: 'Urgent', insurancePlan: 'Medicare Advantage' },
  { id: 'enc-007', mrn: 'MRN-334521', patientName: 'Sofia Nakamura', age: 44, chiefComplaint: 'Thyroid nodule evaluation, ultrasound review', room: '4D-03', provider: 'Dr. Okonkwo', status: 'Scheduled', soapStatus: 'Not Started', codingStatus: 'Pending', emrSync: 'Not Synced', scheduledTime: '11:00', duration: '—', encounterType: 'Follow-up', insurancePlan: 'Humana Gold' },
  { id: 'enc-008', mrn: 'MRN-412876', patientName: 'Marcus Webb', age: 58, chiefComplaint: 'Chronic low back pain, MRI results', room: '4B-06', provider: 'Dr. Okonkwo', status: 'Transcribing', soapStatus: 'AI Draft', codingStatus: 'Pending', emrSync: 'Not Synced', scheduledTime: '11:30', duration: '9 min', encounterType: 'Follow-up', insurancePlan: 'BlueCross HMO' },
  { id: 'enc-009', mrn: 'MRN-278410', patientName: 'Elena Kostadinova', age: 63, chiefComplaint: 'Atrial fibrillation monitoring, INR check', room: '4A-04', provider: 'Dr. Okonkwo', status: 'Completed', soapStatus: 'Finalized', codingStatus: 'Approved', emrSync: 'Synced', scheduledTime: '07:30', duration: '11 min', encounterType: 'Follow-up', insurancePlan: 'Aetna Medicare' },
  { id: 'enc-010', mrn: 'MRN-501234', patientName: 'David Osei-Bonsu', age: 47, chiefComplaint: 'Pre-op clearance, appendectomy', room: '4C-08', provider: 'Dr. Okonkwo', status: 'Synced', soapStatus: 'Finalized', codingStatus: 'Approved', emrSync: 'Synced', scheduledTime: '07:00', duration: '14 min', encounterType: 'Procedure', insurancePlan: 'UnitedHealth HMO' },
];

const statusConfig: Record<string, { label: string; cls: string }> = {
  Scheduled: { label: 'Scheduled', cls: 'badge-muted' },
  'In Progress': { label: 'In Progress', cls: 'badge-info' },
  Transcribing: { label: 'Transcribing', cls: 'badge-info' },
  Documenting: { label: 'Documenting', cls: 'badge-warning' },
  Coding: { label: 'Coding', cls: 'badge-warning' },
  'Auth Pending': { label: 'Auth Pending', cls: 'badge-warning' },
  Completed: { label: 'Completed', cls: 'badge-success' },
  Synced: { label: 'Synced', cls: 'badge-success' },
  Urgent: { label: '⚡ Urgent', cls: 'badge-danger' },
};

const soapConfig: Record<string, string> = {
  'Not Started': 'badge-muted',
  'AI Draft': 'badge-info',
  Review: 'badge-warning',
  Finalized: 'badge-success',
};

const codingConfig: Record<string, string> = {
  Pending: 'badge-muted',
  'Auto-coded': 'badge-info',
  Review: 'badge-warning',
  Approved: 'badge-success',
};

const emrConfig: Record<string, { cls: string; icon: React.ReactNode }> = {
  'Not Synced': { cls: 'badge-muted', icon: null },
  Syncing: { cls: 'badge-info', icon: <Loader2 size={10} className="animate-spin" /> },
  Synced: { cls: 'badge-success', icon: <CheckCircle2 size={10} /> },
  Failed: { cls: 'badge-danger', icon: <AlertCircle size={10} /> },
};

const encounterTypeConfig: Record<string, string> = {
  'New Patient': 'badge-info',
  'Follow-up': 'badge-muted',
  Urgent: 'badge-danger',
  Procedure: 'badge-warning',
};

type SortField = 'scheduledTime' | 'patientName' | 'status' | 'soapStatus';
type SortDir = 'asc' | 'desc';

export default function EncounterQueueTable() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('scheduledTime');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { setActiveEncounter } = useSession();
  const router = useRouter();

  const filtered = mockEncounters.filter((enc) => {
    const q = search.toLowerCase();
    const matchesSearch =
      enc.patientName.toLowerCase().includes(q) ||
      enc.mrn.toLowerCase().includes(q) ||
      enc.chiefComplaint.toLowerCase().includes(q) ||
      enc.room.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || enc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const mult = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'scheduledTime') return a.scheduledTime.localeCompare(b.scheduledTime) * mult;
    if (sortField === 'patientName') return a.patientName.localeCompare(b.patientName) * mult;
    if (sortField === 'status') return a.status.localeCompare(b.status) * mult;
    if (sortField === 'soapStatus') return a.soapStatus.localeCompare(b.soapStatus) * mult;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  const toggleAll = () => {
    if (selectedRows.size === sorted.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(sorted.map((e) => e.id)));
  };

  const openEncounter = (enc: Encounter) => {
    setActiveEncounter({
      id: enc.id,
      mrn: enc.mrn,
      patientName: enc.patientName,
      age: enc.age,
      dob: '—',
      room: enc.room,
      chiefComplaint: enc.chiefComplaint,
      encounterType: enc.encounterType,
      insurancePlan: enc.insurancePlan,
      scheduledTime: enc.scheduledTime,
      status: enc.status,
      allergies: enc.id === 'enc-003' ? ['Penicillin (anaphylaxis)', 'Sulfonamides (rash)'] : [],
      alerts: enc.encounterType === 'Urgent' ? ['Urgent — immediate attention required'] : [],
      vitals: {
        bp: enc.id === 'enc-003' ? '148/92' : '120/80',
        hr: '88 bpm',
        rr: '18',
        spo2: enc.encounterType === 'Urgent' ? '91%' : '97%',
        temp: '98.6°F',
        weight: '70 kg',
        bpAlert: enc.id === 'enc-003',
      },
    });
    toast.success(`Opening encounter — ${enc.patientName}`);
    router.push('/clinical-encounter-workspace');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={12} className="text-muted-foreground" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  };

  return (
    <div className="card-base overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Encounter Queue</h2>
          <p className="text-xs text-muted-foreground">{sorted.length} encounters · Click any row to open workspace</p>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative flex-1">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patient, MRN, complaint..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base w-full pl-7 py-1.5 text-xs"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base text-xs py-1.5 pr-6"
          >
            <option value="all">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Documenting">Documenting</option>
            <option value="Coding">Coding</option>
            <option value="Auth Pending">Auth Pending</option>
            <option value="Completed">Completed</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>
        <button className="btn-secondary text-xs py-1.5 flex items-center gap-1">
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Bulk Action Bar */}
      {selectedRows.size > 0 && (
        <div className="slide-up flex items-center gap-3 px-4 py-2 bg-primary/10 border-b border-primary/20">
          <span className="text-xs font-medium text-primary">{selectedRows.size} selected</span>
          <button className="btn-secondary text-xs py-1">Bulk Code</button>
          <button className="btn-secondary text-xs py-1">Sync to EMR</button>
          <button className="btn-danger text-xs py-1">Export</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-8 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={selectedRows.size === sorted.length && sorted.length > 0}
                  onChange={toggleAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-3 py-2.5 text-left">
                <button onClick={() => toggleSort('scheduledTime')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground tracking-wide uppercase">
                  Time <SortIcon field="scheduledTime" />
                </button>
              </th>
              <th className="px-3 py-2.5 text-left">
                <button onClick={() => toggleSort('patientName')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground tracking-wide uppercase">
                  Patient <SortIcon field="patientName" />
                </button>
              </th>
              <th className="px-3 py-2.5 text-left"><span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Chief Complaint</span></th>
              <th className="px-3 py-2.5 text-left"><span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Room</span></th>
              <th className="px-3 py-2.5 text-left">
                <button onClick={() => toggleSort('status')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground tracking-wide uppercase">
                  Status <SortIcon field="status" />
                </button>
              </th>
              <th className="px-3 py-2.5 text-left">
                <button onClick={() => toggleSort('soapStatus')} className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground tracking-wide uppercase">
                  SOAP <SortIcon field="soapStatus" />
                </button>
              </th>
              <th className="px-3 py-2.5 text-left"><span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Coding</span></th>
              <th className="px-3 py-2.5 text-left"><span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">EMR Sync</span></th>
              <th className="px-3 py-2.5 text-left"><span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Type</span></th>
              <th className="px-3 py-2.5 text-right"><span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((enc, idx) => {
              const isSelected = selectedRows.has(enc.id);
              const statusCfg = statusConfig[enc.status] || statusConfig['Scheduled'];
              const emrCfg = emrConfig[enc.emrSync];
              return (
                <tr
                  key={enc.id}
                  onClick={() => openEncounter(enc)}
                  className={`border-b border-border/50 transition-all duration-150 group cursor-pointer
                    ${isSelected ? 'bg-primary/5' : idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}
                    hover:bg-secondary/40`}
                >
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(enc.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-mono-data text-muted-foreground">{enc.scheduledTime}</span>
                    {enc.duration !== '—' && enc.duration !== '— ' && (
                      <p className="text-xs text-muted-foreground/60 flex items-center gap-0.5 mt-0.5">
                        <Clock size={9} /> {enc.duration}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="text-sm font-medium text-foreground">{enc.patientName}</p>
                    <p className="text-xs text-muted-foreground font-mono-data">{enc.mrn} · {enc.age}y</p>
                  </td>
                  <td className="px-3 py-2.5 max-w-[200px]">
                    <p className="text-xs text-foreground/80 truncate" title={enc.chiefComplaint}>{enc.chiefComplaint}</p>
                    <p className="text-xs text-muted-foreground">{enc.insurancePlan}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-mono-data font-semibold text-foreground">{enc.room}</span>
                  </td>
                  <td className="px-3 py-2.5"><span className={statusCfg.cls}>{statusCfg.label}</span></td>
                  <td className="px-3 py-2.5"><span className={soapConfig[enc.soapStatus]}>{enc.soapStatus}</span></td>
                  <td className="px-3 py-2.5"><span className={codingConfig[enc.codingStatus]}>{enc.codingStatus}</span></td>
                  <td className="px-3 py-2.5">
                    <span className={`${emrCfg.cls} flex items-center gap-1`}>
                      {emrCfg.icon}{enc.emrSync}
                    </span>
                  </td>
                  <td className="px-3 py-2.5"><span className={encounterTypeConfig[enc.encounterType]}>{enc.encounterType}</span></td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => openEncounter(enc)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-150"
                        title="Open Encounter Workspace"
                      >
                        <Stethoscope size={13} />
                      </button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150" title="View Patient Chart">
                        <Eye size={13} />
                      </button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-150" title="Edit SOAP Note">
                        <FileEdit size={13} />
                      </button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-warning hover:bg-warning/10 transition-all duration-150" title="Review Codes">
                        <Code2 size={13} />
                      </button>
                      <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150" title="More Options">
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Showing {sorted.length} of {mockEncounters.length} encounters
        </p>
        <div className="flex items-center gap-1">
          {['prev-page', '1', '2', '3', 'next-page'].map((p) => (
            <button
              key={`page-${p}`}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 ${
                p === '1' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {p === 'prev-page' ? '←' : p === 'next-page' ? '→' : p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Per page:</span>
          <select className="input-base text-xs py-1 px-2">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}