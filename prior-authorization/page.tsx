import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import PriorAuthPipeline from '@/app/components/PriorAuthPipeline';

export default function PriorAuthorizationPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/prior-authorization">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Prior Authorization</h1>
              <p className="text-muted-foreground">
                Automated prior authorization pipeline. Track submissions, review payer
                requirements, and manage clinical justifications.
              </p>
            </div>
            <PriorAuthPipeline />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('PriorAuthorizationPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/prior-authorization">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Prior Authorization page. Please try again or
              contact support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
