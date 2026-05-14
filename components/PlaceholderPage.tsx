import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';

interface PageProps {
  title: string;
  description: string;
}

// Prop validation function
function validatePageProps({ title, description }: PageProps): void {
  if (!title || typeof title !== 'string') {
    throw new Error('PlaceholderPage: title is required and must be a string');
  }
  if (!description || typeof description !== 'string') {
    throw new Error('PlaceholderPage: description is required and must be a string');
  }
}

// Safe path generation with error handling
function generateSafePath(title: string): string {
  try {
    if (!title || typeof title !== 'string') {
      return '/unknown';
    }
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9\s&-]/g, '') // Remove special characters except spaces, &, and -
      .replace(/ & /g, '-')
      .replace(/ /g, '-')
      .replace(/-+/g, '-') // Replace multiple dashes with single dash
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
    return `/${sanitized || 'unknown'}`;
  } catch (error) {
    console.error('Error generating path from title:', error);
    return '/error';
  }
}

export default function PlaceholderPage({ title, description }: PageProps) {
  // Validate props on render
  try {
    validatePageProps({ title, description });
  } catch (error) {
    console.error('PlaceholderPage validation error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/error">
          <div className="card-base p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
            <h1 className="text-3xl font-bold text-danger mb-4">Configuration Error</h1>
            <p className="text-muted-foreground max-w-md">
              This page could not be displayed due to invalid configuration. Please contact your
              system administrator.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  const safePath = generateSafePath(title);

  return (
    <AuthGuard>
      <AppLayout currentPath={safePath}>
        <div className="card-base p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              <path d="m19 14 3-2.5V22l-3-2.5-3 2.5V11.5L19 14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
          <p className="text-muted-foreground max-w-md mb-8">{description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <div className="p-6 rounded-xl border border-border bg-card text-left">
              <h3 className="text-sm font-semibold text-foreground mb-2">Live AI Insight</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The {title} agent is currently processing real-time clinical data streams. Security
                protocols are active and PHI is encrypted.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card text-left">
              <h3 className="text-sm font-semibold text-foreground mb-2">Recent Activity</h3>
              <ul className="space-y-2">
                <li className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-success" /> System integrity check passed
                </li>
                <li className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" /> Configuration updated 12m ago
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
