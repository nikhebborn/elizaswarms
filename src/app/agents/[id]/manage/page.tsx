'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAgents } from '@/hooks/use-agents';
import { Agent } from '@/lib/types/agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { AgentForm } from '@/components/agents/agent-form';
import { KnowledgeManager } from '@/components/agents/knowledge-manager';
import { formatAgentForForm } from '@/lib/utils/helpers';

export default function ManageAgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  
  const { fetchAgent, loading: agentLoading, error: agentError } = useAgents();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'knowledge'>('details');
  
  useEffect(() => {
    const loadAgent = async () => {
      const data = await fetchAgent(agentId);
      if (data) {
        setAgent(data);
      }
    };
    
    loadAgent();
  }, [agentId, fetchAgent]);
  
  const handleKnowledgeChange = async () => {
    // Refresh agent data to get updated knowledge
    const updatedAgent = await fetchAgent(agentId);
    if (updatedAgent) {
      setAgent(updatedAgent);
    }
  };
  
  if (agentLoading && !agent) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (agentError && !agent) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Fehler beim Laden des Agents: {agentError.message}</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/agents')}
        >
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
        <p>Agent nicht gefunden.</p>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/agents')}
        >
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent verwalten: {agent.name}</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/agents/${agentId}/test`)}
          >
            Testen
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/agents')}
          >
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'details' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'knowledge' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('knowledge')}
          >
            Knowledge
          </button>
        </div>
      </div>
      
      {activeTab === 'details' && (
        <AgentForm initialValues={formatAgentForForm(agent)} agentId={agent.id} />
      )}
      
      {activeTab === 'knowledge' && (
        <Card>
          <CardContent className="py-6">
            <KnowledgeManager
              agentId={agent.id}
              knowledgeItems={agent.knowledge}
              onKnowledgeChange={handleKnowledgeChange}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
