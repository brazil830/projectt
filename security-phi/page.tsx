import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import SecurityPHI from './components/SecurityPHI';

export default function SecurityPHIPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/security-phi">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Security & PHI</h1>
              <p className="text-muted-foreground">
                Zero-retention PHI processing engine and security threat monitor. Advanced
                encryption management and compliance verification.
              </p>
            </div>
            <SecurityPHI />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('SecurityPHIPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/security-phi">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Security & PHI page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
