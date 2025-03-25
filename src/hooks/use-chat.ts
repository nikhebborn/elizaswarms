import { useState, useEffect } from 'react';
import { Message } from '../lib/types/agent';
import { sendMessage, getMessages, clearChat } from '../lib/api/chat';

export function useChat(agentId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [agentId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(agentId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (content: string) => {
    try {
      setLoading(true);
      // Add optimistic user message
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API and get response
      const response = await sendMessage(agentId, content);
      
      // Update messages with actual response
      setMessages(prev => [...prev.filter(m => m.id !== userMessage.id), 
        {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content,
          timestamp: new Date()
        },
        response
      ]);
      
      setError(null);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      setLoading(true);
      await clearChat(agentId);
      setMessages([]);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to clear chat'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage: sendChatMessage,
    resetChat
  };
}
