import axios from 'axios';
import { Agent, Knowledge } from '../types/agent';

// ELIZA API configuration
const ELIZA_API_BASE_URL = process.env.NEXT_PUBLIC_ELIZA_API_URL || 'https://api.eliza.how';
const ELIZA_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Using the same key for now

// Helper function for API calls
const elizaApiClient = axios.create({
  baseURL: ELIZA_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ELIZA_API_KEY}`
  }
});

// Fallback to mock data for development if API calls fail
const mockAgents: Agent[] = [];

// Convert ELIZA agent format to our app's format
const convertElizaAgentToAppAgent = (elizaAgent: any): Agent => {
  return {
    id: elizaAgent.id,
    name: elizaAgent.name,
    description: elizaAgent.description || '',
    character: {
      persona: elizaAgent.character?.persona || '',
      goals: elizaAgent.character?.goals || [],
      constraints: elizaAgent.character?.constraints || []
    },
    llm: {
      provider: elizaAgent.llm?.provider || 'gemini',
      model: elizaAgent.llm?.model || 'gemini-pro',
      temperature: elizaAgent.llm?.temperature || 0.7
    },
    knowledge: elizaAgent.knowledge?.map((k: any) => ({
      id: k.id,
      agentId: elizaAgent.id,
      type: k.type,
      content: k.content,
      filename: k.filename,
      fileType: k.fileType,
      createdAt: new Date(k.createdAt || Date.now())
    })) || [],
    createdAt: new Date(elizaAgent.createdAt || Date.now()),
    updatedAt: new Date(elizaAgent.updatedAt || Date.now())
  };
};

// Convert our app's agent format to ELIZA format
const convertAppAgentToElizaAgent = (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
  return {
    name: agent.name,
    description: agent.description,
    character: {
      persona: agent.character.persona,
      goals: agent.character.goals,
      constraints: agent.character.constraints
    },
    llm: {
      provider: agent.llm.provider,
      model: agent.llm.model,
      temperature: agent.llm.temperature
    },
    knowledge: agent.knowledge?.map(k => ({
      type: k.type,
      content: k.content,
      filename: k.filename,
      fileType: k.fileType
    })) || []
  };
};

// API functions for agent operations
export const createAgent = async (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> => {
  try {
    // Convert to ELIZA format
    const elizaAgent = convertAppAgentToElizaAgent(agent);
    
    // Call ELIZA API to create agent
    const response = await elizaApiClient.post('/agents', elizaAgent);
    
    // Convert response to our app's format
    const newAgent = convertElizaAgentToAppAgent(response.data);
    return newAgent;
  } catch (error) {
    console.error('Error creating agent with ELIZA API:', error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for createAgent');
    const newAgent: Agent = {
      ...agent,
      id: `agent-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      knowledge: []
    };
    
    mockAgents.push(newAgent);
    return newAgent;
  }
};

export const getAgents = async (): Promise<Agent[]> => {
  try {
    // Call ELIZA API to get all agents
    const response = await elizaApiClient.get('/agents');
    
    // Convert response to our app's format
    const agents = response.data.map(convertElizaAgentToAppAgent);
    return agents;
  } catch (error) {
    console.error('Error fetching agents from ELIZA API:', error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for getAgents');
    return mockAgents;
  }
};

export const getAgent = async (id: string): Promise<Agent | undefined> => {
  try {
    // Call ELIZA API to get specific agent
    const response = await elizaApiClient.get(`/agents/${id}`);
    
    // Convert response to our app's format
    const agent = convertElizaAgentToAppAgent(response.data);
    return agent;
  } catch (error) {
    console.error(`Error fetching agent ${id} from ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for getAgent');
    return mockAgents.find(agent => agent.id === id);
  }
};

export const updateAgent = async (id: string, updates: Partial<Agent>): Promise<Agent | undefined> => {
  try {
    // Call ELIZA API to update agent
    const response = await elizaApiClient.patch(`/agents/${id}`, updates);
    
    // Convert response to our app's format
    const updatedAgent = convertElizaAgentToAppAgent(response.data);
    return updatedAgent;
  } catch (error) {
    console.error(`Error updating agent ${id} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for updateAgent');
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) return undefined;
    
    const updatedAgent = {
      ...mockAgents[agentIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    mockAgents[agentIndex] = updatedAgent;
    return updatedAgent;
  }
};

export const deleteAgent = async (id: string): Promise<boolean> => {
  try {
    // Call ELIZA API to delete agent
    await elizaApiClient.delete(`/agents/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting agent ${id} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for deleteAgent');
    const agentIndex = mockAgents.findIndex(agent => agent.id === id);
    if (agentIndex === -1) return false;
    
    mockAgents.splice(agentIndex, 1);
    return true;
  }
};

export const addKnowledge = async (agentId: string, knowledge: Omit<Knowledge, 'id' | 'agentId' | 'createdAt'>): Promise<Knowledge | undefined> => {
  try {
    // Call ELIZA API to add knowledge to agent
    const response = await elizaApiClient.post(`/agents/${agentId}/knowledge`, {
      type: knowledge.type,
      content: knowledge.content,
      filename: knowledge.filename,
      fileType: knowledge.fileType
    });
    
    // Convert response to our app's format
    const newKnowledge: Knowledge = {
      id: response.data.id,
      agentId: agentId,
      type: response.data.type,
      content: response.data.content,
      filename: response.data.filename,
      fileType: response.data.fileType,
      createdAt: new Date(response.data.createdAt || Date.now())
    };
    
    return newKnowledge;
  } catch (error) {
    console.error(`Error adding knowledge to agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for addKnowledge');
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
  }
};

export const deleteKnowledge = async (agentId: string, knowledgeId: string): Promise<boolean> => {
  try {
    // Call ELIZA API to delete knowledge
    await elizaApiClient.delete(`/agents/${agentId}/knowledge/${knowledgeId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting knowledge ${knowledgeId} from agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for deleteKnowledge');
    const agentIndex = mockAgents.findIndex(agent => agent.id === agentId);
    if (agentIndex === -1) return false;
    
    const knowledgeIndex = mockAgents[agentIndex].knowledge.findIndex(k => k.id === knowledgeId);
    if (knowledgeIndex === -1) return false;
    
    mockAgents[agentIndex].knowledge.splice(knowledgeIndex, 1);
    mockAgents[agentIndex].updatedAt = new Date();
    
    return true;
  }
};

// Make mockAgents globally accessible for other modules
(global as any).mockAgents = mockAgents;
