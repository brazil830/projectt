import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import PatientRegistry from './components/PatientRegistry';

export default function PatientRegistryPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/patient-registry">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Patient Registry</h1>
              <p className="text-muted-foreground">
                Centralized longitudinal patient records with AI-synthesized clinical summaries and
                automated registry updates.
              </p>
            </div>
            <PatientRegistry />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('PatientRegistryPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/patient-registry">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Patient Registry page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
