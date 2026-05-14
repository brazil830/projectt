'use client';

import React, { useState } from 'react';
import { Users, Search, Plus, FileText, Activity, Eye, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  mrn: string;
  dob: string;
  age: number;
  primaryDiagnosis: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
}

const patients: Patient[] = [
  {
    id: 'pat-001',
    name: 'Robert Vaszquez',
    mrn: 'MRN-287603',
    dob: '1958-03-15',
    age: 66,
    primaryDiagnosis: 'Osteoarthritis',
    lastVisit: '2 days ago',
    status: 'Active',
  },
  {
    id: 'pat-002',
    name: 'Margaret Thornton',
    mrn: 'MRN-204817',
    dob: '1962-07-22',
    age: 62,
    primaryDiagnosis: 'Hypertension',
    lastVisit: '1 week ago',
    status: 'Active',
  },
  {
    id: 'pat-003',
    name: 'William Hargreaves',
    mrn: 'MRN-099234',
    dob: '1975-11-08',
    age: 49,
    primaryDiagnosis: 'Asthma',
    lastVisit: '3 days ago',
    status: 'Active',
  },
  {
    id: 'pat-004',
    name: 'Elena Kostadinova',
    mrn: 'MRN-278410',
    dob: '1955-05-30',
    age: 69,
    primaryDiagnosis: 'Atrial Fibrillation',
    lastVisit: '5 days ago',
    status: 'Active',
  },
];

export default function PatientRegistry() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    toast.success('Opening new patient registration form...');
  };

  const handleViewPatient = (patient: (typeof patients)[0]) => {
    toast.success(`Opening patient record for ${patient.name}`);
  };

  const handleEditPatient = (patient: (typeof patients)[0]) => {
    toast.success(`Editing patient record for ${patient.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">1,247</p>
              <p className="text-xs text-muted-foreground">Total Patients</p>
            </div>
            <Users className="text-primary" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">1,180</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <Activity className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">67</p>
              <p className="text-xs text-muted-foreground">Inactive</p>
            </div>
            <Users className="text-muted-foreground" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">New This Month</p>
            </div>
            <Plus className="text-muted-foreground" size={20} />
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Users size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Patient Registry</h2>
          </div>
          <button
            onClick={handleAddPatient}
            className="btn-primary text-xs flex items-center gap-1"
          >
            <Plus size={14} />
            Add Patient
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search by name, MRN, or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-start gap-4 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer group"
              onClick={() => handleViewPatient(patient)}
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                <Users size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">{patient.name}</p>
                  <span className={`badge-${patient.status === 'Active' ? 'success' : '-muted'}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono-data text-muted-foreground">
                    {patient.mrn}
                  </span>
                  <span className="text-xs text-muted-foreground">Age: {patient.age}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{patient.primaryDiagnosis}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{patient.lastVisit}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewPatient(patient);
                  }}
                  className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                  title="View"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPatient(patient);
                  }}
                  className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
