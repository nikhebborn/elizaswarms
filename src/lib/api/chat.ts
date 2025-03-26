import axios from 'axios';
import { Agent, Knowledge, Message } from '../types/agent';

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

// Store chats in memory for development fallback
const mockChats: Record<string, Message[]> = {};

// Convert ELIZA message format to our app's format
const convertElizaMessageToAppMessage = (elizaMessage: any): Message => {
  return {
    id: elizaMessage.id,
    role: elizaMessage.role,
    content: elizaMessage.content,
    timestamp: new Date(elizaMessage.timestamp || Date.now())
  };
};

export const sendMessage = async (agentId: string, content: string): Promise<Message> => {
  try {
    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    // Call ELIZA API to send message to agent
    const response = await elizaApiClient.post(`/agents/${agentId}/chat`, {
      message: content
    });
    
    // Convert response to our app's format
    const assistantMessage = convertElizaMessageToAppMessage(response.data);
    
    // Store messages in mock storage for fallback
    if (!mockChats[agentId]) {
      mockChats[agentId] = [];
    }
    mockChats[agentId].push(userMessage);
    mockChats[agentId].push(assistantMessage);
    
    return assistantMessage;
  } catch (error) {
    console.error(`Error sending message to agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to direct Gemini API implementation
    console.warn('Falling back to direct Gemini API implementation for sendMessage');
    return fallbackSendMessage(agentId, content);
  }
};

// Fallback implementation using direct Gemini API
const fallbackSendMessage = async (agentId: string, content: string): Promise<Message> => {
  try {
    // Get the agent data
    const agent = await getAgent(agentId);
    
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }
    
    // Initialize chat history if it doesn't exist
    if (!mockChats[agentId]) {
      mockChats[agentId] = [];
    }
    
    // Add user message to history
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    mockChats[agentId].push(userMessage);
    
    // Get conversation history
    const conversationHistory = mockChats[agentId];
    
    // Format prompt for Gemini
    const prompt = formatPrompt(agent, conversationHistory);
    
    // Call Gemini API
    const response = await callGeminiAPI(prompt, content, agent);
    
    // Create assistant message
    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    // Add assistant message to history
    mockChats[agentId].push(assistantMessage);
    
    return assistantMessage;
  } catch (error) {
    console.error(`Error in fallback sendMessage for agent ${agentId}:`, error);
    
    // Return a basic error message if all else fails
    return {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: `Es tut mir leid, ich konnte keine Antwort generieren. Fehler: ${error.message}`,
      timestamp: new Date()
    };
  }
};

// Function to format agent context and knowledge for Gemini API (used in fallback)
const formatPrompt = (agent: Agent, messages: Message[]): string => {
  // Format agent persona, goals, and constraints
  const persona = agent.character.persona;
  const goals = agent.character.goals.join('\n- ');
  const constraints = agent.character.constraints.join('\n- ');
  
  // Format agent knowledge
  const knowledge = agent.knowledge
    .map(k => {
      if (k.type === 'text') {
        return k.content;
      } else if (k.type === 'url') {
        return `Information from URL: ${k.content}`;
      } else if (k.type === 'file') {
        return `Information from file ${k.filename}: ${k.content}`;
      }
      return '';
    })
    .join('\n\n');
  
  // Format conversation history
  const conversationHistory = messages
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');
  
  // Construct the full prompt
  return `
You are acting as an AI agent with the following characteristics:

PERSONA:
${persona}

GOALS:
- ${goals}

CONSTRAINTS:
- ${constraints}

${knowledge ? `KNOWLEDGE:\n${knowledge}\n\n` : ''}

CONVERSATION HISTORY:
${conversationHistory}
`;
};

// Function to call Gemini API (used in fallback)
const callGeminiAPI = async (prompt: string, userMessage: string, agent: Agent): Promise<string> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${agent.llm.model}:generateContent?key=${apiKey}`;
    
    const requestData = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${prompt}\n\nUser: ${userMessage}\n\nAssistant:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: agent.llm.temperature,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    const response = await axios.post(url, requestData);
    
    // Extract the generated text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    return generatedText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Es tut mir leid, ich konnte keine Antwort generieren. Fehler: ${error.message}`;
  }
};

export const getMessages = async (agentId: string): Promise<Message[]> => {
  try {
    // Call ELIZA API to get chat history
    const response = await elizaApiClient.get(`/agents/${agentId}/chat/history`);
    
    // Convert response to our app's format
    const messages = response.data.map(convertElizaMessageToAppMessage);
    return messages;
  } catch (error) {
    console.error(`Error fetching messages for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for getMessages');
    return mockChats[agentId] || [];
  }
};

export const clearChat = async (agentId: string): Promise<boolean> => {
  try {
    // Call ELIZA API to clear chat history
    await elizaApiClient.delete(`/agents/${agentId}/chat/history`);
    
    // Also clear local mock storage
    mockChats[agentId] = [];
    return true;
  } catch (error) {
    console.error(`Error clearing chat for agent ${agentId} with ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for clearChat');
    mockChats[agentId] = [];
    return true;
  }
};

// Helper function to get agent data
const getAgent = async (id: string): Promise<Agent | undefined> => {
  try {
    // Try to get agent from ELIZA API
    const response = await elizaApiClient.get(`/agents/${id}`);
    
    // Convert response to our app's format
    const agent = {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description || '',
      character: {
        persona: response.data.character?.persona || '',
        goals: response.data.character?.goals || [],
        constraints: response.data.character?.constraints || []
      },
      llm: {
        provider: response.data.llm?.provider || 'gemini',
        model: response.data.llm?.model || 'gemini-pro',
        temperature: response.data.llm?.temperature || 0.7
      },
      knowledge: response.data.knowledge?.map((k: any) => ({
        id: k.id,
        agentId: response.data.id,
        type: k.type,
        content: k.content,
        filename: k.filename,
        fileType: k.fileType,
        createdAt: new Date(k.createdAt || Date.now())
      })) || [],
      createdAt: new Date(response.data.createdAt || Date.now()),
      updatedAt: new Date(response.data.updatedAt || Date.now())
    };
    
    return agent;
  } catch (error) {
    console.error(`Error fetching agent ${id} from ELIZA API:`, error);
    
    // Fallback to mock implementation
    console.warn('Falling back to mock implementation for getAgent');
    const mockAgents = (global as any).mockAgents || [];
    return mockAgents.find((agent: Agent) => agent.id === id);
  }
};

// Create a room for multiple agents to interact
export const createRoom = async (name: string, description: string, agentIds: string[]): Promise<any> => {
  try {
    // Call ELIZA API to create a room
    const response = await elizaApiClient.post('/rooms', {
      name,
      description,
      participants: agentIds
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating room with ELIZA API:', error);
    throw error;
  }
};

// Send a message to a room
export const sendRoomMessage = async (roomId: string, content: string, senderId: string = 'user'): Promise<any> => {
  try {
    // Call ELIZA API to send message to room
    const response = await elizaApiClient.post(`/rooms/${roomId}/messages`, {
      content,
      senderId
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error sending message to room ${roomId} with ELIZA API:`, error);
    throw error;
  }
};

// Get messages from a room
export const getRoomMessages = async (roomId: string): Promise<any[]> => {
  try {
    // Call ELIZA API to get room messages
    const response = await elizaApiClient.get(`/rooms/${roomId}/messages`);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId} with ELIZA API:`, error);
    throw error;
  }
};
