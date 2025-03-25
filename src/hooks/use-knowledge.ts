import { useState } from 'react';
import { Knowledge } from '../lib/types/agent';
import { uploadFile, addTextKnowledge, addUrlKnowledge } from '../lib/api/knowledge';
import { addKnowledge, deleteKnowledge } from '../lib/api/agent';

export function useKnowledge(agentId: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadKnowledgeFile = async (file: File) => {
    try {
      setLoading(true);
      const knowledge = await uploadFile(file, agentId);
      const addedKnowledge = await addKnowledge(agentId, knowledge);
      setError(null);
      return addedKnowledge;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload file'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const addKnowledgeText = async (text: string) => {
    try {
      setLoading(true);
      const knowledge = await addTextKnowledge(text, agentId);
      const addedKnowledge = await addKnowledge(agentId, knowledge);
      setError(null);
      return addedKnowledge;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add text knowledge'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const addKnowledgeUrl = async (url: string) => {
    try {
      setLoading(true);
      const knowledge = await addUrlKnowledge(url, agentId);
      const addedKnowledge = await addKnowledge(agentId, knowledge);
      setError(null);
      return addedKnowledge;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add URL knowledge'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const removeKnowledge = async (knowledgeId: string) => {
    try {
      setLoading(true);
      const success = await deleteKnowledge(agentId, knowledgeId);
      setError(null);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete knowledge ${knowledgeId}`));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    uploadKnowledgeFile,
    addKnowledgeText,
    addKnowledgeUrl,
    removeKnowledge
  };
}
