'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAgents } from '@/hooks/use-agents';
import { useChat } from '@/hooks/use-chat';
import { Agent } from '@/lib/types/agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ChatInterface } from '@/components/agents/chat-interface';

export default function TestAgentPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  
  const { fetchAgent, loading: agentLoading, error: agentError } = useAgents();
  const { 
    messages, 
    loading: chatLoading, 
    error: chatError,
    sendMessage,
    resetChat
  } = useChat(agentId);
  
  const [agent, setAgent] = useState<Agent | null>(null);
  
  useEffect(() => {
    const loadAgent = async () => {
      const data = await fetchAgent(agentId);
      if (data) {
        setAgent(data);
      }
    };
    
    loadAgent();
  }, [agentId, fetchAgent]);
  
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };
  
  const handleResetChat = async () => {
    await resetChat();
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
        <h1 className="text-2xl font-bold text-gray-900">Agent testen: {agent.name}</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/agents/${agentId}/manage`)}
          >
            Verwalten
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/agents')}
          >
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Agent-Informationen</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {agent.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Beschreibung:</span> {agent.description}
                </p>
                <p className="text-sm">
                  <span className="font-medium">LLM:</span> {agent.llm.provider} / {agent.llm.model}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Knowledge:</span> {agent.knowledge.length} Einträge
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-md font-medium mb-2">Charakter</h3>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Persona:</h4>
                    <p className="text-sm text-gray-600">{agent.character.persona}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Ziele:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {agent.character.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Einschränkungen:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {agent.character.constraints.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-4 h-full">
              <ChatInterface
                messages={messages}
                loading={chatLoading}
                error={chatError}
                onSendMessage={handleSendMessage}
                onResetChat={handleResetChat}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
