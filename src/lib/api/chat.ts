import { Agent, Knowledge, Message } from '../types/agent';

// Mock chat implementation for development
const mockChats: Record<string, Message[]> = {};

export const sendMessage = async (agentId: string, content: string): Promise<Message> => {
  try {
    // In a real implementation, this would call the ELIZA API with Gemini integration
    // For now, we'll create a mock implementation
    if (!mockChats[agentId]) {
      mockChats[agentId] = [];
    }
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    mockChats[agentId].push(userMessage);
    
    // Generate mock response
    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: `Dies ist eine Testantwort auf Ihre Nachricht: "${content}". In der vollständigen Implementierung würde hier die Antwort vom Gemini LLM stehen.`,
      timestamp: new Date()
    };
    
    mockChats[agentId].push(assistantMessage);
    return assistantMessage;
  } catch (error) {
    console.error(`Error sending message to agent ${agentId}:`, error);
    throw error;
  }
};

export const getMessages = async (agentId: string): Promise<Message[]> => {
  try {
    // In a real implementation, this would call the ELIZA API
    return mockChats[agentId] || [];
  } catch (error) {
    console.error(`Error fetching messages for agent ${agentId}:`, error);
    throw error;
  }
};

export const clearChat = async (agentId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call the ELIZA API
    mockChats[agentId] = [];
    return true;
  } catch (error) {
    console.error(`Error clearing chat for agent ${agentId}:`, error);
    throw error;
  }
};
