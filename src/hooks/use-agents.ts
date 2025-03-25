import { useState, useEffect } from 'react';
import { Agent } from '../lib/types/agent';
import { getAgents, getAgent, createAgent, updateAgent, deleteAgent } from '../lib/api/agent';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAgents();
      setAgents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
    } finally {
      setLoading(false);
    }
  };

  const fetchAgent = async (id: string) => {
    try {
      setLoading(true);
      const agent = await getAgent(id);
      setError(null);
      return agent;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch agent ${id}`));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (newAgent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const agent = await createAgent(newAgent);
      setAgents(prev => [...prev, agent]);
      setError(null);
      return agent;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create agent'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const editAgent = async (id: string, updates: Partial<Agent>) => {
    try {
      setLoading(true);
      const updatedAgent = await updateAgent(id, updates);
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => agent.id === id ? updatedAgent : agent));
      }
      setError(null);
      return updatedAgent;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update agent ${id}`));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const removeAgent = async (id: string) => {
    try {
      setLoading(true);
      const success = await deleteAgent(id);
      if (success) {
        setAgents(prev => prev.filter(agent => agent.id !== id));
      }
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete agent ${id}`));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    agents,
    loading,
    error,
    fetchAgents,
    fetchAgent,
    addAgent,
    editAgent,
    removeAgent
  };
}
