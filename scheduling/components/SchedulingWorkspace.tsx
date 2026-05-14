'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patientName: string;
  mrn: string;
  time: string;
  type: string;
  provider: string;
  status: 'Confirmed' | 'Pending' | 'Check-in Required';
  duration: string;
}

const initialAppointments: Appointment[] = [
  {
    id: 'apt-001',
    patientName: 'Robert Vaszquez',
    mrn: 'MRN-287603',
    time: '09:00',
    type: 'Follow-up',
    provider: 'Dr. Rachel Okonkwo',
    status: 'Confirmed',
    duration: '30 min',
  },
  {
    id: 'apt-002',
    patientName: 'Margaret Thornton',
    mrn: 'MRN-204817',
    time: '09:30',
    type: 'New Patient',
    provider: 'Jennifer Martinez, NP',
    status: 'Check-in Required',
    duration: '45 min',
  },
  {
    id: 'apt-003',
    patientName: 'William Hargreaves',
    mrn: 'MRN-099234',
    time: '10:15',
    type: 'Annual Physical',
    provider: 'Dr. Rachel Okonkwo',
    status: 'Pending',
    duration: '60 min',
  },
  {
    id: 'apt-004',
    patientName: 'Elena Kostadinova',
    mrn: 'MRN-278410',
    time: '11:00',
    type: 'Lab Review',
    provider: 'Jennifer Martinez, NP',
    status: 'Confirmed',
    duration: '15 min',
  },
];

const statusConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
  Confirmed: { icon: <CheckCircle size={11} />, cls: 'badge-success' },
  Pending: { icon: <Clock size={11} />, cls: 'badge-warning' },
  'Check-in Required': { icon: <AlertTriangle size={11} />, cls: 'badge-danger' },
};

export default function SchedulingWorkspace() {
  const [aptList, setAptList] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({ patientName: '', type: 'Follow-up', time: '12:00', provider: 'Dr. Rachel Okonkwo' });

  const filteredAppointments = aptList.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewAppointment = () => {
    setIsNewModalOpen(true);
  };

  const createAppointment = () => {
    if (!newApt.patientName) {
      toast.error('Please provide a patient name');
      return;
    }

    const created: Appointment = {
      id: `apt-${Date.now()}`,
      patientName: newApt.patientName,
      mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      time: newApt.time,
      type: newApt.type,
      provider: newApt.provider,
      status: 'Confirmed',
      duration: '30 min',
    };

    setAptList([...aptList, created].sort((a, b) => a.time.localeCompare(b.time)));
    setIsNewModalOpen(false);
    setNewApt({ patientName: '', type: 'Follow-up', time: '12:00', provider: 'Dr. Rachel Okonkwo' });
    toast.success(`Appointment scheduled for ${created.patientName}`);
  };

  const handleViewAppointment = (apt: Appointment) => {
    setSelectedApt(apt);
    setIsDetailModalOpen(true);
  };

  const handleEditAppointment = (apt: Appointment) => {
    toast.success(`Editing appointment for ${apt.patientName}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Appointments Today</p>
            </div>
            <Calendar className="text-primary" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">3</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <Clock className="text-warning" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">92%</p>
              <p className="text-xs text-muted-foreground">Show Rate</p>
            </div>
            <CheckCircle className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-xs text-muted-foreground">Open Slots</p>
            </div>
            <User className="text-muted-foreground" size={20} />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card-base overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Today's Schedule</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewAppointment}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <Plus size={14} />
              New Appointment
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
              placeholder="Search by patient, MRN, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base w-full pl-9 py-2 text-sm"
            />
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {filteredAppointments.map((apt) => {
            const scfg = statusConfig[apt.status];
            return (
              <div
                key={apt.id}
                className="flex items-start gap-4 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer group"
                onClick={() => handleViewAppointment(apt)}
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <Clock size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {apt.patientName}
                    </p>
                    <span className={scfg.cls + ' flex items-center gap-1 flex-shrink-0'}>
                      {scfg.icon}
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono-data text-foreground font-semibold">
                      {apt.time}
                    </span>
                    <span className="text-xs text-muted-foreground">{apt.type}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{apt.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{apt.provider}</span>
                    <span className="text-xs font-mono-data text-muted-foreground">{apt.mrn}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewAppointment(apt);
                    }}
                    className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAppointment(apt);
                    }}
                    className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Appointment Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="w-full max-w-md card-base bg-card shadow-2xl overflow-hidden slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Plus className="text-primary" size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Schedule Appointment</h3>
              </div>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Patient Name</label>
                <input 
                  type="text"
                  placeholder="Enter full name"
                  value={newApt.patientName}
                  onChange={(e) => setNewApt({ ...newApt, patientName: e.target.value })}
                  className="input-base w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Time</label>
                  <input 
                    type="time"
                    value={newApt.time}
                    onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
                    className="input-base w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Type</label>
                  <select 
                    value={newApt.type}
                    onChange={(e) => setNewApt({ ...newApt, type: e.target.value })}
                    className="input-base w-full"
                  >
                    <option>Follow-up</option>
                    <option>New Patient</option>
                    <option>Annual Physical</option>
                    <option>Urgent Visit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Provider</label>
                <select 
                  value={newApt.provider}
                  onChange={(e) => setNewApt({ ...newApt, provider: e.target.value })}
                  className="input-base w-full"
                >
                  <option>Dr. Rachel Okonkwo</option>
                  <option>Jennifer Martinez, NP</option>
                </select>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button 
                  onClick={createAppointment}
                  className="flex-1 btn-primary py-2.5"
                >
                  Confirm Appointment
                </button>
                <button 
                  onClick={() => setIsNewModalOpen(false)}
                  className="flex-1 btn-secondary py-2.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {isDetailModalOpen && selectedApt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="w-full max-w-md card-base bg-card shadow-2xl overflow-hidden slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedApt.patientName}</h3>
                  <p className="text-xs text-muted-foreground">{selectedApt.mrn}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scheduled Time</label>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Clock size={14} className="text-primary" />
                    {selectedApt.time} ({selectedApt.duration})
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="flex items-center gap-2">
                    <span className={statusConfig[selectedApt.status].cls + ' flex items-center gap-1'}>
                      {statusConfig[selectedApt.status].icon}{selectedApt.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Provider & Specialty</label>
                <p className="text-sm text-foreground font-medium">{selectedApt.provider}</p>
                <p className="text-xs text-muted-foreground">General Practice / Internal Medicine</p>
              </div>

              <div className="p-3 bg-secondary/10 rounded-lg border border-border/50">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Appointment Notes</label>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Patient presenting for {selectedApt.type}. Last visit was 3 months ago. Ensure latest lab results are available for review during the session.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button 
                  onClick={() => {
                    toast.success('Patient checked in');
                    setIsDetailModalOpen(false);
                  }}
                  className="flex-1 btn-primary text-xs py-2"
                >
                  Check-in Patient
                </button>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="flex-1 btn-secondary text-xs py-2"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
