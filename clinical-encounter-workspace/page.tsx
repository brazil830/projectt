import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import EncounterWorkspaceShell from './components/EncounterWorkspaceShell';

export default function ClinicalEncounterWorkspacePage() {
  return (
    <AuthGuard>
      <AppLayout currentPath="/clinical-encounter-workspace">
        <EncounterWorkspaceShell />
      </AppLayout>
    </AuthGuard>
  );
}