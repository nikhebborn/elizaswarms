import React from 'react';
import { Agent } from '@/lib/types/agent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AgentCardProps {
  agent: Agent;
  onDelete?: (id: string) => void;
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{agent.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-500 mb-2">
          {agent.description}
        </p>
        <div className="mt-4">
          <div className="text-xs text-gray-500">
            LLM: {agent.llm.provider} / {agent.llm.model}
          </div>
          <div className="text-xs text-gray-500">
            Knowledge: {agent.knowledge.length} Einträge
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-2">
          <Link href={`/agents/${agent.id}/manage`}>
            <Button variant="outline" size="sm">Verwalten</Button>
          </Link>
          <Link href={`/agents/${agent.id}/test`}>
            <Button variant="outline" size="sm">Testen</Button>
          </Link>
        </div>
        {onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
            onClick={() => onDelete(agent.id)}
          >
            Löschen
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
