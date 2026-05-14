import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import AlertsDashboard from './components/AlertsDashboard';

export default function AlertsPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/alerts">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Alerts</h1>
              <p className="text-muted-foreground">
                Real-time clinical alerts and system notifications. Monitor critical vitals, coding
                discrepancies, and security events.
              </p>
            </div>
            <AlertsDashboard />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('AlertsPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/alerts">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Alerts page. Please try again or contact support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
