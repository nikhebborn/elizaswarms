import { Agent, Knowledge } from '../types/agent';

// Helper function to format agent data for API requests
export const formatAgentForApi = (formData: any): Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    name: formData.name,
    description: formData.description,
    character: {
      persona: formData.persona,
      goals: Array.isArray(formData.goals) 
        ? formData.goals 
        : formData.goals.split(',').map((goal: string) => goal.trim()),
      constraints: Array.isArray(formData.constraints) 
        ? formData.constraints 
        : formData.constraints.split(',').map((constraint: string) => constraint.trim()),
    },
    llm: {
      provider: formData.provider,
      model: formData.model,
      temperature: typeof formData.temperature === 'string' 
        ? parseFloat(formData.temperature) 
        : formData.temperature,
    },
    knowledge: formData.knowledge || [],
  };
};

// Helper function to format agent data for form
export const formatAgentForForm = (agent: Agent) => {
  return {
    name: agent.name,
    description: agent.description,
    persona: agent.character.persona,
    goals: Array.isArray(agent.character.goals) 
      ? agent.character.goals.join(', ') 
      : agent.character.goals,
    constraints: Array.isArray(agent.character.constraints) 
      ? agent.character.constraints.join(', ') 
      : agent.character.constraints,
    provider: agent.llm.provider,
    model: agent.llm.model,
    temperature: agent.llm.temperature,
  };
};

// Helper function to validate file types for knowledge upload
export const isValidFileType = (file: File): boolean => {
  const validTypes = ['.txt', '.pdf', '.md', 'text/plain', 'application/pdf', 'text/markdown'];
  const fileType = file.type;
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  return validTypes.includes(fileType) || validTypes.includes(fileExtension);
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
