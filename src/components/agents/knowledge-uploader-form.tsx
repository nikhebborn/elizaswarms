'use client';

import React, { useState } from 'react';
import { Knowledge } from '@/lib/types/agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { isValidFileType, formatFileSize } from '@/lib/utils/helpers';

interface KnowledgeUploaderFormProps {
  onUploadFile: (file: File) => Promise<void>;
  onAddText: (text: string) => Promise<void>;
  onAddUrl: (url: string) => Promise<void>;
  loading: boolean;
}

export function KnowledgeUploaderForm({
  onUploadFile,
  onAddText,
  onAddUrl,
  loading
}: KnowledgeUploaderFormProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'url'>('file');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFileError(null);
    
    if (files && files.length > 0) {
      const file = files[0];
      
      if (!isValidFileType(file)) {
        setFileError('Ungültiger Dateityp. Unterstützte Typen: .txt, .pdf, .md');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setFileError(`Datei zu groß (${formatFileSize(file.size)}). Maximale Größe: 10MB`);
        return;
      }
      
      await onUploadFile(file);
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
    <div className="mb-6">
      <div className="flex border-b border-gray-200">
        <button
          type="button"
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
          type="button"
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
          type="button"
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
              {fileError && (
                <p className="mt-1 text-sm text-red-600">{fileError}</p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Unterstützte Dateitypen: .txt, .pdf, .md (max. 10MB)
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
  );
}
