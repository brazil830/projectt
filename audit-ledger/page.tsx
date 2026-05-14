import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import AuditLedgerFeed from '@/app/components/AuditLedgerFeed';

export default function AuditLedgerPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/audit-ledger">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Audit Ledger</h1>
              <p className="text-muted-foreground">
                Immutable blockchain-backed audit trail of all PHI access and system interactions.
                Compliance reporting and forensic access logs.
              </p>
            </div>
            <AuditLedgerFeed />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('AuditLedgerPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/audit-ledger">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Audit Ledger page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
