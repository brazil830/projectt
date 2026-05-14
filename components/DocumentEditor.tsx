'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  User, 
  Hash, 
  Tag, 
  Clock, 
  CheckCircle,
  Sparkles,
  Download,
  Share2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  patientName: string;
  mrn: string;
  type: string;
  status: 'Draft' | 'Pending Review' | 'Finalized';
  lastModified: string;
  author: string;
  content?: string;
}

interface DocumentEditorProps {
  document: Document | null;
  onBack: () => void;
  onSave: (doc: Document) => void;
}

export default function DocumentEditor({ document, onBack, onSave }: DocumentEditorProps) {
  const [formData, setFormData] = useState<Partial<Document>>({
    patientName: document?.patientName || '',
    mrn: document?.mrn || '',
    type: document?.type || 'SOAP Note',
    status: document?.status || 'Draft',
    content: document?.content || '',
    author: document?.author || 'Dr. Rachel Okonkwo',
  });

  const handleSave = () => {
    if (!formData.patientName || !formData.mrn) {
      toast.error('Please fill in required fields');
      return;
    }

    const savedDoc: Document = {
      id: document?.id || `doc-${Math.random().toString(36).substr(2, 9)}`,
      patientName: formData.patientName || '',
      mrn: formData.mrn || '',
      type: formData.type || '',
      status: formData.status as Document['status'],
      lastModified: 'Just now',
      author: formData.author || '',
      content: formData.content,
    };

    onSave(savedDoc);
    toast.success(document ? 'Document updated successfully' : 'New document created');
  };

  const handleGenerateAI = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'AI is analyzing patient data and generating draft...',
        success: () => {
          setFormData(prev => ({
            ...prev,
            content: `Chief Complaint: Follow-up for chronic condition.
            
History of Present Illness: Patient reports stable symptoms since last visit. Adherent to medication regimen.

Assessment: Continuing current management plan.

Plan: 
1. Continue current medications.
2. Follow up in 3 months.
3. Order routine lab work.`
          }));
          return 'AI Draft generated';
        },
        error: 'Failed to generate AI draft',
      }
    );
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Documents</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => toast.info('Exporting document...')}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => toast.info('Opening share menu...')}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            title="Share document"
          >
            <Share2 size={18} />
          </button>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button 
            onClick={handleSave}
            className="btn-primary flex items-center gap-2 px-4"
          >
            <Save size={16} />
            {document ? 'Update Document' : 'Save Document'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-base p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="text-primary" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    {document ? `Editing: ${document.type}` : 'Create New Clinical Document'}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {document ? `Last modified ${document.lastModified}` : 'Drafting a new clinical note'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleGenerateAI}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-semibold"
              >
                <Sparkles size={14} />
                AI Assist
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <User size={12} />
                    Patient Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="e.g. John Doe"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Hash size={12} />
                    Medical Record Number (MRN)
                  </label>
                  <input 
                    type="text" 
                    value={formData.mrn}
                    onChange={(e) => setFormData(prev => ({ ...prev, mrn: e.target.value }))}
                    placeholder="e.g. MRN-123456"
                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Tag size={12} />
                  Document Type
                </label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                >
                  <option value="SOAP Note">SOAP Note</option>
                  <option value="Progress Note">Progress Note</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Consultation Note">Consultation Note</option>
                  <option value="Operative Report">Operative Report</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  Clinical Narrative
                </label>
                <textarea 
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Start typing clinical notes here or use AI Assist..."
                  className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[300px] font-sans leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card-base p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Document Status</h3>
            <div className="space-y-2">
              {(['Draft', 'Pending Review', 'Finalized'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    formData.status === status 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/20'
                  }`}
                >
                  <span className="text-xs font-medium">{status}</span>
                  {formData.status === status && <CheckCircle size={14} />}
                </button>
              ))}
            </div>
            <div className="pt-2">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Finalizing a document will lock it for further edits and sync it with the hospital's EMR system.
              </p>
            </div>
          </div>

          <div className="card-base p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Metadata</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Author</span>
                <span className="text-xs font-medium text-foreground">{formData.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Organization</span>
                <span className="text-xs font-medium text-foreground">St. Jude Medical Center</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last Edited</span>
                <span className="text-xs font-medium text-foreground">{document?.lastModified || 'New'}</span>
              </div>
            </div>
          </div>

          {document && (
            <button 
              onClick={() => toast.error('Delete functionality restricted')}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-all text-xs font-medium"
            >
              <Trash2 size={14} />
              Delete Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
