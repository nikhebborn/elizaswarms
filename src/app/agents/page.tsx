'use client';

import React from 'react';
import { useAgents } from '@/hooks/use-agents';
import { AgentList } from '@/components/agents/agent-list';

export default function AgentsPage() {
  const { agents, loading, error, removeAgent } = useAgents();
  
  return (
    <div>
      <AgentList 
        agents={agents} 
        loading={loading} 
        error={error} 
        onDelete={removeAgent} 
      />
    </div>
  );
}
