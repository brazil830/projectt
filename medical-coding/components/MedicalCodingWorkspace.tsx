'use client';

import React, { useState } from 'react';
import {
  Code2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  TrendingUp,
  Eye,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface CodingEntry {
  id: string;
  patientName: string;
  mrn: string;
  icd10Code: string;
  description: string;
  cptCode: string;
  status: 'Auto-Coded' | 'Pending Review' | 'Confirmed';
  hccScore: number;
  confidence: number;
}

const codingEntries: CodingEntry[] = [
  {
    id: 'code-001',
    patientName: 'Robert Vaszquez',
    mrn: 'MRN-287603',
    icd10Code: 'M17.11',
    description: 'Unilateral primary osteoarthritis, right knee',
    cptCode: '27447',
    status: 'Confirmed',
    hccScore: 0.8,
    confidence: 98,
  },
  {
    id: 'code-002',
    patientName: 'Margaret Thornton',
    mrn: 'MRN-204817',
    icd10Code: 'I25.10',
    description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
    cptCode: '93306',
    status: 'Pending Review',
    hccScore: 1.2,
    confidence: 94,
  },
  {
    id: 'code-003',
    patientName: 'William Hargreaves',
    mrn: 'MRN-099234',
    icd10Code: 'J45.909',
    description: 'Unspecified asthma, uncomplicated',
    cptCode: '94010',
    status: 'Auto-Coded',
    hccScore: 0.3,
    confidence: 99,
  },
  {
    id: 'code-004',
    patientName: 'Elena Kostadinova',
    mrn: 'MRN-278410',
    icd10Code: 'Z79.01',
    description: 'Long term (current) use of anticoagulant',
    cptCode: '85610',
    status: 'Confirmed',
    hccScore: 0.5,
    confidence: 97,
  },
  {
    id: 'code-005',
    patientName: 'Samuel Jackson',
    mrn: 'MRN-442190',
    icd10Code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    cptCode: '99214',
    status: 'Auto-Coded',
    hccScore: 0.1,
    confidence: 100,
  },
  {
    id: 'code-006',
    patientName: 'Linda Montgomery',
    mrn: 'MRN-338211',
    icd10Code: 'I10',
    description: 'Essential (primary) hypertension',
    cptCode: '99213',
    status: 'Pending Review',
    hccScore: 0.2,
    confidence: 88,
  },
  {
    id: 'code-007',
    patientName: 'David Miller',
    mrn: 'MRN-559012',
    icd10Code: 'K21.9',
    description: 'Gastro-esophageal reflux disease without esophagitis',
    cptCode: '43239',
    status: 'Confirmed',
    hccScore: 0.0,
    confidence: 96,
  },
];

const statusConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
  'Auto-Coded': { icon: <CheckCircle size={11} />, cls: 'badge-success' },
  'Pending Review': { icon: <AlertTriangle size={11} />, cls: 'badge-warning' },
  Confirmed: { icon: <CheckCircle size={11} />, cls: 'badge-info' },
};

export default function MedicalCodingWorkspace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<CodingEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEntries = codingEntries.filter(
    (entry) =>
      entry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.icd10Code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating comprehensive medical coding report...',
        success: () => {
          // Generate actual CSV content from entries
          const headers = ['ID', 'Patient Name', 'MRN', 'ICD-10 Code', 'Description', 'CPT Code', 'Status', 'HCC Score', 'Confidence'];
          const rows = codingEntries.map(entry => [
            entry.id,
            entry.patientName,
            entry.mrn,
            entry.icd10Code,
            `"${entry.description}"`, // Quote descriptions to handle commas
            entry.cptCode,
            entry.status,
            entry.hccScore,
            `${entry.confidence}%`
          ]);
          
          const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
          ].join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `medical_coding_report_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          
          return 'Report exported successfully with patient details (CSV)';
        },
        error: 'Failed to export report',
      }
    );
  };

  const handleViewEntry = (entry: CodingEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleDownloadEntry = (entry: (typeof codingEntries)[0]) => {
    toast.success(`Downloading coding report for ${entry.patientName}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">18</p>
              <p className="text-xs text-muted-foreground">Coded Today</p>
            </div>
            <Code2 className="text-primary" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">2</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
            <AlertTriangle className="text-warning" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">96%</p>
              <p className="text-xs text-muted-foreground">Accuracy Rate</p>
            </div>
            <TrendingUp className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">0.8s</p>
              <p className="text-xs text-muted-foreground">Avg. Coding Time</p>
            </div>
            <Clock className="text-muted-foreground" size={20} />
          </div>
        </div>
      </div>

      {/* Coding Entries List */}
      <div className="card-base overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Code2 size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Medical Coding Queue</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportReport} className="btn-secondary text-xs">
              Export Report
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by patient, MRN, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {filteredEntries.map((entry) => {
            const scfg = statusConfig[entry.status];
            return (
              <div
                key={entry.id}
                className="flex items-start gap-4 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer group"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <Code2 size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.patientName}
                    </p>
                    <span className={scfg.cls + ' flex items-center gap-1 flex-shrink-0'}>
                      {scfg.icon}
                      {entry.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono-data text-foreground font-semibold bg-primary/10 px-1.5 py-0.5 rounded">
                      ICD-10 {entry.icd10Code}
                    </span>
                    <span className="text-xs font-mono-data text-muted-foreground">
                      CPT {entry.cptCode}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{entry.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      HCC Score:{' '}
                      <span className="font-mono-data text-foreground">{entry.hccScore}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Confidence:{' '}
                      <span className="font-mono-data text-foreground">{entry.confidence}%</span>
                    </span>
                    <span className="text-xs font-mono-data text-muted-foreground">
                      {entry.mrn}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewEntry(entry);
                    }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title="View details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadEntry(entry);
                    }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title="Download report"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coding Details Modal */}
      {isModalOpen && selectedEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="w-full max-w-2xl card-base bg-card shadow-2xl overflow-hidden slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code2 className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedEntry.patientName}</h3>
                  <p className="text-xs text-muted-foreground">{selectedEntry.mrn}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <TrendingUp size={20} className="rotate-45" /> {/* Close icon substitute or just use X */}
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">ICD-10 Diagnosis</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-mono-data text-foreground font-bold">{selectedEntry.icd10Code}</span>
                      <span className="badge-info">Primary</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{selectedEntry.description}</p>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CPT Procedure</label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono-data text-foreground font-semibold">{selectedEntry.cptCode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="card-base p-4 bg-secondary/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">AI Confidence</span>
                      <span className="text-sm font-bold text-success">{selectedEntry.confidence}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-success h-full transition-all duration-1000" 
                        style={{ width: `${selectedEntry.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="card-base p-4 bg-secondary/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">HCC Risk Score</span>
                      <span className="text-sm font-bold text-primary">{selectedEntry.hccScore}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      This score reflects the projected cost of care based on the patient's documented chronic conditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <span className={statusConfig[selectedEntry.status].cls}>
                    {statusConfig[selectedEntry.status].icon}
                    {selectedEntry.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      toast.success('Coding entry confirmed');
                      setIsModalOpen(false);
                    }}
                    className="btn-primary text-xs flex items-center gap-2"
                  >
                    <CheckCircle size={14} />
                    Confirm & Sync
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
