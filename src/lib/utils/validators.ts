import { z } from 'zod';

export const agentFormSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  persona: z.string().min(1, 'Persona ist erforderlich'),
  goals: z.string().min(1, 'Ziele sind erforderlich'),
  constraints: z.string().min(1, 'Einschränkungen sind erforderlich'),
  provider: z.string().min(1, 'Provider ist erforderlich'),
  model: z.string().min(1, 'Modell ist erforderlich'),
  temperature: z.number(),
});

export type AgentFormValues = z.infer<typeof agentFormSchema>;

export const knowledgeFormSchema = z.object({
  type: z.enum(['text', 'file', 'url']),
  content: z.string().min(1, 'Inhalt ist erforderlich'),
  filename: z.string().optional(),
  fileType: z.string().optional(),
});

export type KnowledgeFormValues = z.infer<typeof knowledgeFormSchema>;
