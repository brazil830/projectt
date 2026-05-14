'use client';

import React, { useState } from 'react';
import { Lock, Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';

const securityDetails: Record<string, string> = {
  'End-to-End Encryption': 'All data in transit and at rest is secured using AES-256 encryption. Keys are rotated dynamically via hardware security modules. Current status: Active, no anomalies.',
  'Zero-Trust Architecture': 'Continuous authentication and strict authorization are required for all service-to-service communications. Network micro-segmentation is active.',
  'Post-Quantum Cryptography': 'Hybrid key exchange mechanisms (X25519Kyber768Draft00) are deployed for critical infrastructure nodes to defend against future quantum threats.',
  'Multi-Factor Authentication': 'Hardware key or biometric verification is required for all clinical staff accessing sensitive PHI datasets.',
  'Zero-Retention Policy': 'In-memory processing only. No patient data is written to persistent disk storage during active clinical encounters.',
  'Automatic Session Purge': 'Sessions automatically terminate and purge all local state and caches after 15 minutes of inactivity or upon explicit logout.',
  'HIPAA Compliant': 'System architecture adheres strictly to the Health Insurance Portability and Accountability Act of 1996 (HIPAA) Security Rule.',
  'Audit Trail Enabled': 'Immutable, blockchain-backed audit logs record every read, write, and access action taken by clinical staff on PHI data.',
  'System Security Scan Complete': 'Automated scheduled vulnerability scan completed successfully. Scanned 14,203 files and endpoints. No CVEs, vulnerabilities, or misconfigurations detected. All systems fully operational.'
};

export default function SecurityPHI() {
  const [selectedDetail, setSelectedDetail] = useState<{ title: string; desc: string; type: string } | null>(null);

  const handleItemClick = (item: string, type: string) => {
    setSelectedDetail({
      title: item,
      desc: securityDetails[item] || 'Detailed specifications are currently restricted or under review.',
      type
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">Secure</p>
              <p className="text-xs text-muted-foreground">Threat Level</p>
            </div>
            <Shield className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">32ms</p>
              <p className="text-xs text-muted-foreground">Response Time</p>
            </div>
            <Activity className="text-muted-foreground" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">0</p>
              <p className="text-xs text-muted-foreground">Anomalies</p>
            </div>
            <CheckCircle className="text-success" size={20} />
          </div>
        </div>
        <div className="card-base p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">PHI Purged</p>
            </div>
            <Lock className="text-primary" size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Shield size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Security Protocols</h2>
          </div>
          <div className="p-4 space-y-3">
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('End-to-End Encryption', 'Protocol')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">End-to-End Encryption</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('Zero-Trust Architecture', 'Protocol')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Zero-Trust Architecture</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('Post-Quantum Cryptography', 'Protocol')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Post-Quantum Cryptography</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('Multi-Factor Authentication', 'Protocol')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Multi-Factor Authentication</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
          </div>
        </div>

        <div className="card-base overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Lock size={15} className="text-primary" />
            <h2 className="text-sm font-semibold text-foreground">PHI Management</h2>
          </div>
          <div className="p-4 space-y-3">
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('Zero-Retention Policy', 'Policy')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Zero-Retention Policy</span>
              </div>
              <span className="text-xs text-success">Enforced</span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('Automatic Session Purge', 'Policy')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Automatic Session Purge</span>
              </div>
              <span className="text-xs text-success">Enabled</span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('HIPAA Compliant', 'Compliance')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">HIPAA Compliant</span>
              </div>
              <span className="text-xs text-success">Verified</span>
            </div>
            <div
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              onClick={() => handleItemClick('Audit Trail Enabled', 'Protocol')}
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Audit Trail Enabled</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <AlertTriangle size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Recent Security Events</h2>
        </div>
        <div className="p-4">
          <div
            className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20 hover:bg-success/20 cursor-pointer transition-colors"
            onClick={() => handleItemClick('System Security Scan Complete', 'Event')}
          >
            <CheckCircle size={16} className="text-success" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">System Security Scan Complete</p>
              <p className="text-xs text-muted-foreground">
                No vulnerabilities detected. All systems operational.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">2 min ago</span>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm fade-in">
          <div className="w-full max-w-md card-base bg-card shadow-2xl overflow-hidden slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Security Detail</h3>
                  <p className="text-xs text-primary font-mono-data tracking-wider uppercase">{selectedDetail.type}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-base font-semibold text-foreground border-b border-border pb-2">{selectedDetail.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedDetail.desc}
              </p>
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedDetail(null)}
                  className="btn-primary px-6 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
