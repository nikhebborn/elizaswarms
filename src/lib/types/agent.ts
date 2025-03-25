export interface Agent {
  id: string;
  name: string;
  description: string;
  character: {
    persona: string;
    goals: string[];
    constraints: string[];
  };
  llm: {
    provider: string;
    model: string;
    temperature: number;
  };
  knowledge: Knowledge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Knowledge {
  id: string;
  agentId: string;
  type: 'text' | 'file' | 'url';
  content: string;
  filename?: string;
  fileType?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
