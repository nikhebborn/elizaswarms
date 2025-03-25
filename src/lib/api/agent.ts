import axios from 'axios';
import { Agent, Knowledge } from '../types/agent';

// Mock data for development
const mockAgents: Agent[] = [];

// API functions for agent operations
export const createAgent = async (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> => {
  try {
    // In a real implementation, this would call the ELIZA API
    // For now, we'll create a mock implementation
    const newAgent: Agent = {
      ...agent,
      id: `agent-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      knowledge: []
    };
    
    mockAgents.push(newAgent);
    return newAgent;
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

export const getAgents = async (): Promise<Agent[]> => {
  try {
    // In a real implementation, this would call the ELIZA API
    return mockAgents;
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

export const getAgent = async (id: string): Promise<Agent | undefined> => {
  try {
    // In a real implementation, this would call the ELIZA API
    return mockAgents.find(agent => agent.id === id);
  } catch (error) {
    console.error(`Error fetching agent ${id}:`, error);
    throw error;
  }
};

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent | undefined> => {
  try {
    // In a real implementation, this would call the ELIZA API
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) return undefined;
    
    const updatedAgent = {
      ...mockAgents[agentIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    mockAgents[agentIndex] = updatedAgent;
    return updatedAgent;
  } catch (error) {
    console.error(`Error updating agent ${id}:`, error);
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call the ELIZA API
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) return false;
    
    mockAgents.splice(agentIndex, 1);
    return true;
  } catch (error) {
    console.error(`Error deleting agent ${id}:`, error);
    throw error;
  }
};

export const addKnowledge = async (agentId: string, knowledge: Omit<Knowledge, 'id' | 'agentId' | 'createdAt'>): Promise<Knowledge | undefined> => {
  try {
    // In a real implementation, this would call the ELIZA API
    const agentIndex = mockAgents.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) return undefined;
    
    const newKnowledge: Knowledge = {
      ...knowledge,
      id: `knowledge-${Date.now()}`,
      agentId,
      createdAt: new Date()
    };
    
    mockAgents[agentIndex].knowledge.push(newKnowledge);
    mockAgents[agentIndex].updatedAt = new Date();
    
    return newKnowledge;
  } catch (error) {
    console.error(`Error adding knowledge to agent ${agentId}:`, error);
    throw error;
  }
};

export const deleteKnowledge = async (agentId: string, knowledgeId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call the ELIZA API
    const agentIndex = mockAgents.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) return false;
    
    const knowledgeIndex = mockAgents[agentIndex].knowledge.findIndex(k => k.id === knowledgeId);
    if (knowledgeIndex === -1) return false;
    
    mockAgents[agentIndex].knowledge.splice(knowledgeIndex, 1);
    mockAgents[agentIndex].updatedAt = new Date();
    
    return true;
  } catch (error) {
    console.error(`Error deleting knowledge ${knowledgeId} from agent ${agentId}:`, error);
    throw error;
  }
};
