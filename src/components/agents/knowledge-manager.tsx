'use client';

import React from 'react';
import { useKnowledge } from '@/hooks/use-knowledge';
import { Knowledge } from '@/lib/types/agent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeUploaderForm } from './knowledge-uploader-form';
import { Button } from '@/components/ui/button';

interface KnowledgeItemProps {
  item: Knowledge;
  onRemove: (id: string) => Promise<void>;
  loading: boolean;
}

function KnowledgeItem({ item, onRemove, loading }: KnowledgeItemProps) {
  return (
    <Card className="mb-3">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {item.type === 'file' && item.filename ? item.filename : 
             item.type === 'url' ? 'URL' : 'Text'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-50 h-7 w-7 p-0"
            onClick={() => onRemove(item.id)}
            disabled={loading}
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className="text-xs text-gray-500">
          {item.type === 'text' 
            ? (item.content.length > 100 
                ? `${item.content.substring(0, 100)}...` 
                : item.content)
            : item.type === 'url'
              ? item.content
              : `Datei vom Typ: ${item.fileType || 'Unbekannt'}`}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Hinzugefügt: {new Date(item.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}

interface KnowledgeManagerProps {
  agentId: string;
  knowledgeItems: Knowledge[];
  onKnowledgeChange?: () => void;
}

export function KnowledgeManager({ 
  agentId, 
  knowledgeItems,
  onKnowledgeChange
}: KnowledgeManagerProps) {
  const { 
    uploadKnowledgeFile, 
    addKnowledgeText, 
    addKnowledgeUrl, 
    removeKnowledge,
    loading, 
    error 
  } = useKnowledge(agentId);
  
  const handleFileUpload = async (file: File) => {
    await uploadKnowledgeFile(file);
    if (onKnowledgeChange) onKnowledgeChange();
  };
  
  const handleTextAdd = async (text: string) => {
    await addKnowledgeText(text);
    if (onKnowledgeChange) onKnowledgeChange();
  };
  
  const handleUrlAdd = async (url: string) => {
    await addKnowledgeUrl(url);
    if (onKnowledgeChange) onKnowledgeChange();
  };
  
  const handleKnowledgeRemove = async (knowledgeId: string) => {
    await removeKnowledge(knowledgeId);
    if (onKnowledgeChange) onKnowledgeChange();
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Knowledge Management</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>Fehler: {error.message}</p>
        </div>
      )}
      
      <KnowledgeUploaderForm
        onUploadFile={handleFileUpload}
        onAddText={handleTextAdd}
        onAddUrl={handleUrlAdd}
        loading={loading}
      />
      
      <h3 className="text-lg font-medium mb-3">Vorhandenes Wissen</h3>
      
      {knowledgeItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            Kein Wissen vorhanden. Fügen Sie Wissen hinzu, um die Fähigkeiten des Agenten zu verbessern.
          </p>
        </div>
      ) : (
        <div>
          {knowledgeItems.map((item) => (
            <KnowledgeItem 
              key={item.id} 
              item={item} 
              onRemove={handleKnowledgeRemove}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
