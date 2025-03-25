import React, { useState } from 'react';
import { Knowledge } from '@/lib/types/agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface KnowledgeUploaderProps {
  knowledgeItems: Knowledge[];
  loading: boolean;
  error: Error | null;
  onUploadFile: (file: File) => Promise<void>;
  onAddText: (text: string) => Promise<void>;
  onAddUrl: (url: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export function KnowledgeUploader({
  knowledgeItems,
  loading,
  error,
  onUploadFile,
  onAddText,
  onAddUrl,
  onRemove
}: KnowledgeUploaderProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'url'>('file');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await onUploadFile(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    
    await onAddText(textInput);
    setTextInput('');
  };
  
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    await onAddUrl(urlInput);
    setUrlInput('');
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Knowledge Management</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>Fehler: {error.message}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'file' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('file')}
          >
            Datei hochladen
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'text' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('text')}
          >
            Text hinzufügen
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'url' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('url')}
          >
            URL hinzufügen
          </button>
        </div>
        
        <div className="mt-4">
          {activeTab === 'file' && (
            <div>
              <div className="w-full">
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  onChange={handleFileChange}
                  disabled={loading}
                  accept=".txt,.pdf,.md"
                  ref={fileInputRef}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Unterstützte Dateitypen: .txt, .pdf, .md
              </p>
            </div>
          )}
          
          {activeTab === 'text' && (
            <form onSubmit={handleTextSubmit}>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Geben Sie Text ein, der dem Agenten als Wissen hinzugefügt werden soll..."
                rows={5}
                disabled={loading}
                className="mb-2"
              />
              <Button 
                type="submit" 
                disabled={loading || !textInput.trim()}
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Text hinzufügen'}
              </Button>
            </form>
          )}
          
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit}>
              <Input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/document.pdf"
                disabled={loading}
                className="mb-2"
              />
              <Button 
                type="submit" 
                disabled={loading || !urlInput.trim()}
              >
                {loading ? <LoadingSpinner size="sm" /> : 'URL hinzufügen'}
              </Button>
            </form>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-3">Vorhandenes Wissen</h3>
      
      {knowledgeItems.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            Kein Wissen vorhanden. Fügen Sie Wissen hinzu, um die Fähigkeiten des Agenten zu verbessern.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {knowledgeItems.map((item) => (
            <Card key={item.id}>
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
          ))}
        </div>
      )}
    </div>
  );
}
