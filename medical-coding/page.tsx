import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import MedicalCodingWorkspace from './components/MedicalCodingWorkspace';

export default function MedicalCodingPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/medical-coding">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Medical Coding</h1>
              <p className="text-muted-foreground">
                Autonomous ICD-10 and CPT code extraction from clinical narratives with real-time
                HCC risk adjustment and auditing.
              </p>
            </div>
            <MedicalCodingWorkspace />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('MedicalCodingPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/medical-coding">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Medical Coding page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
