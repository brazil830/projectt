'use client';

import React from 'react';
import { useSession } from '@/context/SessionContext';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function DashboardHeader() {
  const { user, emrSyncStatus } = useSession();

  const now = new Date();
  const dateStr = `${DAYS?.[now?.getDay()]}, ${MONTHS?.[now?.getMonth()]} ${now?.getDate()}, ${now?.getFullYear()}`;
  const shift = user?.shift ?? 'Morning Shift';
  const org = user?.organization ?? 'Valley Medical Center';
  const floor = user?.floor ?? 'Floor 4';

  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Clinical Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {dateStr} · {shift} · {org}, {floor}
        </p>
        {user && (
          <p className="text-xs text-primary mt-0.5">
            Welcome back, {user?.name} — {user?.role}
          </p>
        )}
      </div>
    </div>
  );
}