import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import DocumentationWorkspace from './components/DocumentationWorkspace';

export default function DocumentationPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/documentation">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Documentation</h1>
              <p className="text-muted-foreground">
                Comprehensive clinical documentation management with AI-assisted SOAP note
                generation and longitudinal patient record tracking.
              </p>
            </div>
            <DocumentationWorkspace />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('DocumentationPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/documentation">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Documentation page. Please try again or contact
              support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
