'use client';

import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import DocumentEditor from './DocumentEditor';

interface Document {
  id: string;
  patientName: string;
  mrn: string;
  type: string;
  status: 'Draft' | 'Pending Review' | 'Finalized';
  lastModified: string;
  author: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; cls: string }> = {
  Draft: { icon: <Clock size={11} />, cls: 'badge-muted' },
  'Pending Review': { icon: <Clock size={11} />, cls: 'badge-warning' },
  Finalized: { icon: <CheckCircle size={11} />, cls: 'badge-success' },
};

const initialDocuments: Document[] = [
  {
    id: 'doc-001',
    patientName: 'Robert Vaszquez',
    mrn: 'MRN-287603',
    type: 'SOAP Note',
    status: 'Finalized',
    lastModified: '2 hours ago',
    author: 'Dr. Rachel Okonkwo',
  },
  {
    id: 'doc-002',
    patientName: 'Margaret Thornton',
    mrn: 'MRN-204817',
    type: 'Progress Note',
    status: 'Pending Review',
    lastModified: '4 hours ago',
    author: 'Jennifer Martinez, NP',
  },
  {
    id: 'doc-003',
    patientName: 'William Hargreaves',
    mrn: 'MRN-099234',
    type: 'Discharge Summary',
    status: 'Draft',
    lastModified: '1 day ago',
    author: 'Dr. Rachel Okonkwo',
  },
  {
    id: 'doc-004',
    patientName: 'Elena Kostadinova',
    mrn: 'MRN-278410',
    type: 'Consultation Note',
    status: 'Finalized',
    lastModified: '2 days ago',
    author: 'Dr. Rachel Okonkwo',
  },
];

export default function DocumentationWorkspace() {
  const [docList, setDocList] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'All',
    type: 'All'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredDocs = docList.filter(
    (doc) => {
      const matchesSearch = 
        doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = activeFilters.status === 'All' || doc.status === activeFilters.status;
      const matchesType = activeFilters.type === 'All' || doc.type === activeFilters.type;

      return matchesSearch && matchesStatus && matchesType;
    }
  );

  const handleNewDocument = () => {
    setSelectedDoc(null);
    setIsEditing(true);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setIsEditing(true);
  };

  const handleSaveDocument = (doc: Document) => {
    setDocList(prev => {
      const exists = prev.find(d => d.id === doc.id);
      if (exists) {
        return prev.map(d => d.id === doc.id ? doc : d);
      }
      return [doc, ...prev];
    });
    setIsEditing(false);
    setSelectedDoc(null);
  };

  const handleDownloadDocument = (doc: Document) => {
    toast.success(`Downloading ${doc.type} for ${doc.patientName}`);
  };

  if (isEditing) {
    return (
      <DocumentEditor 
        document={selectedDoc} 
        onBack={() => setIsEditing(false)} 
        onSave={handleSaveDocument}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Documents Today</p>
            </div>
            <FileText className="text-primary" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-warning">3</p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
            <Clock className="text-warning" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">21</p>
              <p className="text-xs text-muted-foreground">Finalized</p>
            </div>
            <CheckCircle className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">1.8s</p>
              <p className="text-xs text-muted-foreground">Avg. Generation</p>
            </div>
            <FileText className="text-muted-foreground" size={20} />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="card-base overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Clinical Documents</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewDocument}
              className="btn-primary text-xs flex items-center gap-1"
            >
              <Plus size={14} />
              New Document
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search by patient name, MRN, or document type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base w-full pl-9 py-2 text-sm"
              />
            </div>
            <div className="relative">
              <button
                onClick={handleFilter}
                className={`btn-secondary text-xs flex items-center gap-1 ${isFilterOpen ? 'bg-secondary ring-2 ring-primary/20' : ''}`}
              >
                <Filter size={14} />
                Filter
                {(activeFilters.status !== 'All' || activeFilters.type !== 'All') && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 card-base p-4 z-50 shadow-2xl slide-up">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter Documents</h3>
                      <button 
                        onClick={() => setActiveFilters({ status: 'All', type: 'All' })}
                        className="text-[10px] text-primary hover:underline"
                      >
                        Reset All
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground">BY STATUS</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Draft', 'Pending Review', 'Finalized'].map(status => (
                          <button
                            key={status}
                            onClick={() => setActiveFilters(prev => ({ ...prev, status }))}
                            className={`px-2 py-1 rounded-md text-[10px] border transition-all ${
                              activeFilters.status === status 
                                ? 'bg-primary/10 border-primary/30 text-primary font-medium' 
                                : 'bg-secondary/30 border-border text-muted-foreground hover:border-muted-foreground/30'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-muted-foreground">BY TYPE</label>
                      <select
                        value={activeFilters.type}
                        onChange={(e) => setActiveFilters(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-secondary/30 border border-border rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:ring-1 focus:ring-primary/20"
                      >
                        <option value="All">All Types</option>
                        <option value="SOAP Note">SOAP Note</option>
                        <option value="Progress Note">Progress Note</option>
                        <option value="Discharge Summary">Discharge Summary</option>
                        <option value="Consultation Note">Consultation Note</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {filteredDocs.map((doc) => {
            const scfg = statusConfig[doc.status];
            return (
              <div
                key={doc.id}
                className="flex items-start gap-4 px-4 py-3 hover:bg-secondary/30 transition-all duration-150 cursor-pointer group"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                  <FileText size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0" onClick={() => handleViewDocument(doc)}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.patientName}
                    </p>
                    <span className={scfg.cls + ' flex items-center gap-1 flex-shrink-0'}>
                      {scfg.icon}
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono-data text-muted-foreground">{doc.mrn}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{doc.type}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground">{doc.author}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{doc.lastModified}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDocument(doc);
                    }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title="View document"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(doc);
                    }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                    title="Download document"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
