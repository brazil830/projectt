import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import DigitalTwinEngine from './components/DigitalTwinEngine';

export default function DigitalTwinEnginePage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/digital-twin-engine">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Digital Twin Engine</h1>
              <p className="text-muted-foreground">
                Simulate patient outcomes and treatment paths using predictive modeling and
                historical clinical data.
              </p>
            </div>
            <DigitalTwinEngine />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('DigitalTwinEnginePage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/digital-twin-engine">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Digital Twin Engine page. Please try again or
              contact support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
