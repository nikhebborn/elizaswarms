import axios from 'axios';
import { Knowledge } from '../types/agent';

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

// Convert ELIZA knowledge format to our app's format
const convertElizaKnowledgeToAppKnowledge = (elizaKnowledge: any, agentId: string): Knowledge => {
  return {
    id: elizaKnowledge.id,
    agentId: agentId,
    type: elizaKnowledge.type,
    content: elizaKnowledge.content,
    filename: elizaKnowledge.filename,
    fileType: elizaKnowledge.fileType,
    createdAt: new Date(elizaKnowledge.createdAt || Date.now())
  };
};

export const uploadFile = async (file: File, agentId: string): Promise<Knowledge> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('agentId', agentId);
    formData.append('type', 'file');
    
    // Call ELIZA API to upload file
    const response = await axios.post(
      `${ELIZA_API_BASE_URL}/agents/${agentId}/knowledge/file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${ELIZA_API_KEY}`
        }
      }
    );
    
    // Convert response to our app's format
    const newKnowledge = convertElizaKnowledgeToAppKnowledge(response.data, agentId);
    return newKnowledge;
  } catch (error) {
    console.error(`Error uploading file for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for uploadFile');
    const newKnowledge: Knowledge = {
      id: `knowledge-${Date.now()}`,
      agentId,
      type: 'file',
      content: `Dateiinhalt von ${file.name}`,
      filename: file.name,
      fileType: file.type,
      createdAt: new Date()
    };
    
    // Add to mock agent's knowledge if available
    const mockAgents = (global as any).mockAgents || [];
    const agentIndex = mockAgents.findIndex((agent: any) => agent.id === agentId);
    if (agentIndex !== -1) {
      mockAgents[agentIndex].knowledge.push(newKnowledge);
      mockAgents[agentIndex].updatedAt = new Date();
    }
    
    return newKnowledge;
  }
};

export const addTextKnowledge = async (text: string, agentId: string): Promise<Knowledge> => {
  try {
    // Call ELIZA API to add text knowledge
    const response = await elizaApiClient.post(`/agents/${agentId}/knowledge`, {
      type: 'text',
      content: text
    });
    
    // Convert response to our app's format
    const newKnowledge = convertElizaKnowledgeToAppKnowledge(response.data, agentId);
    return newKnowledge;
  } catch (error) {
    console.error(`Error adding text knowledge for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for addTextKnowledge');
    const newKnowledge: Knowledge = {
      id: `knowledge-${Date.now()}`,
      agentId,
      type: 'text',
      content: text,
      createdAt: new Date()
    };
    
    // Add to mock agent's knowledge if available
    const mockAgents = (global as any).mockAgents || [];
    const agentIndex = mockAgents.findIndex((agent: any) => agent.id === agentId);
    if (agentIndex !== -1) {
      mockAgents[agentIndex].knowledge.push(newKnowledge);
      mockAgents[agentIndex].updatedAt = new Date();
    }
    
    return newKnowledge;
  }
};

export const addUrlKnowledge = async (url: string, agentId: string): Promise<Knowledge> => {
  try {
    // Call ELIZA API to add URL knowledge
    const response = await elizaApiClient.post(`/agents/${agentId}/knowledge`, {
      type: 'url',
      content: url
    });
    
    // Convert response to our app's format
    const newKnowledge = convertElizaKnowledgeToAppKnowledge(response.data, agentId);
    return newKnowledge;
  } catch (error) {
    console.error(`Error adding URL knowledge for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for addUrlKnowledge');
    const newKnowledge: Knowledge = {
      id: `knowledge-${Date.now()}`,
      agentId,
      type: 'url',
      content: url,
      createdAt: new Date()
    };
    
    // Add to mock agent's knowledge if available
    const mockAgents = (global as any).mockAgents || [];
    const agentIndex = mockAgents.findIndex((agent: any) => agent.id === agentId);
    if (agentIndex !== -1) {
      mockAgents[agentIndex].knowledge.push(newKnowledge);
      mockAgents[agentIndex].updatedAt = new Date();
    }
    
    return newKnowledge;
  }
};

// Additional functions for knowledge management

export const getKnowledge = async (agentId: string, knowledgeId: string): Promise<Knowledge | undefined> => {
  try {
    // Call ELIZA API to get specific knowledge item
    const response = await elizaApiClient.get(`/agents/${agentId}/knowledge/${knowledgeId}`);
    
    // Convert response to our app's format
    const knowledge = convertElizaKnowledgeToAppKnowledge(response.data, agentId);
    return knowledge;
  } catch (error) {
    console.error(`Error fetching knowledge ${knowledgeId} for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for getKnowledge');
    const mockAgents = (global as any).mockAgents || [];
    const agent = mockAgents.find((a: any) => a.id === agentId);
    if (!agent) return undefined;
    
    return agent.knowledge.find((k: Knowledge) => k.id === knowledgeId);
  }
};

export const getAllKnowledge = async (agentId: string): Promise<Knowledge[]> => {
  try {
    // Call ELIZA API to get all knowledge for an agent
    const response = await elizaApiClient.get(`/agents/${agentId}/knowledge`);
    
    // Convert response to our app's format
    const knowledgeItems = response.data.map((item: any) => 
      convertElizaKnowledgeToAppKnowledge(item, agentId)
    );
    return knowledgeItems;
  } catch (error) {
    console.error(`Error fetching all knowledge for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for getAllKnowledge');
    const mockAgents = (global as any).mockAgents || [];
    const agent = mockAgents.find((a: any) => a.id === agentId);
    if (!agent) return [];
    
    return agent.knowledge;
  }
};

export const deleteKnowledge = async (agentId: string, knowledgeId: string): Promise<boolean> => {
  try {
    // Call ELIZA API to delete knowledge
    await elizaApiClient.delete(`/agents/${agentId}/knowledge/${knowledgeId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting knowledge ${knowledgeId} for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for deleteKnowledge');
    const mockAgents = (global as any).mockAgents || [];
    const agentIndex = mockAgents.findIndex((a: any) => a.id === agentId);
    if (agentIndex === -1) return false;
    
    const knowledgeIndex = mockAgents[agentIndex].knowledge.findIndex((k: Knowledge) => k.id === knowledgeId);
    if (knowledgeIndex === -1) return false;
    
    mockAgents[agentIndex].knowledge.splice(knowledgeIndex, 1);
    mockAgents[agentIndex].updatedAt = new Date();
    
    return true;
  }
};
