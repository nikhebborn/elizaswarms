import React, { useState } from 'react';
import { Agent } from '@/lib/types/agent';
import { AgentCard } from './agent-card';
import { SearchBar } from '@/components/shared/search-bar';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AgentListProps {
  agents: Agent[];
  loading: boolean;
  error: Error | null;
  onDelete?: (id: string) => void;
}

export function AgentList({ agents, loading, error, onDelete }: AgentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Fehler beim Laden der Agents: {error.message}</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
        <Link href="/agents/create">
          <Button>Neuen Agent erstellen</Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <SearchBar 
          placeholder="Agents durchsuchen..." 
          value={searchTerm} 
          onChange={setSearchTerm} 
        />
      </div>
      
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            {searchTerm 
              ? `Keine Agents gefunden für "${searchTerm}"`
              : 'Keine Agents vorhanden. Erstellen Sie Ihren ersten Agent!'}
          </p>
          {searchTerm ? (
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800"
              onClick={() => setSearchTerm('')}
            >
              Suche zurücksetzen
            </button>
          ) : (
            <Link href="/agents/create" className="mt-4 inline-block">
              <Button>Ersten Agent erstellen</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
