import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import SettingsPanel from './components/SettingsPanel';

export default function SettingsPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/settings">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your clinical profile, agent configurations, and system preferences.
                Configure EMR integration and security protocols.
              </p>
            </div>
            <SettingsPanel />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('SettingsPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/settings">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Settings page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
