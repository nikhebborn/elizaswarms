'use client';

import React, { useState } from 'react';
import { Message } from '@/lib/types/agent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface ChatInterfaceProps {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  onSendMessage: (content: string) => Promise<void>;
  onResetChat: () => Promise<void>;
}

export function ChatInterface({
  messages,
  loading,
  error,
  onSendMessage,
  onResetChat
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    
    await onSendMessage(inputValue);
    setInputValue('');
  };
  
  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Test Chat</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetChat}
          disabled={loading}
        >
          Chat zurücksetzen
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>Fehler: {error.message}</p>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto border border-gray-200 rounded-md p-4 mb-4 bg-gray-50 h-[400px]">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Keine Nachrichten. Starten Sie eine Konversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`p-3 rounded-lg max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-auto' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-end">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nachricht eingeben..."
          className="flex-grow resize-none"
          rows={3}
          disabled={loading}
        />
        <Button 
          type="submit" 
          className="ml-2" 
          disabled={loading || !inputValue.trim()}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Senden'}
        </Button>
      </form>
    </div>
  );
}
