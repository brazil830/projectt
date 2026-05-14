import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import SchedulingWorkspace from './components/SchedulingWorkspace';

export default function SchedulingPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/scheduling">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Scheduling</h1>
              <p className="text-muted-foreground">
                Intelligent clinic scheduling and resource optimization. AI-driven gap analysis and
                automated patient outreach for appointment confirmation.
              </p>
            </div>
            <SchedulingWorkspace />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('SchedulingPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/scheduling">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Scheduling page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
