'use client';

import React from 'react';
import { AgentForm } from '@/components/agents/agent-form';

export default function CreateAgentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Neuen Agent erstellen</h1>
      <AgentForm />
    </div>
  );
}
