import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import DashboardHeader from '../components/DashboardHeader';
import MetricsBentoGrid from '../components/MetricsBentoGrid';
import ThreatMonitorWidget from '../components/ThreatMonitorWidget';

export default function ClinicalDashboardPage() {
  return (
    <AuthGuard>
      <AppLayout currentPath="/dashboard">
        <DashboardHeader />
        <MetricsBentoGrid />
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <ThreatMonitorWidget />
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
