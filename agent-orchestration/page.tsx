import React from 'react';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '@/components/AuthGuard';
import AgentOrchestrationPanel from '@/app/components/AgentOrchestrationPanel';

export default function AgentOrchestrationPage() {
  try {
    return (
      <AuthGuard>
        <AppLayout currentPath="/agent-orchestration">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Agent Orchestration</h1>
              <p className="text-muted-foreground">
                Monitor and manage active AI agents. Coordinate specialized clinical agents for
                documentation, coding, and prior authorization.
              </p>
            </div>
            <AgentOrchestrationPanel />
          </div>
        </AppLayout>
      </AuthGuard>
    );
  } catch (error) {
    console.error('AgentOrchestrationPage error:', error);
    return (
      <AuthGuard>
        <AppLayout currentPath="/agent-orchestration">
          <div className="card-base p-8">
            <h1 className="text-2xl font-bold text-danger mb-2">Error</h1>
            <p className="text-muted-foreground">
              An error occurred while loading the Agent Orchestration page. Please try again or
              contact support.
            </p>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }
}
